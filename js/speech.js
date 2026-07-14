// =============================================================================
// speech.js — Read-aloud (TTS) + browser dictation (STT)
// Exposes window.KPSpeech. No external dependencies.
// =============================================================================
(function () {
  "use strict";

  // Remove [bracketed hints] so the TTS doesn't read image cues aloud.
  function stripHints(text) {
    var out = "", inBracket = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ch === "[") { inBracket = true; continue; }
      if (ch === "]") { inBracket = false; continue; }
      if (!inBracket) out += ch;
    }
    return out.replace(/\s+/g, " ").trim();
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(stripHints(text));
      utter.lang = "de-DE";
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    } catch (e) { /* no-op */ }
  }

  // ---- Dictation via Web Speech API (webkitSpeechRecognition) --------------
  // Browser-dependent and frequently blocked in embedded/iframe contexts.
  // Callers should provide onText(fullText) and onError() callbacks.
  function createDictation(opts) {
    opts = opts || {};
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    var recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "de-DE";

    var base = "";
    var active = false;

    recognition.onresult = function (event) {
      var finalChunk = "", interimChunk = "";
      for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalChunk += event.results[i][0].transcript;
        else interimChunk += event.results[i][0].transcript;
      }
      if (finalChunk) base = (base + " " + finalChunk).trim();
      if (opts.onText) opts.onText((base + " " + interimChunk).trim());
    };
    recognition.onerror = function () { if (opts.onError) opts.onError(); stop(); };
    recognition.onend = function () {
      if (active) { try { recognition.start(); } catch (e) { stop(); } }
    };

    function start(seedText) {
      base = seedText || "";
      try {
        recognition.start();
        active = true;
        return true;
      } catch (e) { return false; }
    }
    function stop() {
      active = false;
      try { recognition.stop(); } catch (e) { /* no-op */ }
    }
    function isActive() { return active; }

    return { start: start, stop: stop, isActive: isActive };
  }

  window.KPSpeech = {
    stripHints: stripHints,
    speak: speak,
    createDictation: createDictation,
    supportsDictation: function () {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    },
    supportsTTS: function () { return "speechSynthesis" in window; }
  };
})();
