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
// KEY STORAGE:
//   By default the key lives ONLY in memory and is lost on refresh (safest).
//   The user may opt in to "remember on this device", which persists the config
//   to localStorage so it survives refresh/restart. That trades safety for
//   convenience — a persisted key is readable by any script on this origin and
//   by anyone with access to the machine. Fine for your own machine with your
//   own key; do NOT persist on a shared/public deployment.
//
// PROVIDER NOTES:
//   OpenAI and Anthropic return CORS headers, so direct browser calls work.
//   DeepSeek's API does NOT send CORS headers, so a direct browser call is
//   blocked by the browser (you'll see a network/"Failed to fetch" error even
//   with a valid key). To use DeepSeek from a static page, route it through a
//   proxy and put the proxy URL in the "Basis-URL" field (see README).
// =============================================================================
(function () {
  "use strict";

  var STORE_KEY = "kp_sim_llm_cfg";

  // In-memory config. `baseUrl` optionally overrides the provider endpoint
  // (e.g. a CORS proxy). `remember` mirrors the persistence choice.
  var state = { provider: "openai", apiKey: "", model: "", baseUrl: "", remember: false };

  var DEFAULT_MODELS = {
    openai: "gpt-4o-mini",
    anthropic: "claude-3-5-haiku-latest",
    deepseek: "deepseek-v4-flash",
    gemini: "gemini-2.5-flash"
  };

  // OpenAI-compatible providers share request/response shape; only base URL differs.
  var OPENAI_COMPATIBLE_BASE = {
    openai: "https://api.openai.com/v1",
    deepseek: "https://api.deepseek.com/v1"
  };

  var GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

  function baseFor(provider) {
    if (state.baseUrl) return state.baseUrl.replace(/\/+$/, "");
    return OPENAI_COMPATIBLE_BASE[provider] || OPENAI_COMPATIBLE_BASE.openai;
  }

  // ---- persistence ---------------------------------------------------------
  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        provider: state.provider, apiKey: state.apiKey, model: state.model, baseUrl: state.baseUrl
      }));
    } catch (e) { /* storage unavailable */ }
  }
  function dropPersisted() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* no-op */ }
  }
  // Load a previously remembered config into memory. Returns true if found.
  function loadPersisted() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return false;
      var cfg = JSON.parse(raw);
      state.provider = cfg.provider || state.provider;
      state.apiKey = cfg.apiKey || "";
      state.model = cfg.model || "";
      state.baseUrl = cfg.baseUrl || "";
      state.remember = true;
      return !!state.apiKey;
    } catch (e) { return false; }
  }

  function setConfig(cfg) {
    if (cfg.provider) state.provider = cfg.provider;
    if (typeof cfg.apiKey === "string") state.apiKey = cfg.apiKey.trim();
    if (typeof cfg.model === "string") state.model = cfg.model.trim();
    if (typeof cfg.baseUrl === "string") state.baseUrl = cfg.baseUrl.trim();
    if (typeof cfg.remember === "boolean") state.remember = cfg.remember;

    if (state.remember && state.apiKey) persist();
    else dropPersisted();
  }
  function clearKey() { state.apiKey = ""; state.remember = false; dropPersisted(); }
  function hasKey() { return !!state.apiKey; }
  function getProvider() { return state.provider; }
  function isRemembered() { return state.remember; }
  function getBaseUrl() { return state.baseUrl; }
  // Shared read-only view of the current config, used by the audio module
  // (TTS + transcription) so it can reuse the same OpenAI key.
  function getConfig() {
    return { provider: state.provider, apiKey: state.apiKey, model: state.model, baseUrl: state.baseUrl };
  }

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

  // Turn an opaque fetch rejection into something actionable.
  function friendlyNetworkError(provider) {
    var msg = "Netzwerkfehler: Der Aufruf hat die API nicht erreicht.";
    if ((provider === "deepseek" || provider === "gemini") && !state.baseUrl) {
      var name = provider === "gemini" ? "Gemini" : "DeepSeek";
      msg += " " + name + " kann vom Browser durch CORS blockiert werden " +
             "(auch mit gültigem Schlüssel). Nutzen Sie OpenAI/Anthropic, oder tragen Sie eine Proxy-Basis-URL ein (siehe README).";
    } else {
      msg += " Prüfen Sie Internetverbindung, Basis-URL und CORS des Endpunkts.";
    }
    return new Error(msg);
  }

  // ---- Direct LLM calls ----------------------------------------------------
  function callOpenAICompatible(prompt, model, provider) {
    return fetch(baseFor(provider) + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + state.apiKey
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODELS[provider],
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 700
      })
    }).catch(function () {
      throw friendlyNetworkError(provider);
    }).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) throw new Error((data.error && data.error.message) || ("HTTP " + r.status));
        return data.choices[0].message.content.trim();
      });
    });
  }

  function callAnthropic(prompt, model) {
    var url = state.baseUrl
      ? state.baseUrl.replace(/\/+$/, "") + "/v1/messages"
      : "https://api.anthropic.com/v1/messages";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": state.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODELS.anthropic,
        max_tokens: 700,
        messages: [{ role: "user", content: prompt }]
      })
    }).catch(function () {
      throw friendlyNetworkError("anthropic");
    }).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) throw new Error((data.error && data.error.message) || ("HTTP " + r.status));
        return data.content[0].text.trim();
      });
    });
  }

  // Google Gemini uses its own request/response shape (not OpenAI-compatible on
  // the native endpoint). Key is sent as the x-goog-api-key header, never in the URL.
  function callGemini(prompt, model) {
    var base = state.baseUrl ? state.baseUrl.replace(/\/+$/, "") : GEMINI_BASE;
    var url = base + "/models/" + (model || DEFAULT_MODELS.gemini) + ":generateContent";
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": state.apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 700 }
      })
    }).catch(function () {
      throw friendlyNetworkError("gemini");
    }).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) throw new Error((data.error && data.error.message) || ("HTTP " + r.status));
        var c = data.candidates && data.candidates[0];
        if (!c || !c.content || !c.content.parts) throw new Error("Leere Antwort von Gemini.");
        return c.content.parts.map(function (p) { return p.text || ""; }).join("").trim();
      });
    });
  }

  // ---- Public entry --------------------------------------------------------
  function evaluate(payload, instructions) {
    var prompt = buildPrompt(payload, instructions);

    if (hasKey()) {
      var model = state.model || DEFAULT_MODELS[state.provider];
      var call;
      if (state.provider === "anthropic") call = callAnthropic(prompt, model);
      else if (state.provider === "gemini") call = callGemini(prompt, model);
      else call = callOpenAICompatible(prompt, model, state.provider);
      return call.then(function (feedback) { return { mode: "llm", text: feedback }; });
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
    isRemembered: isRemembered,
    getBaseUrl: getBaseUrl,
    getConfig: getConfig,
    loadPersisted: loadPersisted,
    buildPrompt: buildPrompt,
    evaluate: evaluate,
    DEFAULT_MODELS: DEFAULT_MODELS
  };
})();
