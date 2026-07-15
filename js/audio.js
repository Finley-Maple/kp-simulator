// =============================================================================
// audio.js — Phase A audio: neural TTS, real recording, transcription.
// Exposes window.KPAudio. Depends on KPSpeech (fallback TTS) and KPFeedback
// (shares the OpenAI key via KPFeedback.getConfig()).
//
//   speak(text, opts)   -> OpenAI neural TTS if an OpenAI key is present,
//                          otherwise browser Web Speech. Clean stop via <audio>.
//   startRecording()    -> MediaRecorder; captures REAL audio locally (free).
//   stopRecording()     -> resolves to an audio Blob you can replay/keep.
//   transcribe(blob)    -> OpenAI transcription (needs an OpenAI key).
//
// TTS and transcription require the OpenAI provider; recording is local and
// works with no key at all. If an OpenAI call fails, TTS falls back to browser
// speech so read-aloud always works.
// =============================================================================
(function () {
  "use strict";

  var strip = (window.KPSpeech && KPSpeech.stripHints) ? KPSpeech.stripHints : function (t) { return t; };

  var currentAudio = null;   // HTMLAudioElement for neural playback
  var speaking = false;
  var mediaRecorder = null, chunks = [], stream = null, recording = false;

  function cfg() { return (window.KPFeedback && KPFeedback.getConfig) ? KPFeedback.getConfig() : {}; }
  function hasOpenAIKey() { var c = cfg(); return c.provider === "openai" && !!c.apiKey; }
  function openAIBase() { var c = cfg(); return c.baseUrl ? c.baseUrl.replace(/\/+$/, "") : "https://api.openai.com/v1"; }

  // ---- Text-to-speech -----------------------------------------------------
  function stopSpeak() {
    speaking = false;
    if (currentAudio) { try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {} currentAudio = null; }
    if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  }

  function webSpeech(clean, opts) {
    if (window.KPSpeech && KPSpeech.speak) KPSpeech.speak(clean, { onend: opts.onend });
    else if (opts.onend) opts.onend();
  }

  // Returns a Promise. Resolves once playback has *started* (or synthesis queued).
  function speak(text, opts) {
    opts = opts || {};
    stopSpeak();
    var clean = strip(text);

    if (!hasOpenAIKey()) { webSpeech(clean, opts); return Promise.resolve(null); }

    speaking = true;
    var c = cfg();
    return fetch(openAIBase() + "/audio/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + c.apiKey },
      body: JSON.stringify({
        model: opts.model || "tts-1",
        voice: opts.voice || "alloy",
        input: clean,
        response_format: "mp3"
      })
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (d) { throw new Error((d.error && d.error.message) || ("HTTP " + r.status)); });
      return r.blob();
    }).then(function (blob) {
      if (!speaking) return null;            // stopped while fetching
      var url = URL.createObjectURL(blob);
      var a = new Audio(url);
      currentAudio = a;
      a.onended = function () { speaking = false; currentAudio = null; try { URL.revokeObjectURL(url); } catch (e) {} if (opts.onend) opts.onend(); };
      a.play();
      return a;
    }).catch(function (err) {
      speaking = false;
      webSpeech(clean, opts);                // graceful fallback to browser TTS
      if (opts.onerror) opts.onerror(err);
      return null;
    });
  }

  function isSpeaking() { return speaking; }

  // ---- Recording (MediaRecorder — local, free, proper start/stop) ----------
  function recordingSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  function startRecording() {
    if (!recordingSupported()) return Promise.reject(new Error("Aufnahme wird in diesem Browser nicht unterstützt."));
    return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      stream = s; chunks = [];
      mediaRecorder = new MediaRecorder(s);
      mediaRecorder.ondataavailable = function (e) { if (e.data && e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.start();
      recording = true;
      return true;
    });
  }

  function stopRecording() {
    return new Promise(function (resolve, reject) {
      if (!mediaRecorder || !recording) { resolve(null); return; }
      mediaRecorder.onstop = function () {
        recording = false;
        try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
        var type = (chunks[0] && chunks[0].type) || "audio/webm";
        resolve(new Blob(chunks, { type: type }));
      };
      try { mediaRecorder.stop(); } catch (e) { recording = false; reject(e); }
    });
  }

  function isRecording() { return recording; }

  // ---- Transcription (OpenAI) ----------------------------------------------
  function transcribe(blob, opts) {
    opts = opts || {};
    if (!hasOpenAIKey()) return Promise.reject(new Error("Transkription benötigt einen OpenAI-Schlüssel."));
    var c = cfg();
    var ext = blob.type.indexOf("webm") > -1 ? "webm" : (blob.type.indexOf("mp4") > -1 || blob.type.indexOf("mp4a") > -1 ? "mp4" : (blob.type.indexOf("ogg") > -1 ? "ogg" : "wav"));
    var fd = new FormData();
    fd.append("file", blob, "answer." + ext);
    fd.append("model", opts.model || "gpt-4o-mini-transcribe");
    fd.append("language", "de");
    return fetch(openAIBase() + "/audio/transcriptions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + c.apiKey },
      body: fd
    }).then(function (r) {
      return r.json().then(function (d) {
        if (!r.ok) throw new Error((d.error && d.error.message) || ("HTTP " + r.status));
        return (d.text || "").trim();
      });
    });
  }

  // ---- Local transcription (Whisper via Transformers.js, WebGPU/WASM) ------
  // Fully offline after a one-time model download; audio never leaves the device.
  var WHISPER_CDN = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/+esm";
  var WHISPER_MODEL = "Xenova/whisper-base"; // multilingual; good German, ~145 MB
  var whisperPipe = null, whisperLoading = null;

  function localTranscriptionSupported() {
    // Needs WebAssembly + an AudioContext (WebGPU is used when available, else WASM).
    var hasAudioCtx = typeof window.AudioContext !== "undefined" || typeof window.webkitAudioContext !== "undefined";
    return typeof WebAssembly !== "undefined" && hasAudioCtx;
  }

  function loadWhisper(onProgress) {
    if (whisperPipe) return Promise.resolve(whisperPipe);
    if (whisperLoading) return whisperLoading;
    whisperLoading = import(/* webpackIgnore: true */ WHISPER_CDN).then(function (mod) {
      return mod.pipeline("automatic-speech-recognition", WHISPER_MODEL, { device: "webgpu", progress_callback: onProgress })
        .catch(function () {
          // Fall back to WASM if WebGPU is unavailable/unsupported.
          return mod.pipeline("automatic-speech-recognition", WHISPER_MODEL, { progress_callback: onProgress });
        });
    }).then(function (p) { whisperPipe = p; return p; });
    return whisperLoading;
  }

  // Decode a recorded Blob to mono 16 kHz Float32 PCM (what Whisper expects).
  function blobToPcm16k(blob) {
    return blob.arrayBuffer().then(function (buf) {
      var AC = window.AudioContext || window.webkitAudioContext;
      var ctx = new AC();
      return ctx.decodeAudioData(buf).then(function (audioBuf) {
        try { ctx.close(); } catch (e) {}
        var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        var frames = Math.ceil(audioBuf.duration * 16000);
        var off = new OAC(1, frames, 16000);
        var src = off.createBufferSource();
        src.buffer = audioBuf;
        src.connect(off.destination);
        src.start(0);
        return off.startRendering().then(function (rendered) { return rendered.getChannelData(0); });
      });
    });
  }

  function transcribeLocal(blob, opts) {
    opts = opts || {};
    return loadWhisper(opts.onProgress).then(function (pipe) {
      return blobToPcm16k(blob).then(function (pcm) {
        return pipe(pcm, { language: "german", task: "transcribe", chunk_length_s: 30, stride_length_s: 5 });
      });
    }).then(function (out) {
      var text = out && (typeof out.text === "string" ? out.text : (Array.isArray(out) && out[0] && out[0].text));
      return (text || "").trim();
    });
  }

  window.KPAudio = {
    speak: speak,
    stopSpeak: stopSpeak,
    isSpeaking: isSpeaking,
    startRecording: startRecording,
    stopRecording: stopRecording,
    isRecording: isRecording,
    recordingSupported: recordingSupported,
    transcribe: transcribe,
    transcribeLocal: transcribeLocal,
    localTranscriptionSupported: localTranscriptionSupported,
    hasOpenAIKey: hasOpenAIKey
  };
})();
