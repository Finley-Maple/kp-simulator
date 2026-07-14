// =============================================================================
// feedback.js — Examiner-style feedback for a learner's answer.
// Exposes window.KPFeedback.
//
// THREE DELIVERY MODES, tried in order:
//   1. "llm"  — a user-supplied API key is present -> call the LLM directly.
//   2. "host" — no key, but running inside a host that provides
//               window.sendPrompt (e.g. Anthropic Cowork chat).
//   3. "copy" — standalone with no key -> copy prompt to clipboard for manual
//               pasting into any assistant.
//
// SECURITY MODEL (important — read before deploying publicly):
//   The API key lives ONLY in memory (a module-scoped variable). It is never
//   written to localStorage, sessionStorage, cookies, or any file, and is lost
//   on refresh. Each user pastes THEIR OWN key for THEIR OWN session.
//   Even so, any client-side key call is visible in the browser's Network tab
//   and to anyone with access to the machine while the key is entered. Do NOT
//   hard-code a shared key into this file and host it publicly. For a shared
//   deployment, put the key behind a minimal server-side proxy instead (see
//   README "Deploying as a shared tool").
// =============================================================================
(function () {
  "use strict";

  // In-memory only. Cleared on page reload.
  var state = { provider: "openai", apiKey: "", model: "" };

  var DEFAULT_MODELS = {
    openai: "gpt-4o-mini",
    anthropic: "claude-3-5-haiku-latest"
  };

  function setConfig(cfg) {
    if (cfg.provider) state.provider = cfg.provider;
    if (typeof cfg.apiKey === "string") state.apiKey = cfg.apiKey.trim();
    if (typeof cfg.model === "string") state.model = cfg.model.trim();
  }
  function clearKey() { state.apiKey = ""; }
  function hasKey() { return !!state.apiKey; }
  function getProvider() { return state.provider; }

  function buildPrompt(payload, instructions) {
    var lines = [
      "Simulation der mündlichen Kenntnisprüfung. Bitte als Prüfer bewerten.",
      "",
      "Fall: " + payload.caseTitle,
      "Vignette: " + payload.vignette,
      "Station: " + payload.phaseName,
      "Frage: " + payload.questionText,
      ""
    ];
    if (payload.modelAnswer) {
      lines.push("Erwartete Kernpunkte (Referenz für dich, nicht dem Prüfling vorlesen): " + payload.modelAnswer, "");
    }
    lines.push("Antwort des Prüflings: " + (payload.answer || "(keine Antwort abgegeben)"), "", instructions);
    return lines.join("\n");
  }

  // ---- Direct LLM calls ----------------------------------------------------
  function callOpenAI(prompt, model) {
    return fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + state.apiKey
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODELS.openai,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 700
      })
    }).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) throw new Error((data.error && data.error.message) || ("HTTP " + r.status));
        return data.choices[0].message.content.trim();
      });
    });
  }

  function callAnthropic(prompt, model) {
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": state.apiKey,
        "anthropic-version": "2023-06-01",
        // Required to allow calls directly from a browser.
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODELS.anthropic,
        max_tokens: 700,
        messages: [{ role: "user", content: prompt }]
      })
    }).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) throw new Error((data.error && data.error.message) || ("HTTP " + r.status));
        return data.content[0].text.trim();
      });
    });
  }

  // ---- Public entry --------------------------------------------------------
  // Returns a Promise resolving to { mode, text } where:
  //   mode "llm"  -> text is the examiner feedback
  //   mode "host" -> text is the prompt that was handed to the host
  //   mode "copy" -> text is the prompt to copy
  function evaluate(payload, instructions) {
    var prompt = buildPrompt(payload, instructions);

    if (hasKey()) {
      var model = state.model || DEFAULT_MODELS[state.provider];
      var call = state.provider === "anthropic" ? callAnthropic : callOpenAI;
      return call(prompt, model).then(function (feedback) {
        return { mode: "llm", text: feedback };
      });
    }

    if (typeof window.sendPrompt === "function") {
      try { window.sendPrompt(prompt); } catch (e) { /* fall through */ }
      return Promise.resolve({ mode: "host", text: prompt });
    }

    return Promise.resolve({ mode: "copy", text: prompt });
  }

  window.KPFeedback = {
    setConfig: setConfig,
    clearKey: clearKey,
    hasKey: hasKey,
    getProvider: getProvider,
    buildPrompt: buildPrompt,
    evaluate: evaluate,
    DEFAULT_MODELS: DEFAULT_MODELS
  };
})();
