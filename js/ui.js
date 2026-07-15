// =============================================================================
// ui.js — DOM rendering + interaction wiring.
// Depends on: data/cases.js (caseSeries, evaluationInstructions),
//             js/speech.js (KPSpeech), js/feedback.js (KPFeedback),
//             js/audio.js (KPAudio — neural TTS, recording, transcription).
// Exposes window.KPApp.init().
// =============================================================================
(function () {
  "use strict";

  var STORAGE_KEY = "kp_sim_answered";
  var EXAM_MODE_KEY = "kp_sim_exam_mode";
  var state = { caseIdx: 0, qIdx: 0, seconds: 0, timer: null, reading: false, recording: false, examMode: true };

  function loadExamMode() {
    try { var v = localStorage.getItem(EXAM_MODE_KEY); return v === null ? true : v === "1"; } catch (e) { return true; }
  }
  function saveExamMode(on) { try { localStorage.setItem(EXAM_MODE_KEY, on ? "1" : "0"); } catch (e) {} }

  // Apply exam-mode visibility to the current question + diagnosis.
  function applyExamMode() {
    var hide = state.examMode;
    // Question: hidden -> show placeholder + Vorlesen only.
    $("question-hidden").classList.toggle("hidden", !hide);
    $("question-text").classList.toggle("hidden", hide);
    // Diagnosis: exam mode -> show "aufdecken" button, hide the text;
    //            exam off  -> hide the button, show the text.
    $("reveal-diagnosis").classList.toggle("hidden", !hide);
    $("diagnosis-text").classList.toggle("hidden", hide);
  }

  function $(id) { return document.getElementById(id); }

  // ---- answered-tracking (progress only; no sensitive data) ----------------
  function getAnswered() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (e) { return []; }
  }
  function markAnswered(key) {
    var a = getAnswered();
    if (a.indexOf(key) === -1) { a.push(key); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); } catch (e) {} }
  }

  function flatQuestions(c) {
    var out = [];
    c.phases.forEach(function (p, pi) {
      p.questions.forEach(function (q) { out.push({ phaseName: p.phaseName, phaseIdx: pi, q: q }); });
    });
    return out;
  }

  // ---- timer ---------------------------------------------------------------
  function resetTimer() {
    state.seconds = 0;
    $("timer").textContent = "00:00";
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(function () {
      state.seconds++;
      var m = Math.floor(state.seconds / 60).toString().padStart(2, "0");
      var s = (state.seconds % 60).toString().padStart(2, "0");
      $("timer").textContent = m + ":" + s;
    }, 1000);
  }

  // ---- read-aloud (neural TTS + clean stop) --------------------------------
  function setReadBtn(active) {
    $("btn-read").innerHTML = active
      ? '<i class="ti ti-player-stop" aria-hidden="true"></i> Stopp'
      : '<i class="ti ti-player-play" aria-hidden="true"></i> Vorlesen';
  }
  function stopReading() { KPAudio.stopSpeak(); state.reading = false; setReadBtn(false); }
  function toggleRead() {
    if (state.reading) { stopReading(); return; }
    state.reading = true; setReadBtn(true);
    var voiceEl = $("tts-voice");
    KPAudio.speak(currentPayload().questionText, {
      voice: voiceEl ? voiceEl.value : "alloy",
      onend: function () { state.reading = false; setReadBtn(false); },
      onerror: function () { state.reading = false; setReadBtn(false); }
    });
  }

  // ---- recording (MediaRecorder — real audio + proper stop) ----------------
  function setRecordBtn(active) {
    $("btn-record").innerHTML = active
      ? '<i class="ti ti-player-stop" aria-hidden="true"></i> Stopp (Aufnahme)'
      : '<i class="ti ti-microphone" aria-hidden="true"></i> Aufnehmen';
  }
  function resetRecordingUI() {
    state.recording = false;
    setRecordBtn(false);
    $("rec-status").classList.add("hidden");
  }
  function clearPlayback() {
    var a = $("answer-audio");
    if (a) {
      try { if (a.src) URL.revokeObjectURL(a.src); } catch (e) {}
      a.removeAttribute("src"); a.classList.add("hidden");
    }
    $("rec-note").classList.add("hidden");
  }

  function toggleRecord() {
    if (state.recording) { finishRecording(); return; }
    if (!KPAudio.recordingSupported()) {
      $("rec-note").textContent = "Aufnahme wird in diesem Browser nicht unterstützt. Bitte tippen Sie Ihre Antwort.";
      $("rec-note").classList.remove("hidden");
      return;
    }
    clearPlayback();
    KPAudio.startRecording().then(function () {
      state.recording = true;
      setRecordBtn(true);
      $("rec-status").textContent = "Aufnahme läuft …";
      $("rec-status").classList.remove("hidden");
    }).catch(function (err) {
      resetRecordingUI();
      $("rec-note").textContent = "Mikrofon nicht verfügbar: " + err.message;
      $("rec-note").classList.remove("hidden");
    });
  }

  function finishRecording() {
    $("rec-status").textContent = "Verarbeite Aufnahme …";
    KPAudio.stopRecording().then(function (blob) {
      resetRecordingUI();
      if (!blob) return;
      // Keep the audio: show a replayable player.
      var a = $("answer-audio");
      a.src = URL.createObjectURL(blob);
      a.classList.remove("hidden");
      // Transcribe: OpenAI if a key is set, otherwise local Whisper (offline).
      $("rec-note").classList.remove("hidden");
      var insert = function (text) {
        var existing = $("answer").value.trim();
        $("answer").value = existing ? (existing + " " + text) : text;
      };

      if (KPAudio.hasOpenAIKey()) {
        $("rec-note").textContent = "Transkribiere (OpenAI) …";
        KPAudio.transcribe(blob).then(function (text) {
          insert(text);
          $("rec-note").textContent = "Transkribiert. Aufnahme bleibt zum Abspielen erhalten.";
        }).catch(function (err) {
          $("rec-note").textContent = "Transkription fehlgeschlagen: " + err.message + " Aufnahme bleibt gespeichert; tippen Sie ggf. Ihre Antwort.";
        });
      } else if (KPAudio.localTranscriptionSupported()) {
        $("rec-note").textContent = "Lade lokales Spracherkennungsmodell (einmaliger Download) …";
        KPAudio.transcribeLocal(blob, {
          onProgress: function (p) {
            if (p && p.status === "progress" && typeof p.progress === "number") {
              $("rec-note").textContent = "Lade Spracherkennung … " + Math.round(p.progress) + "%";
            } else if (p && p.status === "ready") {
              $("rec-note").textContent = "Transkribiere lokal …";
            }
          }
        }).then(function (text) {
          insert(text);
          $("rec-note").textContent = "Lokal transkribiert (offline). Aufnahme bleibt zum Abspielen erhalten.";
        }).catch(function (err) {
          $("rec-note").textContent = "Lokale Transkription fehlgeschlagen: " + err.message +
            " Aufnahme bleibt gespeichert. Tipp: moderner Browser (Chrome/Edge) mit WebGPU, oder OpenAI-Schlüssel nutzen — oder Antwort tippen.";
        });
      } else {
        $("rec-note").textContent = "Aufnahme gespeichert (abspielbar). Automatische Transkription hier nicht verfügbar — OpenAI-Schlüssel hinterlegen oder Antwort tippen.";
      }
    }).catch(function (err) {
      resetRecordingUI();
      $("rec-note").textContent = "Aufnahme fehlgeschlagen: " + err.message;
      $("rec-note").classList.remove("hidden");
    });
  }

  // ---- tracker -------------------------------------------------------------
  function renderTracker(c, flat) {
    var answered = getAnswered();
    var html = "";
    c.phases.forEach(function (p, pi) {
      var done = p.questions.filter(function (q) { return answered.indexOf(c.id + "_" + q.id) > -1; }).length;
      var active = flat[state.qIdx].phaseIdx === pi;
      var label = p.phaseName.indexOf(":") > -1 ? p.phaseName.substring(p.phaseName.indexOf(":") + 1).trim() : p.phaseName;
      var complete = done === p.questions.length;
      html += '<div style="display:flex; align-items:center; gap:8px; padding:6px 0; font-size:13px; ' +
        (active ? 'color:var(--text-primary); font-weight:500;' : 'color:var(--text-muted);') + '">' +
        '<span style="width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; ' +
        (complete ? 'background:var(--bg-success); color:var(--text-success);' : 'background:var(--surface-2); border:0.5px solid var(--border);') + '">' +
        (complete ? '<i class="ti ti-check" style="font-size:11px;" aria-hidden="true"></i>' : (pi + 1)) + '</span>' +
        label + ' (' + done + '/' + p.questions.length + ')' + '</div>';
    });
    $("phase-tracker").innerHTML = html;
  }

  // ---- main render ---------------------------------------------------------
  function render() {
    stopReading();
    if (state.recording) { KPAudio.stopRecording().catch(function () {}); }
    resetRecordingUI();
    clearPlayback();
    $("copy-fallback").classList.add("hidden");
    $("feedback-box").classList.add("hidden");

    var c = caseSeries[state.caseIdx];
    var flat = flatQuestions(c);
    if (state.qIdx >= flat.length) state.qIdx = flat.length - 1;
    var current = flat[state.qIdx];
    // Show the station name (e.g. "Radiologie und Bildgebung") rather than the
    // bare "Teil N" prefix.
    var phaseStation = current.phaseName.indexOf(":") > -1
      ? current.phaseName.substring(current.phaseName.indexOf(":") + 1).trim()
      : current.phaseName;

    $("case-title").textContent = c.caseTitle;
    $("diagnosis-text").textContent = c.diagnosis || "—";
    $("vignette").textContent = c.initialVignette;
    $("phase-badge").textContent = phaseStation;
    $("question-text").textContent = current.q.text;
    applyExamMode();
    $("progress").textContent = "Fall " + (state.caseIdx + 1) + "/" + caseSeries.length +
      " · " + phaseStation + " · Frage " + (state.qIdx + 1) + " von " + flat.length;
    $("answer").value = "";
    $("btn-prev-q").disabled = (state.qIdx === 0);
    $("btn-next-q").disabled = (state.qIdx === flat.length - 1);

    // Optional model answer (learning aid).
    if (current.q.modelAnswer) {
      $("model-answer").classList.remove("hidden");
      $("model-answer-body").textContent = current.q.modelAnswer;
      $("model-answer").open = false;
    } else {
      $("model-answer").classList.add("hidden");
    }

    renderTracker(c, flat);
    resetTimer();
  }

  function currentPayload() {
    var c = caseSeries[state.caseIdx];
    var flat = flatQuestions(c);
    var current = flat[state.qIdx];
    return {
      caseTitle: c.caseTitle,
      vignette: c.initialVignette,
      phaseName: current.phaseName,
      questionText: current.q.text,
      modelAnswer: current.q.modelAnswer || "",
      answer: $("answer").value.trim(),
      _c: c, _current: current, _flat: flat
    };
  }

  // ---- feedback ------------------------------------------------------------
  function showFeedback(text) {
    $("feedback-box").classList.remove("hidden");
    $("feedback-text").textContent = text;
  }
  function showCopyFallback(text) {
    $("copy-fallback").classList.remove("hidden");
    $("copy-text").value = text;
    if ($("copy-fallback").scrollIntoView) $("copy-fallback").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function requestFeedback() {
    stopReading();
    var p = currentPayload();
    if (!p.answer) {
      showFeedback("Bitte geben Sie zuerst eine Antwort ein (tippen, aufnehmen oder transkribieren).");
      return;
    }
    markAnswered(p._c.id + "_" + p._current.q.id);
    renderTracker(p._c, p._flat);

    $("feedback-box").classList.remove("hidden");
    $("feedback-text").textContent = "Bewertung wird erstellt …";

    KPFeedback.evaluate(p, evaluationInstructions).then(function (res) {
      if (res.mode === "llm") {
        showFeedback(res.text);
      } else if (res.mode === "host") {
        showFeedback("Antwort an den Chat-Assistenten zur Bewertung gesendet.");
      } else {
        $("feedback-box").classList.add("hidden");
        showCopyFallback(res.text);
      }
    }).catch(function (err) {
      showFeedback("Fehler bei der LLM-Bewertung: " + err.message +
        "\nPrüfen Sie den API-Schlüssel/das Modell, oder nutzen Sie die Kopier-Option unten.");
      showCopyFallback(KPFeedback.buildPrompt(p, evaluationInstructions));
    });
  }

  // ---- API-key settings ----------------------------------------------------
  function refreshKeyStatus() {
    var el = $("key-status");
    if (KPFeedback.hasKey()) {
      var where = KPFeedback.isRemembered() ? "auf diesem Gerät gespeichert" : "nur im Arbeitsspeicher";
      el.innerHTML = '<span style="color:var(--text-success);">● Schlüssel aktiv (' +
        KPFeedback.getProvider() + ', ' + where + ')</span>';
    } else if (typeof window.sendPrompt === "function") {
      el.innerHTML = '<span class="muted">Kein Schlüssel — Bewertung läuft über den Chat-Host.</span>';
    } else {
      el.innerHTML = '<span class="muted">Kein Schlüssel — Bewertung über Kopieren &amp; Einfügen.</span>';
    }
  }

  function saveKey() {
    KPFeedback.setConfig({
      provider: $("provider-select").value,
      apiKey: $("api-key-input").value,
      model: $("model-input").value,
      baseUrl: $("baseurl-input").value,
      remember: $("remember-key").checked
    });
    $("api-key-input").value = ""; // do not leave the key in the DOM
    refreshKeyStatus();
  }
  function clearKey() {
    KPFeedback.clearKey();
    $("api-key-input").value = "";
    $("remember-key").checked = false;
    refreshKeyStatus();
  }

  function syncModelPlaceholder() {
    var prov = $("provider-select").value;
    $("model-input").placeholder = KPFeedback.DEFAULT_MODELS[prov] || "";
  }

  // ---- init ----------------------------------------------------------------
  function init() {
    $("btn-read").addEventListener("click", toggleRead);
    $("btn-record").addEventListener("click", toggleRecord);

    // Reveal toggles (per question/case) + exam-mode switch.
    $("reveal-question").addEventListener("click", function () {
      $("question-hidden").classList.add("hidden");
      $("question-text").classList.remove("hidden");
    });
    $("reveal-diagnosis").addEventListener("click", function () {
      $("reveal-diagnosis").classList.add("hidden");
      $("diagnosis-text").classList.remove("hidden");
    });
    state.examMode = loadExamMode();
    $("exam-mode").checked = state.examMode;
    $("exam-mode").addEventListener("change", function () {
      state.examMode = $("exam-mode").checked;
      saveExamMode(state.examMode);
      applyExamMode();
    });

    $("btn-prev-case").addEventListener("click", function () {
      state.caseIdx = (state.caseIdx - 1 + caseSeries.length) % caseSeries.length; state.qIdx = 0; render();
    });
    $("btn-next-case").addEventListener("click", function () {
      state.caseIdx = (state.caseIdx + 1) % caseSeries.length; state.qIdx = 0; render();
    });
    $("btn-random-case").addEventListener("click", function () {
      state.caseIdx = Math.floor(Math.random() * caseSeries.length); state.qIdx = 0; render();
    });
    $("btn-prev-q").addEventListener("click", function () { if (state.qIdx > 0) { state.qIdx--; render(); } });
    $("btn-next-q").addEventListener("click", function () {
      var flat = flatQuestions(caseSeries[state.caseIdx]);
      if (state.qIdx < flat.length - 1) { state.qIdx++; render(); }
    });
    $("btn-feedback").addEventListener("click", requestFeedback);

    $("btn-copy").addEventListener("click", function () {
      var t = $("copy-text"); t.select();
      try { document.execCommand("copy"); } catch (e) {}
      if (navigator.clipboard) navigator.clipboard.writeText(t.value).catch(function () {});
    });

    $("save-key").addEventListener("click", saveKey);
    $("clear-key").addEventListener("click", clearKey);
    $("provider-select").addEventListener("change", syncModelPlaceholder);

    // Restore a remembered key (if the user previously opted in).
    if (KPFeedback.loadPersisted()) {
      $("provider-select").value = KPFeedback.getProvider();
      $("remember-key").checked = true;
      if (KPFeedback.getBaseUrl()) $("baseurl-input").value = KPFeedback.getBaseUrl();
    }

    syncModelPlaceholder();
    refreshKeyStatus();
    render();
  }

  window.KPApp = { init: init };
})();
