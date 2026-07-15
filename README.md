# KP Mannheim — Mündliche Prüfung Simulator

A small, dependency-free web app for practising the **oral part of the German
Kenntnisprüfung (KP)** at Universitätsklinikum Mannheim. It presents real,
recurring exam cases as a case → phase → question flow, reads questions aloud,
lets you type or dictate answers, and returns **examiner-style feedback**.

No build step. Plain HTML/CSS/vanilla JS. Open `index.html` and it runs.

## Features

- **5 canonical cases** covering the exam's five recurring Teil-1 scenarios
  (Divertikulitis, Pyelonephritis, Bandscheibenvorfall, Cholezystitis,
  Hyperthyreose), each with 4 phases — Anamnese, Radiologie, Chirurgie,
  Innere/Pharma/Notfall — and **60 questions total** with model answers.
- **Read-aloud** — neural **OpenAI TTS** (natural voice, clean stop) when an
  OpenAI key is present; automatically falls back to the browser's Web Speech
  voice otherwise. Pick a voice in the settings panel.
- **Recording** — records your **actual audio** locally via `MediaRecorder`
  (proper start/stop, replayable), then **transcribes** it into the answer box
  via OpenAI when a key is present. With no key, the recording is still kept for
  replay and you type your answer.
- **Feedback in three modes** (auto-selected): direct LLM call with your own key,
  the Cowork chat host (`sendPrompt`), or copy-to-clipboard for any assistant.
- **Progress tracking** per phase (localStorage, non-sensitive).

## Project structure

```
kp-simulator/
├── index.html            # markup + script includes
├── css/styles.css        # all styling (light/dark)
├── data/cases.js         # caseSeries + evaluationInstructions  ← edit to reuse
├── js/speech.js          # browser Web Speech fallback + hint stripping  (window.KPSpeech)
├── js/audio.js           # neural TTS, MediaRecorder, transcription  (window.KPAudio)
├── js/feedback.js        # LLM / host / clipboard feedback  (window.KPFeedback)
├── js/ui.js              # rendering + wiring  (window.KPApp)
└── docs/
    ├── audio-evaluation.md   # research + recommendation on spoken-answer scoring
    └── data-provenance.md    # how cases.js was derived from the source protocols
```

To reuse the tool for a **different exam**, replace `data/cases.js` — the schema
is documented at the top of that file. Nothing else needs to change.

## Running it

Because it uses relative script paths, serve it over HTTP rather than opening the
file directly (some browsers block `file://` module loads):

```bash
cd kp-simulator
python3 -m http.server 8000
# open http://localhost:8000
```

## AI feedback and the API key — read this

The feedback flow works in three ways, tried in order:

1. **Your own LLM key.** Open the "API-Schlüssel" panel, pick a provider, paste a
   key. The app calls the provider directly and shows examiner feedback.

   | Provider | Works in browser directly? | Notes |
   |---|---|---|
   | OpenAI | Yes | `gpt-4o-mini` default |
   | Anthropic | Yes (opt-in header) | `claude-3-5-haiku-latest` default |
   | Google Gemini | Sometimes (CORS-dependent) | free tier; `gemini-2.5-flash` default; key sent as header |
   | DeepSeek | No (needs proxy) | cheapest; OpenAI-compatible; `deepseek-v4-flash` default |

   **OpenAI and Anthropic** work from a static page today. **Gemini** and
   **DeepSeek** can be blocked by CORS in the browser — if the call fails, either
   use OpenAI/Anthropic, or set a **proxy URL** in the "Basis-URL" field (see the
   proxy note below). Gemini's free tier makes it the cheapest option once proxied.
2. **Cowork chat host.** If embedded in a host that provides `window.sendPrompt`,
   the answer is handed to that assistant.
3. **Copy & paste.** Otherwise the app shows the prompt to paste into any assistant.

By default the key lives **only in memory** and is cleared on refresh. Tick
**"Auf diesem Gerät merken"** to persist it to `localStorage` so it survives
refresh/restart — convenient on your own machine, but see the caveats below.

**DeepSeek won't work as a direct browser call.** DeepSeek's API does not send
CORS headers, so the browser blocks the request even with a valid key (you'll get
a network error, now shown with an explanation). Two options: use OpenAI/Anthropic
(both allow browser calls), or run DeepSeek behind a proxy and put the proxy's URL
in the **"Basis-URL"** field (e.g. `https://your-worker.example.com/v1`). A minimal
Cloudflare Worker that forwards to `https://api.deepseek.com/v1` and adds an
`Access-Control-Allow-Origin` header is enough.

### Security model (important before you deploy publicly)

- Memory-only by default; the "remember" option persists to `localStorage`.
- A **persisted** key is readable by any script on this origin and by anyone with
  access to the machine. Only tick "remember" on your own device — never on a
  shared or public deployment.
- It is entered per user, per session — **your** key for **your** session.
- Any client-side call still exposes the key in the browser Network tab and to
  anyone at the machine while it's entered. **Never hard-code a shared key into
  `feedback.js` and host it publicly** — it would be trivially extractable and
  could run up unbounded cost.

### Deploying as a shared tool

If you want to share this with fellow candidates without each person needing their
own key, do **not** ship a key client-side. Put a **minimal server-side proxy**
between the app and the LLM:

- A tiny serverless function (Cloudflare Worker / Vercel / Netlify function) holds
  *your* provider key as a server secret and exposes one `POST /evaluate` endpoint.
- Point `js/feedback.js` at that endpoint instead of the provider URL.
- Add rate limiting / an allowlist so usage (and cost) stays bounded.

This keeps the frontend a static file while removing the key from the browser.

## Spoken-answer scoring

See [`docs/audio-evaluation.md`](docs/audio-evaluation.md). Short version:
**transcription (Whisper in-browser) → LLM evaluation** is the right primary path
for this exam, because it grades clinical content and Fachsprache rather than
accent. A dedicated pronunciation/fluency API (SpeechSuper has confirmed German
and transparent pricing) is worth adding only as an optional secondary
*delivery/fluency* signal, not as a clinical grade.

## Data provenance & disclaimer

Cases are distilled from crowdsourced KP Mannheim exam protocols (2021–2025); see
[`docs/data-provenance.md`](docs/data-provenance.md). Content is for **exam
preparation only** and is **not medical advice or clinical guidance**. Verify all
clinical details against current guidelines (AMBOSS, Leitlinien) before relying on
them.

## License

MIT — see `LICENSE`.
