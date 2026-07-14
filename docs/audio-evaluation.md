# Audio evaluation for spoken answers — options, verification, recommendation

**Question:** should the simulator *score* spoken answers (not just transcribe them), and if so, how? The use case is narrow and specific: assessing **medical-German competency in a mock oral exam** (Kenntnisprüfung), where the examiners care about whether the candidate can present a case, reason clinically, and use correct *Fachsprache* — not whether their accent is native.

That framing matters, because most commercial "speech scoring" APIs are built for the *opposite* problem (language learners drilling pronunciation of scripted text). The verification below confirms current status, German support and pricing as of July 2026.

## The candidates, verified

### 1. Whisper (in-browser, transcription only)
Still current and the right transcription baseline. Hugging Face **Transformers.js v3** runs ONNX Whisper models fully client-side; with **WebGPU** a ~76 MB `whisper-large-v3-turbo` (or a smaller `base`/`small`) transcribes German at several times real-time without sending audio anywhere. It is free, private, and offline-capable, with a WASM fallback for browsers without WebGPU.

Trade-off: it *only* transcribes. It produces no pronunciation, fluency, grammar or relevance score. Model download (tens to hundreds of MB) is a one-time per-device cost; first load is slow. For a static tool this is the cleanest privacy story — audio never leaves the machine.

*Alternative if you don't want the download:* OpenAI's transcription API (`whisper-1` / `gpt-4o-transcribe`) is ~**$0.006/min**, `gpt-4o-mini-transcribe` ~**$0.003/min**. Cheap, but sends audio to a third party and needs a key.

### 2. Speechace — pronunciation & fluency API
Current and actively sold. Patented phoneme/syllable-level scoring; markets pronunciation, fluency, grammar, coherence, vocabulary and relevance, with score mappings to CEFR/IELTS/TOEFL/PTE/TOEIC. **German is supported.** Pricing is **not public** — free trial, then quote-based (volume/annual). Built primarily for language-learning and speaking-test products.

### 3. SpeechSuper — pronunciation scoring API
Current. Explicitly lists **German** among 8 languages, with a live German demo. Transparent **pay-as-you-go** pricing: **$0.004/word, $0.006/sentence, $0.008/paragraph**, **$20/month minimum**. The catch for us: its assessment is largely **scripted** (word/sentence/paragraph read against reference text) — great for "say this sentence correctly," weak for "evaluate this open-ended clinical answer."

### 4. Language Confidence — Unscripted Speech Assessment
Current and the most conceptually aligned candidate: it is explicitly designed for **open responses**, scoring pronunciation, fluency, grammar, vocabulary and **relevancy** *in the context of the answer*. But verification shows its pronunciation model compares against **US/UK native English** references, and the documented language support is **English-focused** — no advertised German pronunciation model. So the one product built for open-response scoring is the one that (today) doesn't do German. Worth a direct sales inquiry, but don't assume German is available.

## Comparison

| Option | Current? | German | Scores what | Price (Jul 2026) | Fit for medical oral exam |
|---|---|---|---|---|---|
| Whisper in-browser (Transformers.js) | Yes | Yes | Transcription only | Free / on-device | Baseline — transcribe, then evaluate with LLM |
| OpenAI transcription API | Yes | Yes | Transcription only | ~$0.003–0.006/min | Same role, no download, needs key |
| Speechace | Yes | Yes | Pronunciation, fluency, +holistic | Quote-based | Overkill; tuned for language learners |
| SpeechSuper | Yes | Yes | Pronunciation (mostly scripted) | $0.004–0.008/req, $20/mo min | Wrong shape — scripted, not open answers |
| Language Confidence (Unscripted) | Yes | **Not advertised** | Pronunciation, fluency, grammar, vocab, relevancy | Quote / RapidAPI | Right shape, wrong language today |

## Recommendation

**Transcription (Whisper in-browser) → LLM evaluation is sufficient, and is the right primary path for this tool.** Reasoning specific to the Kenntnisprüfung:

1. **What's actually being graded is content and clinical reasoning**, not accent. The real examiners pass candidates with strong foreign accents every day — the protocols make this explicit. A phoneme-level "nativeness" score optimizes for something the exam does not test, and could even mislead the learner.
2. **The LLM you're already wiring in (point 3) is the better judge here.** It reads the transcript *and the case context* and evaluates correctness, structure (ABCDE), missing red flags, and Fachsprache — exactly the examiner rubric in `evaluationInstructions`. A pronunciation API can't judge whether "Stanford A ist ein Notfall wegen Perikardtamponade" is medically right.
3. **The best-fit open-response product (Language Confidence) doesn't advertise German**, and the German-capable ones (SpeechSuper, Speechace) are pronunciation/scripted tools aimed at language learners.

**Where a dedicated API *does* add real value** — and is worth the small budget you approved — is as an **optional secondary "delivery/fluency" signal**: a rough fluency/pace/hesitation score to flag *"you can present cleanly under time pressure."* That's a genuine oral-exam skill the LLM can't measure from a transcript alone (Whisper strips the disfluencies). If you want that, **SpeechSuper is the pragmatic pick** — transparent per-request pricing, confirmed German, cheap enough that scoring an occasional spoken answer is fractions of a cent. Treat its *pronunciation* number as a soft hint, not a grade.

### Suggested build order
1. **Now:** keep transcription simple. The existing Web Speech dictation is fine for typed-equivalent input; the browser `webkitSpeechRecognition` is flaky in embedded contexts, so plan to swap in **Whisper via Transformers.js (WebGPU)** as the robust, private default. Feed the transcript into the existing LLM feedback flow — this reuses the key from point 3 and needs no new vendor.
2. **Optional, later:** add a "fluency check" toggle that posts the recorded utterance to **SpeechSuper** and shows pace/fluency as a supplementary indicator, clearly labelled as a delivery metric, not a clinical grade.
3. **Skip** phoneme/nativeness pronunciation grading as a primary score — it measures the wrong thing for this exam.

## Sources
- [Speechace API plans](https://www.speechace.com/api-plans/) · [Speechace docs](https://api-docs.speechace.com/)
- [SpeechSuper pricing](https://www.speechsuper.com/pricing.html) · [SpeechSuper German demo](https://www.speechsuper.com/demo/german/index.html)
- [Language Confidence — Speech Assessment API docs](https://docs.languageconfidence.ai/) · [Unscripted Speech Assessment (RapidAPI)](https://rapidapi.com/language-confidence-language-confidence-default/api/unscripted-speech-assessment)
- [openai/whisper-large-v3-turbo (Hugging Face)](https://huggingface.co/openai/whisper-large-v3-turbo) · [Browser speech recognition with Whisper, 2026](https://offlinetts.com/blog/browser-speech-recognition-whisper-comparison/)
- [OpenAI Whisper API pricing 2026](https://diyai.io/ai-tools/speech-to-text/openai-whisper-api-pricing-2026/) · [OpenAI transcription pricing (CostGoat, Jul 2026)](https://costgoat.com/pricing/openai-transcription)
