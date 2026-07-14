// =============================================================================
// KP Mannheim — Fallsammlung (caseSeries)
// =============================================================================
// Quelle: "KP Mannheim.pdf" — crowdsourced Prüfungsprotokolle der
// Kenntnisprüfung Mannheim (Universitätsklinikum Mannheim), 2021–2025.
// 92 datierte Erfahrungsberichte, dedupliziert und normalisiert.
//
// STRUKTUR DER PRÜFUNG (aus den Protokollen rekonstruiert):
//   Teil 1  Anamnese + körperliche Untersuchung mit Schauspieler-Patient
//           -> immer einer von 5 wiederkehrenden Fällen:
//              Divertikulitis (42x), Pyelonephritis (32x),
//              Bandscheibenvorfall (27x), Cholezystitis (21x),
//              Hyperthyreose (12x)
//   Teil 2  Arztbrief schreiben (60–75 min, in der Bibliothek/Hörsaal)
//   Teil 3  Patientenvorstellung ohne Unterbrechung
//   Teil 4  Mündliche Prüfung: 3 Prüfer (Radiologie, Chirurgie, Innere/Labor)
//           stellen fächerübergreifende Fragen aus einem GEMEINSAMEN Themenpool,
//           unabhängig vom Teil-1-Fall.
//
// DESIGN-ENTSCHEIDUNG: 5 kanonische Fälle (je einer pro Teil-1-Szenario).
// Jeder Fall hat 4 Phasen (Anamnese, Radiologie, Chirurgie, Innere/Pharma/Notfall).
// Die mündlichen Fragen aus dem gemeinsamen Pool sind so auf die 5 Fälle verteilt,
// dass ein Durchlauf durch ALLE Fälle jedes wiederkehrende Thema abdeckt:
//   Aortendissektion, Spannungspneumothorax, STEMI, Kammerflimmern/CPR,
//   Lungenembolie, Ileus, Perforation/freie Luft, Weber-Fraktur, Pneumonie,
//   Epidural-/Subduralhämatom, Leistenhernie, TVT, Vorhofflimmern,
//   Mesenterialischämie, Kolorektalkarzinom, Cholelithiasis/Cholangitis,
//   Schlaganfall, Strahlenschutz, Thyreoidektomie u.a.
//
// [eckige Klammern] markieren Bild-/Blickdiagnose-Hinweise. Die Read-aloud-
// Funktion entfernt sie automatisch.
//
// Jeder Frage kann optional ein `modelAnswer` (Musterantwort / Prüfer-Erwartung)
// beigefügt werden — als Lernhilfe und als Referenz für die LLM-Bewertung.
// =============================================================================

var caseSeries = [
  // ---------------------------------------------------------------------------
  // FALL 1 — AKUTE SIGMADIVERTIKULITIS (häufigster Fall, 42 Protokolle)
  // ---------------------------------------------------------------------------
  {
    id: 1,
    caseTitle: "Fall 1: Akute Sigmadivertikulitis (Herr Peter Keller, 61 J)",
    initialVignette: "Herr Peter Keller, 61 Jahre, stellt sich mit seit gestern bestehenden, dumpfen, linksseitigen Unterbauchschmerzen ohne Ausstrahlung vor. Zusätzlich subfebrile Temperatur (37,9 °C). Vorerkrankung: arterielle Hypertonie seit 5 Jahren (Beloc Zok). Z. n. Appendektomie. Vegetative Anamnese bis auf Fieber unauffällig.",
    phases: [
      { phaseName: "Teil 1: Anamnese und körperliche Untersuchung", questions: [
        { id: "q1", text: "Stellen Sie den Patienten vor. Was ist Ihre Verdachtsdiagnose und welche Differenzialdiagnosen ziehen Sie bei linksseitigem Unterbauchschmerz in Betracht?",
          modelAnswer: "V. a. akute Sigmadivertikulitis. DD: Kolonkarzinom, Reizdarm, Obstipation, ischämische Kolitis, Nephrolithiasis/Harnwegsinfekt links, Aortenaneurysma, bei Frauen zusätzlich gynäkologisch (Adnexitis, Ovarialtorsion, EUG). Bei Divertikulitis auch M. Crohn und Colitis ulcerosa als chronisch-entzündliche DD." },
        { id: "q2", text: "Zeigen Sie an der Untersuchungspuppe, wie Sie das Abdomen strukturiert untersuchen. Worauf achten Sie besonders? Vergessen Sie die kardiopulmonale Untersuchung nicht.",
          modelAnswer: "Inspektion, Auskultation (Darmgeräusche), Perkussion, Palpation zuletzt. Druckschmerz und lokale Abwehrspannung im linken Unterbauch, Loslassschmerz, walzenförmige Resistenz möglich. Immer auch Herz und Lunge auskultieren, Vitalparameter (RR, HF, AF, SpO2, Temp) und Pulsstatus. Narben inspizieren (Appendektomie)." },
        { id: "q3", text: "Der Patient hat eine Appendektomie-Narbe. Welche Art von Narbe, und welche Komplikationen sind langfristig relevant?",
          modelAnswer: "Wechselschnitt (offene Appendektomie) im rechten Unterbauch. Langzeitkomplikationen: Narbenhernie und mechanischer Ileus durch Briden/Verwachsungen." }
      ]},
      { phaseName: "Teil 2: Radiologie und Bildgebung", questions: [
        { id: "q4", text: "[Röntgen Abdomen, Linksseitenlage] Beschreiben Sie den Befund. Was sehen Sie und was bedeutet das?",
          modelAnswer: "Freie Luft (subdiaphragmal bzw. an der lateralen Bauchwand in Linksseitenlage) als Zeichen einer Hohlorganperforation. Notfall — Notfall-OP erforderlich." },
        { id: "q5", text: "[Röntgen Abdomen mit Spiegelbildung] Wie unterscheiden Sie einen mechanischen von einem paralytischen Ileus — radiologisch und klinisch? Wie behandeln Sie den paralytischen Ileus?",
          modelAnswer: "Mechanisch: Hyperperistaltik, hochgestellte/klingende Darmgeräusche, Spiegel proximal der Stenose, kolikartiger Schmerz. Paralytisch: 'Totenstille', diffus geblähte Schlingen. Therapie paralytisch: Ursache behandeln, Prokinetika (z. B. Metoclopramid, Neostigmin), Magensonde, Elektrolytausgleich." },
        { id: "q6", text: "Welche bildgebende Untersuchung sichert die Divertikulitis, und welche Klassifikation kennen Sie?",
          modelAnswer: "CT Abdomen mit Kontrastmittel ist Goldstandard (Sonographie als erste Bildgebung). Klassifikation: Hansen-Stock oder CDD (Classification of Diverticular Disease); klassisch auch Hinchey für die perforierte/abszedierende Form." }
      ]},
      { phaseName: "Teil 3: Chirurgie", questions: [
        { id: "q7", text: "Wie therapieren Sie eine unkomplizierte versus eine komplizierte Divertikulitis? Wann operieren Sie?",
          modelAnswer: "Unkompliziert: konservativ — Nahrungskarenz/leichte Kost, ggf. Antibiotika (bei Risikofaktoren), Analgesie. Kompliziert (Abszess, Perforation, Stenose, rezidivierend): Antibiotika, ggf. Abszessdrainage, OP. Notfall-OP bei freier Perforation mit Peritonitis." },
        { id: "q8", text: "Erklären Sie die Hartmann-Operation. Wann führen Sie eine primäre Anastomose durch, wann eine sekundäre? Unterschied endständiges vs. doppelläufiges Stoma?",
          modelAnswer: "Hartmann: Sigmaresektion mit endständigem Kolostoma und Blindverschluss des Rektumstumpfs, Rückverlagerung später — bei Peritonitis/instabilem Patienten. Primäre Anastomose bei stabilen, sauberen Verhältnissen; sekundär (mit protektivem Stoma) bei Kontamination/Risiko. Endständig: ein Lumen, Darm durchtrennt. Doppelläufig: protektiv, zu- und abführende Schlinge, leichter rückverlagerbar." },
        { id: "q9", text: "Nennen Sie weitere Differenzialdiagnosen der Divertikulitis. Wie unterscheiden sich Morbus Crohn, Colitis ulcerosa und Kolorektalkarzinom klinisch?",
          modelAnswer: "M. Crohn: diskontinuierlich, transmural, ganzer GI-Trakt, schleimige Diarrhö, Fisteln/Stenosen. CU: kontinuierlich ab Rektum, blutig-schleimige Diarrhö, nur Mukosa. KRK: Wechsel der Stuhlgewohnheiten, Blut im Stuhl, Ileus durch Stenose, B-Symptomatik; Calprotectin, Koloskopie mit Biopsie." }
      ]},
      { phaseName: "Teil 4: Innere Medizin / Pharmakotherapie", questions: [
        { id: "q10", text: "Welche Antibiotikatherapie wählen Sie bei komplizierter Divertikulitis? Warum Metamizol und nicht Butylscopolamin zur Analgesie?",
          modelAnswer: "Antibiotika gegen gramnegative Keime und Anaerobier, z. B. Ciprofloxacin + Metronidazol oder Amoxicillin/Clavulansäure bzw. Piperacillin/Tazobactam. Metamizol wirkt analgetisch und leicht spasmolytisch; Butylscopolamin (Buscopan) wirkt an glatter Muskulatur, ist aber bei Analgesie unterlegen und anticholinerg kontraindiziert (z. B. Ileus, Glaukom, Tachyarrhythmie)." },
        { id: "q11", text: "Nennen Sie die postoperative Schmerztherapie nach dem WHO-Stufenschema. Wie dosieren Sie Metamizol?",
          modelAnswer: "Stufe 1 Nichtopioide (Metamizol, Paracetamol, NSAR), Stufe 2 schwache Opioide (Tramadol, Tilidin), Stufe 3 starke Opioide (Morphin, Oxycodon), jeweils + Koanalgetika/Adjuvanzien. Metamizol 500–1000 mg bis 4×/Tag p.o. oder i.v. (langsam als Kurzinfusion; Cave Agranulozytose, Blutdruckabfall bei zu schneller Gabe)." },
        { id: "q12", text: "[EKG-Blickdiagnose] Ein Patient mit Bauchschmerzen und bekanntem Vorhofflimmern. Woran müssen Sie zusätzlich denken? Wie sichern Sie die Diagnose?",
          modelAnswer: "Mesenterialischämie (arterielle Embolie bei VHF) — 'Vernichtungsschmerz' mit späterem schmerzarmem Intervall, Laktatanstieg. Sicherung: CT-Angiographie Abdomen. Therapie: Notfall — Revaskularisation/Embolektomie, ggf. Darmresektion, Antikoagulation." }
      ]}
    ]
  },

  // ---------------------------------------------------------------------------
  // FALL 2 — AKUTE PYELONEPHRITIS (32 Protokolle)
  // ---------------------------------------------------------------------------
  {
    id: 2,
    caseTitle: "Fall 2: Akute Pyelonephritis (Frau Bettina Berger, 61 J)",
    initialVignette: "Frau Bettina Berger, 61 Jahre, stellt sich mit seit gestern plötzlich aufgetretenen, dauerhaften rechtsseitigen Flankenschmerzen vor, die nicht ausstrahlen. Begleitend Fieber (38,6 °C), Schüttelfrost, Dysurie, Pollakisurie und Nykturie. Vorerkrankung: arterielle Hypertonie (Beloc Zok). Z. n. Appendektomie.",
    phases: [
      { phaseName: "Teil 1: Anamnese und körperliche Untersuchung", questions: [
        { id: "q1", text: "Stellen Sie die Patientin vor. Verdachtsdiagnose und wichtigste Differenzialdiagnosen bei Flanken-/Rückenschmerz?",
          modelAnswer: "V. a. akute (rechtsseitige) Pyelonephritis. DD: Nephrolithiasis/Urolithiasis, unkomplizierte Zystitis, Bandscheibenvorfall, Wirbelkörperfraktur/Osteoporose, Cholezystitis (rechts), Pneumonie basal, gynäkologische Ursachen, Appendizitis." },
        { id: "q2", text: "Zeigen Sie die Untersuchung des Nierenlagers. Welche weitere körperliche Untersuchung führen Sie durch?",
          modelAnswer: "Nierenlagerklopfschmerz (Punch-/Klopfschmerz beidseits im Seitenvergleich). Zusätzlich Abdomen, Herz, Lunge, Vitalparameter, Wirbelsäule (zur DD Rückenschmerz)." },
        { id: "q3", text: "Welche initialen Untersuchungen ordnen Sie an? Welche Parameter prüfen Sie im Urin-Stix?",
          modelAnswer: "Labor (Blutbild, CRP, Kreatinin/eGFR, Elektrolyte) und Urinuntersuchung. Urin-Stix: Leukozyten, Nitrit, Erythrozyten/Hämaturie, Protein, ggf. Glukose. Zusätzlich Urinkultur mit Antibiogramm vor Antibiotikagabe, Sonographie der Nieren." }
      ]},
      { phaseName: "Teil 2: Radiologie und Bildgebung", questions: [
        { id: "q4", text: "Wie stellt sich eine Hydronephrose in der Sonographie dar? Bei V. a. Nephrolithiasis — CT mit oder ohne Kontrastmittel?",
          modelAnswer: "Hydronephrose: erweitertes, echoarmes Nierenbeckenkelchsystem, ggf. Parenchymverschmälerung. Steindiagnostik: Low-Dose-CT Abdomen OHNE Kontrastmittel (Steine sonst durch KM überlagert)." },
        { id: "q5", text: "[Röntgen oberes Sprunggelenk] Sie sehen eine Fraktur. Erklären Sie die Weber-Klassifikation und die jeweilige Therapie.",
          modelAnswer: "Weber A: Fibulafraktur unterhalb der Syndesmose, Syndesmose intakt → meist konservativ. Weber B: auf Höhe der Syndesmose → je nach Stabilität konservativ oder operativ. Weber C: oberhalb, Syndesmose zerrissen → operativ (Stellschraube/Syndesmosennaht). Immer zweite Ebene fordern." },
        { id: "q6", text: "[Röntgen Thorax] Der Patient hat Fieber und Husten. Was sehen Sie, und wie klassifizieren Sie eine Pneumonie?",
          modelAnswer: "Lobärpneumonie: flächige Verschattung mit positivem Bronchopneumogramm. Klassifikation nach Entstehungsort: ambulant (CAP) vs. nosokomial (HAP) vs. bei Immunsuppression. Schweregrad CRB-65. Zweite (seitliche) Ebene bei Fieber/DD." }
      ]},
      { phaseName: "Teil 3: Chirurgie", questions: [
        { id: "q7", text: "Diagnostik und Therapie der Urolithiasis? Ab wann ist eine Harnleiterschiene/Intervention nötig?",
          modelAnswer: "Diagnostik: Sono, Low-Dose-CT, Urin/Labor. Konservativ bei kleinen Steinen (< 5–6 mm): Analgesie (Metamizol/Diclofenac), Flüssigkeit, Tamsulosin (MET). Intervention (DJ-Schiene, URS, ESWL) bei Harnstau mit Infekt (Urosepsis-Gefahr!), Nierenversagen, Einzelniere, großen Steinen. Infizierter Harnstau = urologischer Notfall → Entlastung." },
        { id: "q8", text: "[Bild Leistenhernie] Unterschied direkte vs. indirekte Leistenhernie. Worauf achten Sie in der Untersuchung?",
          modelAnswer: "Indirekt: durch inneren Leistenring lateral der epigastrischen Gefäße, oft angeboren, kann bis ins Skrotum. Direkt: medial der epigastrischen Gefäße durch Hesselbach-Dreieck, erworben. Untersuchung im Stehen/Liegen, Husten, Reponierbarkeit; Cave Inkarzeration (schmerzhaft, irreponibel → Notfall-OP)." },
        { id: "q9", text: "Bei Z. n. Appendektomie: Welche chirurgische Spätkomplikation kann Bauchschmerzen verursachen? Ätiologie des mechanischen und paralytischen Ileus?",
          modelAnswer: "Bridenileus (Verwachsungen) — häufigste Ursache des mechanischen Dünndarmileus nach Voroperation. Mechanisch: Briden, Hernien, Tumor, Gallenstein, Invagination. Paralytisch: postoperativ, Peritonitis, Ischämie, Elektrolytstörung, Medikamente (Opioide)." }
      ]},
      { phaseName: "Teil 4: Innere Medizin / Pharmakotherapie", questions: [
        { id: "q10", text: "Wie behandeln Sie eine komplizierte Pyelonephritis? Welche Antibiotika, und wann stationär?",
          modelAnswer: "Stationär bei Sepsis-Zeichen, Erbrechen/oraler Unverträglichkeit, Schwangerschaft, Obstruktion, Immunsuppression. Kalkulierte i.v.-Antibiose: Cephalosporin 3. Generation (Ceftriaxon) oder Fluorchinolon (Ciprofloxacin), Anpassung nach Antibiogramm. Häufigster Erreger E. coli (gramnegativ). Analgesie, Flüssigkeit, ggf. Harnableitung bei Stau." },
        { id: "q11", text: "Wie diagnostizieren Sie eine Lungenembolie? Welche Rolle spielen D-Dimere und CT-Angiographie?",
          modelAnswer: "Klinische Wahrscheinlichkeit (Wells-Score). Bei niedriger Wahrscheinlichkeit D-Dimere (hoher negativer Vorhersagewert). Bei hoher Wahrscheinlichkeit/positiven D-Dimeren CT-Pulmonalisangiographie. EKG (S1Q3T3), Echo (Rechtsherzbelastung), BGA. Therapie: Antikoagulation, bei Instabilität Lyse." },
        { id: "q12", text: "Welche Laborkonstellation erwarten Sie bei renaler Anämie, und wie behandeln Sie sie?",
          modelAnswer: "Normozytäre, normochrome Anämie bei chronischer Niereninsuffizienz durch Erythropoetin-Mangel; niedriges Retikulozyten-, EPO-Wert. Therapie: EPO-Substitution nach Ausschluss/Ausgleich von Eisenmangel (Ferritin, Transferrinsättigung)." }
      ]}
    ]
  },

  // ---------------------------------------------------------------------------
  // FALL 3 — LUMBALER BANDSCHEIBENVORFALL L5/S1 (27 Protokolle)
  // ---------------------------------------------------------------------------
  {
    id: 3,
    caseTitle: "Fall 3: Bandscheibenvorfall L5/S1 (Herr Gerhard Heckel, 58 J)",
    initialVignette: "Herr Gerhard Heckel, 58 Jahre, stellt sich mit seit gestern bestehenden starken Rückenschmerzen vor, die über die Außenseite des linken Oberschenkels und die Innenseite des Unterschenkels bis zum medialen Fußrand ausstrahlen. Auslöser: lange sitzende Autofahrt. Begleitend Taubheitsgefühl und Kribbeln, Schmerzstärke 8/10.",
    phases: [
      { phaseName: "Teil 1: Anamnese und körperliche Untersuchung", questions: [
        { id: "q1", text: "Stellen Sie den Patienten vor. Verdachtsdiagnose und welche Red Flags müssen Sie aktiv ausschließen?",
          modelAnswer: "V. a. lumbaler Bandscheibenvorfall (radikuläres Syndrom). Red Flags: Kauda-/Konus-Syndrom (Reithosenanästhesie, Blasen-/Mastdarmstörung, Harnverhalt), Traumaanamnese (Fraktur), Fieber (Spondylodiszitis), B-Symptomatik (Tumor/Metastase), progrediente/schwere Paresen." },
        { id: "q2", text: "Zeigen Sie die neurologische Untersuchung der unteren Extremität. Welche Dermatome und Kennmuskeln prüfen Sie, und welche Tests führen Sie durch?",
          modelAnswer: "Kraftgrade (0–5), Reflexe (PSR L4, ASR S1), Sensibilität nach Dermatomen. L5: Fußheber/Großzehenheber, Dermatom lateraler Unterschenkel bis Großzehe/medialer Fußrand. S1: Fußsenker, Zehenstand, Ferse, ASR. Tests: Lasègue, Bragard, Kernig. Bei Fußheberschwäche an L5 denken." },
        { id: "q3", text: "Warum ist ein Kauda-Syndrom ein Notfall? Welche Fragen stellen Sie zur Abgrenzung?",
          modelAnswer: "Kompression der Cauda equina → drohend irreversible Blasen-/Mastdarmlähmung und Reithosenanästhesie. Notfall-Dekompression innerhalb 24–48 h. Fragen: Harnverhalt/Inkontinenz, Stuhlinkontinenz, Taubheit im Reithosenbereich (N. pudendus)." }
      ]},
      { phaseName: "Teil 2: Radiologie und Bildgebung", questions: [
        { id: "q4", text: "Welche Bildgebung sichert den Bandscheibenvorfall, und welche Sequenz ist entscheidend?",
          modelAnswer: "MRT der LWS ist Methode der Wahl (kein Strahlen, beste Weichteil-/Nervendarstellung). T2-Wichtung zeigt Bandscheibe/Liquor/Nervenkompression am besten. Röntgen/CT nur ergänzend (Fraktur, Knochen)." },
        { id: "q5", text: "[Schädel-CT, zwei Bilder: epidurales vs. subdurales Hämatom] Unterscheiden Sie die beiden. Was blutet jeweils, und wie ist die Therapie?",
          modelAnswer: "Epidural: bikonvex/linsenförmig, arteriell (A. meningea media), oft nach Trauma mit symptomfreiem Intervall, respektiert Suturen. Subdural: konkav/sichelförmig, venös (Brückenvenen), oft ältere/antikoagulierte Patienten. Therapie: neurochirurgische Entlastung (Trepanation/Kraniotomie) je nach Größe/Klinik." },
        { id: "q6", text: "[Schädel-CT] Ischämischer Schlaganfall. Wie ist das Vorgehen und die Akuttherapie im Zeitfenster?",
          modelAnswer: "Nativ-CT zum Blutungsausschluss, dann CT-Angio/Perfusion. Lyse (rtPA) innerhalb 4,5 h bei fehlenden Kontraindikationen; mechanische Thrombektomie bei großem Gefäßverschluss bis 6 h (in ausgewählten Fällen länger). Stroke Unit, 'Time is brain'." }
      ]},
      { phaseName: "Teil 3: Chirurgie", questions: [
        { id: "q7", text: "Wann behandeln Sie einen Bandscheibenvorfall konservativ, wann operativ? Wie sieht die konservative Akuttherapie aus?",
          modelAnswer: "Konservativ (Regelfall): Analgesie nach WHO, Lagerung (Stufenbett), frühe Mobilisation nach Schmerzlinderung, Physiotherapie. Cave: NSAR mit PPI. OP-Indikationen: Kauda-Syndrom (Notfall), progrediente/schwere motorische Ausfälle, therapierefraktärer Schmerz." },
        { id: "q8", text: "Als Differenzialdiagnose bei älteren Patienten: Wo treten osteoporotische Frakturen auf, und welche Bedeutung hat die Schenkelhalsfraktur?",
          modelAnswer: "Typisch: Wirbelkörper (Sinterungsfrakturen), distaler Radius (Colles), proximaler Femur (Schenkelhals). Schenkelhalsfraktur: Klassifikation nach Pauwels/Garden; Therapie je nach Alter/Dislokation — Hüft-TEP/Duokopf oder Osteosynthese; Cave Femurkopfnekrose." },
        { id: "q9", text: "[Röntgen Becken] Proximale Femurfraktur. Wann operieren Sie, und welche Komplikationen fürchten Sie?",
          modelAnswer: "Frühzeitige OP (möglichst < 24 h) zur Mobilisation und Vermeidung von Komplikationen. Komplikationen: TVT/Lungenembolie, Pneumonie, Dekubitus, Delir, Femurkopfnekrose, Pseudarthrose. Thromboseprophylaxe, frühe Mobilisation." }
      ]},
      { phaseName: "Teil 4: Innere Medizin / Notfallmedizin", questions: [
        { id: "q10", text: "[Notfallszenario] Sie finden einen bewusstlosen Patienten auf der Straße. Wie gehen Sie vor?",
          modelAnswer: "Eigenschutz, Ansprechen, Rütteln. Atemwege prüfen (Kopf überstrecken), Atmung prüfen (sehen/hören/fühlen, max. 10 s). Bei normaler Atmung: stabile Seitenlage, Notruf 112. Bei fehlender/Schnappatmung: Notruf, Reanimation 30:2, AED anfordern und einsetzen." },
        { id: "q11", text: "[EKG-Blickdiagnose] Kammerflimmern. Wie behandeln Sie, und welche Ursachen kennen Sie?",
          modelAnswer: "Defibrillation (unsynchronisiert) + Fortführung CPR 30:2, Adrenalin alle 3–5 min, Amiodaron nach 3. Schock. Ursachen kardial (Ischämie/Infarkt, Kardiomyopathie, Long-QT) und extrakardial (Hypoxie, Elektrolyt — Hypo-/Hyperkaliämie, Hypothermie, Intoxikation). Reversible Ursachen: 4 H und HITS." },
        { id: "q12", text: "[EKG] STEMI der Vorderwand. Nennen Sie die Akuttherapie und das Reperfusions-Zeitfenster. Woran denken Sie bei einseitiger Beinschwellung?",
          modelAnswer: "STEMI: MONA-BASH-Prinzip (Morphin, O2 bei Hypoxie, Nitrat, ASS + zweiter Plättchenhemmer, Heparin, Betablocker, Statin). Primär-PCI Ziel < 120 min; Lyse nur wenn PCI nicht rechtzeitig verfügbar. Vorderwand → LAD. Beinschwellung: TVT — Wells-Score, D-Dimer, Kompressionssono; Cave Lungenembolie." }
      ]}
    ]
  },

  // ---------------------------------------------------------------------------
  // FALL 4 — AKUTE CHOLEZYSTITIS (21 Protokolle)
  // ---------------------------------------------------------------------------
  {
    id: 4,
    caseTitle: "Fall 4: Akute Cholezystitis (Frau Iris Keller, 55 J)",
    initialVignette: "Frau Iris Keller, 55 Jahre, stellt sich mit seit heute Nacht bestehenden, plötzlich aufgetretenen Schmerzen im rechten Oberbauch mit Ausstrahlung in die rechte Schulter vor. Begleitend Übelkeit nach fettreichem Essen, subfebrile Temperatur. Blutdruck 140/90 mmHg.",
    phases: [
      { phaseName: "Teil 1: Anamnese und körperliche Untersuchung", questions: [
        { id: "q1", text: "Stellen Sie die Patientin vor. Verdachtsdiagnose und Risikofaktoren? Welche Differenzialdiagnosen bei rechtsseitigem Oberbauchschmerz?",
          modelAnswer: "V. a. akute Cholezystitis bei Cholezystolithiasis. Risiko '6 F': female, fat, forty, fertile, fair, family. DD: Cholangitis, Choledocholithiasis, Pankreatitis, Ulcus, Hepatitis, basale Pneumonie/Pleuritis rechts, Nephrolithiasis rechts, Myokardinfarkt (Hinterwand)." },
        { id: "q2", text: "Zeigen Sie, wie Sie das Murphy-Zeichen prüfen. Was bedeutet ein positives Zeichen?",
          modelAnswer: "Palpation unter dem rechten Rippenbogen während tiefer Inspiration; schmerzbedingter Abbruch der Einatmung = positives Murphy-Zeichen, spricht für Cholezystitis. Zusätzlich Ikterus prüfen (Skleren), Courvoisier-Zeichen (schmerzlos vergrößerte Gallenblase → eher maligne Obstruktion)." },
        { id: "q3", text: "Der Blutdruck ist 140/90 mmHg. Ist der Blutdruck gut eingestellt? Wie klassifizieren Sie und welches Blutdruckziel gilt?",
          modelAnswer: "140/90 ist Grenzwert-/Grad-1-Hypertonie (nach ESC ab 140/90). Nicht optimal eingestellt. Ziel allgemein < 140/90, bei guter Verträglichkeit ~130/80; individualisiert (Alter, Komorbidität). Bestätigung durch wiederholte Messung/24-h-Messung." }
      ]},
      { phaseName: "Teil 2: Radiologie und Bildgebung", questions: [
        { id: "q4", text: "Welche Bildgebung ist erste Wahl bei Cholezystitis, und welche sonografischen Zeichen erwarten Sie?",
          modelAnswer: "Abdomensonographie ist erste Wahl. Zeichen: Gallenblasenwandverdickung (> 3–4 mm), Dreischichtung, Steine mit dorsalem Schallschatten, perivesikale Flüssigkeit, sonografisches Murphy-Zeichen. Bei Verdacht auf Gangbeteiligung: erweiterter DHC, MRCP/ERCP." },
        { id: "q5", text: "[Röntgen Thorax mit Mediastinalverbreiterung] Der Patient hat Brustschmerzen. Was ist Ihr Verdacht und wie klären Sie weiter ab?",
          modelAnswer: "Verbreitertes Mediastinum bei Thoraxschmerz → V. a. Aortendissektion (DD Aortenaneurysma). Weitere Abklärung: CT-Angiographie (Goldstandard), TEE als Alternative. Blutdruck an beiden Armen messen (Differenz)." },
        { id: "q6", text: "[CT-Angiographie] Aortendissektion. Wie unterscheiden Sie Stanford A und B? Warum ist Typ A ein Notfall?",
          modelAnswer: "Stanford A: Beteiligung der Aorta ascendens → chirurgischer Notfall (Gefahr Perikardtamponade, Aortenklappeninsuffizienz, Koronar-/Karotisbeteiligung). Stanford B: nur ab Aorta descendens → meist konservativ (Blutdrucksenkung), OP/Stent bei Komplikationen. DeBakey I–III als Alternative." }
      ]},
      { phaseName: "Teil 3: Chirurgie", questions: [
        { id: "q7", text: "Erklären Sie Anatomie und Verlauf der Gallenwege. Wie kann eine Cholezystolithiasis zu einer Pankreatitis führen?",
          modelAnswer: "Ductus hepaticus dexter+sinister → D. hepaticus communis, mit D. cysticus → D. choledochus, mündet mit D. pancreaticus in die Papilla Vateri (Ampulle). Ein eingeklemmter Stein in der Papille staut auch den Pankreasgang → biliäre Pankreatitis." },
        { id: "q8", text: "Erklären Sie Cholezystolithiasis, Choledocholithiasis, Cholangitis. Nennen Sie die Charcot-Trias.",
          modelAnswer: "Cholezystolithiasis: Steine in der Gallenblase. Choledocholithiasis: Stein im D. choledochus → Verschlussikterus. Cholangitis: bakterielle Gallengangsentzündung. Charcot-Trias: rechtsseitiger Oberbauchschmerz + Ikterus + Fieber (mit Schüttelfrost); Reynolds-Pentade zusätzlich Hypotonie + Bewusstseinsstörung." },
        { id: "q9", text: "[Junge Frau, 20 J, mit akuten Unterbauchschmerzen] Wie gehen Sie vor, welche DD, und würden Sie ein CT durchführen?",
          modelAnswer: "Immer Schwangerschaft ausschließen: letzte Periode, Beta-HCG im Urin/Serum. DD: Appendizitis, Extrauteringravidität (EUG), Adnexitis, Ovarialtorsion/-zyste, Harnwegsinfekt. Sono, ggf. Transvaginalsono. CT bei Schwangeren vermeiden (Strahlung) — nur bei vitaler Indikation; sonst MRT/Sono." }
      ]},
      { phaseName: "Teil 4: Innere Medizin / Pharmakotherapie", questions: [
        { id: "q10", text: "Wie wirken jodhaltige Kontrastmittel? Nennen Sie Komplikationen und Kontraindikationen.",
          modelAnswer: "Röntgen-KM sind jodhaltig, erhöhen die Röntgendichte (Gefäße/Organe). Komplikationen: allergoide Reaktion, kontrastmittelinduzierte Nephropathie, thyreotoxische Krise bei latenter Hyperthyreose, Laktatazidose bei Metformin. KI/Vorsicht: Niereninsuffizienz, Hyperthyreose, KM-Allergie, Metformin, Schwangerschaft." },
        { id: "q11", text: "[Patient mit Ikterus, großem Bauch, Gewichtszunahme] Alles zur Leberzirrhose: Ursachen, Untersuchung, warum Aszitespunktion, AST/ALT-Quotient?",
          modelAnswer: "Ursachen: Alkohol, virale Hepatitis (B/C), NASH, Autoimmun, Hämochromatose, M. Wilson. Klinik/Leberhautzeichen: Spider naevi, Palmarerythem, Caput medusae, Aszites, Ikterus. Aszitespunktion: Ausschluss spontan bakterielle Peritonitis (SBP), Transsudat vs. Exsudat (SAAG). De-Ritis-Quotient (AST/ALT) > 1 spricht für schweren/alkoholischen Leberschaden." },
        { id: "q12", text: "Wo auskultieren Sie die Aortenklappe? Was hören Sie bei einer Aortenklappeninsuffizienz, und wie beurteilen Sie die Klappenfunktion?",
          modelAnswer: "Aortenklappe: 2. ICR rechts parasternal; Fortleitung in die Karotiden. Aortenklappeninsuffizienz: frühdiastolisches Decrescendo-Geräusch (am besten sitzend, vorgebeugt, Exspiration), große Blutdruckamplitude, ggf. periphere Pulszeichen. Beurteilung: Echokardiographie (TTE/TEE)." }
      ]}
    ]
  },

  // ---------------------------------------------------------------------------
  // FALL 5 — HYPERTHYREOSE (12 Protokolle)
  // ---------------------------------------------------------------------------
  {
    id: 5,
    caseTitle: "Fall 5: Hyperthyreose (Frau Anna Vogt, 43 J)",
    initialVignette: "Frau Anna Vogt, 43 Jahre, BMI 20,7 kg/m², stellt sich mit seit einem Monat bestehender innerer Unruhe, Herzklopfen (Palpitationen), Müdigkeit, Schlafstörung und Kloßgefühl im Hals vor. Seit einer Woche zusätzlich mehrmals täglich Durchfall. Kein Fieber, kein Infekthinweis.",
    phases: [
      { phaseName: "Teil 1: Anamnese und körperliche Untersuchung", questions: [
        { id: "q1", text: "Stellen Sie die Patientin vor. Verdachtsdiagnose und Differenzialdiagnosen? Welche Ursachen der Hyperthyreose kennen Sie?",
          modelAnswer: "V. a. Hyperthyreose. Ursachen: Morbus Basedow (TRAK, Merseburger Trias: Struma, Tachykardie, Exophthalmus), Schilddrüsenautonomie (unifokal/multifokal), Thyreoiditis (De Quervain, Hashimoto-Frühphase), iatrogen/jodinduziert. DD: Angststörung, Phäochromozytom, Anämie, Herzrhythmusstörung." },
        { id: "q2", text: "Zeigen Sie die Untersuchung der Schilddrüse und des Halses. Warum und wie auskultieren Sie die Karotiden?",
          modelAnswer: "Inspektion (Struma, Schluckverschieblichkeit), Palpation von dorsal beim Schlucken (Größe, Konsistenz, Knoten, Druckschmerz), Lymphknoten. Auskultation der Schilddrüse (Schwirren bei M. Basedow) und der Karotiden (Strömungsgeräusch/Stenose) — Cave: nicht bei V. a. hochgradige Stenose komprimieren." },
        { id: "q3", text: "Welche Laborwerte bestimmen Sie, und was erwarten Sie? Welche apparative Diagnostik schließt sich an?",
          modelAnswer: "TSH erniedrigt, fT3/fT4 erhöht. Antikörper: TRAK (Basedow), TPO-AK, Tg-AK. Sonographie der Schilddrüse (Volumen, Knoten, Vaskularisation), Szintigraphie (heiße/kalte Knoten, Autonomie). EKG (Tachykardie/VHF)." }
      ]},
      { phaseName: "Teil 2: Radiologie und Bildgebung / Strahlenschutz", questions: [
        { id: "q4", text: "[Röntgen Thorax, Normalbefund] Beschreiben Sie systematisch. Patient hat Fieber — was brauchen Sie zusätzlich? Erklären Sie kurz die Grundprinzipien des Strahlenschutzes.",
          modelAnswer: "Systematik nach ABCDE(F): Adequacy/Rotation, Airway/Trachea, Breathing/Lunge, Cardiac/Herzgröße (HTQ), Diaphragma/Sinus, Everything/Knochen+Weichteile. Bei Fieber/DD Pneumonie: seitliche (laterale) Aufnahme. Strahlenschutz: Rechtfertigung, Dosisbegrenzung, ALARA; Abstand, Abschirmung, Aufenthaltsdauer; Schwangerschaft beachten." },
        { id: "q5", text: "Unterschied p.a.- vs. a.p.-Aufnahme? Warum ist bei a.p. der Herz-Thorax-Quotient nicht sicher beurteilbar?",
          modelAnswer: "p.a.: Strahl von hinten nach vorne, Herz liegt der Kassette an → originalgetreue Herzgröße; Standard beim stehenden Patienten. a.p. (liegend/bettlägerig): Herz weiter von der Kassette → Vergrößerungseffekt, HTQ falsch-positiv erhöht, kein sicherer HTQ." },
        { id: "q6", text: "[Röntgen Thorax mit Spannungspneumothorax] Nennen Sie klinische und radiologische Zeichen. Wie versorgen Sie präklinisch, und wo liegen Monaldi- und Bülau-Punkt?",
          modelAnswer: "Klinisch: akute Dyspnoe, hypersonorer Klopfschall, fehlendes Atemgeräusch, obere Einflussstauung, Tachykardie/Hypotonie, Trachealverlagerung. Radiologisch: fehlende Gefäßzeichnung, Mediastinalverlagerung zur Gegenseite, tiefstehendes Zwerchfell. Präklinisch: sofortige Entlastungspunktion (Nadel) 2.–3. ICR medioklavikulär (Monaldi), dann Thoraxdrainage; Bülau: 4.–5. ICR vordere/mittlere Axillarlinie. Ventilmechanismus erklärt die Dringlichkeit." }
      ]},
      { phaseName: "Teil 3: Chirurgie", questions: [
        { id: "q7", text: "Welche Komplikationen der Thyreoidektomie kennen Sie? Wie erkennen und behandeln Sie sie?",
          modelAnswer: "Recurrensparese (Heiserkeit, bei beidseitig Atemnot → Notfall), Hypoparathyreoidismus mit Hypokalzämie (Parästhesien, Chvostek/Trousseau, tetanie → Kalzium/Vitamin D), Nachblutung mit Atemwegskompression (sofortige Entlastung), Wundinfektion, thyreotoxische Krise." },
        { id: "q8", text: "Ein postoperativer Patient nimmt Opioide. Welche wichtigen Nebenwirkungen überwachen Sie? Worauf achten Sie bei der Drainage?",
          modelAnswer: "Opioide: Atemdepression, Sedierung, Obstipation (immer Laxans!), Übelkeit/Erbrechen (initial emetisch), Miosis, Harnverhalt, Toleranz/Abhängigkeit. Drainage: Menge, Farbe/Verfärbung, Geruch — z. B. grüne Verfärbung = Gallenleckage, plötzlich viel Blut = Nachblutung." },
        { id: "q9", text: "Was ist eine nosokomiale Infektion, und welche Institution ist in Deutschland für Hygiene-/Infektionsschutz zuständig?",
          modelAnswer: "Nosokomiale Infektion: im Zusammenhang mit medizinischer Behandlung erworben, frühestens 48 h nach Aufnahme. Zuständig: Robert Koch-Institut (RKI), KRINKO-Empfehlungen; meldepflichtige Erkrankungen nach Infektionsschutzgesetz (IfSG)." }
      ]},
      { phaseName: "Teil 4: Innere Medizin / Pharmakotherapie", questions: [
        { id: "q10", text: "Wie behandeln Sie die Hyperthyreose medikamentös? Was ist eine thyreotoxische Krise?",
          modelAnswer: "Thyreostatika: Thionamide (Thiamazol/Carbimazol, Propylthiouracil in Schwangerschaft 1. Trimenon), Betablocker symptomatisch (Propranolol). Definitiv: Radiojodtherapie oder Thyreoidektomie. Thyreotoxische Krise: lebensbedrohliche Entgleisung (Fieber, Tachykardie/VHF, Unruhe, Bewusstseinsstörung) — Intensiv, Thyreostatika, Betablocker, Glukokortikoide, ggf. Jod (Plummerung)." },
        { id: "q11", text: "[EKG-Blickdiagnose] Vorhofflimmern. Wie schätzen Sie das Schlaganfallrisiko ein, und wann antikoagulieren Sie? Welche Frequenz-/Rhythmuskontrolle?",
          modelAnswer: "CHA2DS2-VASc-Score zur Risikostratifizierung; ab ≥ 2 (Männer) bzw. ≥ 3 (Frauen) orale Antikoagulation (DOAK bevorzugt). Blutungsrisiko HAS-BLED. Bei Score 0 keine Antikoagulation. Frequenzkontrolle (Betablocker), Rhythmuskontrolle/Kardioversion oder Katheterablation je nach Symptomatik. Hyperthyreose als reversible Ursache behandeln." },
        { id: "q12", text: "[Patient mit Belastungsdyspnoe/Brustschmerz] Wie gehen Sie vor? Nennen Sie die Red Flags bei Thoraxschmerz und die Basisdiagnostik.",
          modelAnswer: "Red Flags: akuter Vernichtungsschmerz, Ausstrahlung (Arm/Kiefer), Dyspnoe, Kaltschweißigkeit, Synkope, hämodynamische Instabilität. Basisdiagnostik: EKG, Herzenzyme (Troponin), Röntgen-Thorax, D-Dimer, BGA. DD: ACS, Lungenembolie, Aortendissektion, Pneumothorax, Perikarditis, Ösophagus. Belastungsabhängig → Ischämiediagnostik (Ergometrie/Koronarangiographie)." }
      ]}
    ]
  }
];

// Anweisung an das Bewertungsmodell (LLM / Chat-Host).
var evaluationInstructions =
  "Du bist Prüfer der Kenntnisprüfung (Innere Medizin und Chirurgie) am Universitätsklinikum Mannheim. " +
  "Bewerte die Antwort des Prüflings auf Deutsch, konstruktiv und examensnah, anhand von: " +
  "(1) klinischer Korrektheit, (2) strukturierter Darstellung (z. B. Systematik/ABCDE wo relevant), " +
  "(3) fehlenden kritischen Punkten und Red Flags, (4) korrekter medizinischer Fachsprache. " +
  "Gib eine kurze Gesamteinschätzung (bestanden / grenzwertig / nicht ausreichend), 2–3 konkrete Stärken " +
  "und 2–3 gezielte Verbesserungen. Halte dich kurz und präzise.";

// Export für Modul- und Nicht-Modul-Kontexte.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { caseSeries: caseSeries, evaluationInstructions: evaluationInstructions };
}
