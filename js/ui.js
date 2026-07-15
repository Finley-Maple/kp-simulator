// =============================================================================
// ui.js — DOM rendering + interaction wiring.
// Depends on: data/cases.js (caseSeries, evaluationInstructions),
//             js/speech.js (KPSpeech), js/feedback.js (KPFeedback).
// Exposes window.KPApp.init().
// =============================================================================
(function () {
  "use strict";

  var STORAGE_KEY = "kp_sim_answered";
  var state = { caseIdx: 0, qIdx: 0, seconds: 0, timer: null, dictation: null, dictating: false };

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

  // ---- dictation -----------------------------------------------------------
  function stopDictation() {
    state.dictating = false;
    if (state.dictation) state.dictation.stop();
    $("btn-record").innerHTML = '<i class="ti ti-microphone" aria-hidden="true"></i> Aufnehmen';
    $("rec-status").classList.add("hidden");
  }
  function toggleDictation() {
    if (state.dictating) { stopDictation(); return; }
    if (!state.dictation) {
      state.dictation = KPSpeech.createDictation({
        onText: function (t) { $("answer").value = t; },
        onError: function () { $("rec-warning").classList.remove("hidden"); }
      });
    }
    if (!state.dictation) { $("rec-warning").classList.remove("hidden"); return; }
    var ok = state.dictation.start($("answer").value);
    if (!ok) { $("rec-warning").classList.remove("hidden"); return; }
    state.dictating = true;
    $("btn-record").innerHTML = '<i class="ti ti-player-stop" aria-hidden="true"></i> Stopp';
    $("rec-status").classList.remove("hidden");
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
    stopDictation();
    $("copy-fallback").classList.add("hidden");
    $("feedback-box").classList.add("hidden");

    var c = caseSeries[state.caseIdx];
    var flat = flatQuestions(c);
    if (state.qIdx >= flat.length) state.qIdx = flat.length - 1;
    var current = flat[state.qIdx];
    var phaseShort = current.phaseName.split(":")[0];

    $("case-title").textContent = c.caseTitle;
    $("vignette").textContent = c.initialVignette;
    $("phase-badge").textContent = phaseShort;
    $("question-text").textContent = current.q.text;
    $("progress").textContent = "Fall " + (state.caseIdx + 1) + "/" + caseSeries.length +
      " · " + phaseShort + " · Frage " + (state.qIdx + 1) + " von " + flat.length;
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
    stopDictation();
    var p = currentPayload();
    if (!p.answer) {
      showFeedback("Bitte geben Sie zuerst eine Antwort ein (tippen oder diktieren).");
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
    $("btn-read").addEventListener("click", function () {
      KPSpeech.speak(currentPayload().questionText);
    });
    $("btn-record").addEventListener("click", toggleDictation);
    if (!KPSpeech.supportsDictation()) $("rec-warning").classList.remove("hidden");

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
