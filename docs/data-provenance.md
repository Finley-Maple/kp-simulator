# Data provenance — how `data/cases.js` was built

## Source

`KP Mannheim.pdf` — a 115-page, crowdsourced collection of first-person
Kenntnisprüfung exam reports (*Protokolle*) from Universitätsklinikum Mannheim,
shared via a Telegram group, spanning **2021–2025**. Free-form German narrative,
not structured Q&A.

## Extraction pipeline

1. **Text extraction** (`pdftotext`) → ~49,000 words.
2. **Segmentation** into individual reports by dated headers
   (`DD.MM.YYYY`, with `-1/-2` suffixes for multiple entries per day).
   Result: **92 dated reports**, median ~430 words each.
3. **Clustering** by primary Teil-1 diagnosis. The exam structure is highly
   consistent: Teil 1 is always one of five recurring anamnesis cases, then the
   oral stations (Radiologie, Chirurgie, Innere) draw from a shared topic pool.

   | Teil-1 case | Reports |
   |---|---|
   | Divertikulitis | 42 |
   | Pyelonephritis | 32 |
   | Bandscheibenvorfall | 27 |
   | Cholezystitis | 21 |
   | Hyperthyreose | 12 |

4. **Recurring oral-topic frequency** (reports mentioning), used to guarantee
   coverage across the canonical set:

   Spannungspneumothorax 38 · Epidural/Subduralhämatom 28 · Aortendissektion 26 ·
   Perforation/freie Luft 26 · Weber-Fraktur 22 · Lungenembolie 21 · Pneumonie 21 ·
   Leistenhernie 20 · STEMI 18 · Ileus 18 · Cholelithiasis/Cholangitis 11 · TVT 10 ·
   Kammerflimmern/CPR 9 · Vorhofflimmern 8 · Kolorektalkarzinom 7 · Diabetes/Koma 7 ·
   Mesenterialischämie 4 · Schlaganfall 4.

## Normalization decision

Rather than convert 92 overlapping reports 1:1 (heavy duplication, uneven
quality), the reports were **deduplicated into 5 canonical cases** — one per
recurring Teil-1 scenario. Each case has 4 phases (Anamnese, Radiologie,
Chirurgie, Innere/Pharma/Notfall). The pooled oral questions are **distributed
across the 5 cases so that cycling through all of them covers every recurring
topic** listed above at least once, plus the long tail (Mesenterialischämie,
Kolorektalkarzinom, Leberzirrhose, Thyreoidektomie-Komplikationen, Strahlenschutz,
Kontrastmittel, Aortenklappe, etc.).

This matches how the real exam works: you draw one Teil-1 case, but all three
examiners then quiz you across the whole shared pool regardless.

## Quality & accuracy

- Vignettes, patient names/ages and framing are taken directly from the
  protocols (e.g. "Herr Peter Keller, 61 J", "Iris Keller, 75 J").
- Each question carries a `modelAnswer` with the expected key points /
  examiner expectations, written to be clinically accurate for exam level.
- **Clinical details should still be verified** against current guidelines
  (AMBOSS, AWMF-Leitlinien) before use. This is a preparation aid, not a
  clinical reference.

## Complete question bank (cases 6–10)

To make the tool exhaustive, every distinct question/topic in the oral stations
was extracted from all 92 protocols (≈966 explicit "?" questions plus topic-style
prompts; ≈705 after cleaning dialogue/OCR noise) and consolidated into five
discipline **Fragenkataloge**:

| Case | Discipline | Questions |
|---|---|---|
| 6 | Radiologie (Thorax, Abdomen, Skelett, Schädel-CT, KM, Strahlenschutz) | 29 |
| 7 | Chirurgie (Kolon, Gallenwege, Ileus, Hernien, Schilddrüse, Anatomie) | 28 |
| 8 | Innere/Kardiologie (ACS, Rhythmus, HI, Hypertonie, LAE/TVT, Pneumonie, Endokrin) | 26 |
| 9 | Labormedizin (Anämie, Blutbild, Gerinnung, Elektrolyte, Leber/Pankreas) | 19 |
| 10 | Notfall & Pharmakotherapie (Analgesie, Antibiotika, Notfälle, Aufklärung) | 14 |

Combined with the 60 questions in cases 1–5, the tool holds **176 questions with
model answers**. Near-identical repeats across reports were merged into one
canonical question; every *distinct* clinical question — including one-offs
(Holiday-Heart, Homans/Payr/Meyer, De-Ritis, KDIGO, Intrinsic Factor, Volvulus,
Pneumozephalus, Argatroban/4T-Score, Reynolds-Pentade, TEVAR, …) — is represented.
Automated coverage checks confirm all recurring and long-tail topics appear.

## Reproducing / extending

The raw per-report text files and frequency analysis were produced by the
extraction scripts during the build. To add cases, append to the `caseSeries`
array in `data/cases.js` following the documented schema; no other file changes
are required.
