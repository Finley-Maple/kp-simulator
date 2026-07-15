// =============================================================================
// question-bank.js — COMPREHENSIVE Fragenkatalog appended to caseSeries.
// =============================================================================
// The 5 cases in cases.js reproduce the real Teil-1 anamnesis scenarios. This
// file adds discipline-organized question banks that aim to cover EVERY distinct
// question/topic asked across all 92 Mannheim protocols (2021–2025) in the oral
// stations — Radiologie, Chirurgie, Innere/Kardiologie, Labormedizin, and
// Notfall/Pharmakotherapie — including one-off questions.
//
// Questions are cleaned/canonicalized from the source (the raw protocols contain
// dialogue fragments, misspellings and OCR noise). Where two reports asked the
// same thing differently, they are merged into one canonical question. Model
// answers are provided for the higher-yield items; some long-tail questions are
// question-only (the LLM still evaluates any answer without a stored key point).
//
// Loaded AFTER cases.js, so it can push onto the existing caseSeries array.
// =============================================================================
(function () {
  "use strict";
  if (typeof caseSeries === "undefined") return;

  var bank = [
    // -------------------------------------------------------------------------
    // FALL 6 — RADIOLOGIE: Fragenkatalog
    // -------------------------------------------------------------------------
    {
      id: 6,
      caseTitle: "Fall 6: Radiologie — Fragenkatalog",
      diagnosis: "Bildgebung, Strahlenschutz, Blickdiagnosen",
      initialVignette: "Sammlung aller radiologischen Fragen und Blickdiagnosen aus den Mannheimer Protokollen: Röntgen-Thorax, Abdomen, Skelett, Schädel-CT, Kontrastmittel und Strahlenschutz.",
      phases: [
        { phaseName: "Teil 1: Röntgen-Thorax und Technik", questions: [
          { id: "r1", text: "[Röntgen Thorax] Beschreiben Sie systematisch nach dem ABCDE(F)-Schema.", modelAnswer: "Adäquanz/Rotation/Inspiration, Airway (Trachea mittelständig), Breathing (Lungenfelder, Ergüsse), Cardiac (Herzgröße/HTQ < 0,5), Diaphragma/Sinus, Everything (Knochen, Weichteile, Fremdmaterial)." },
          { id: "r2", text: "Unterschied p.a.- vs. a.p.-Aufnahme. Warum erscheint das Herz bei p.a. kleiner und der Herz-Thorax-Quotient nur dort verwertbar?", modelAnswer: "p.a.: Herz liegt der Kassette an → originalgetreue Größe. a.p. (liegend): Herz weiter von der Kassette → Zentralstrahl-Vergrößerung, HTQ falsch-hoch, nicht verwertbar." },
          { id: "r3", text: "[Röntgen Thorax mit Fieber, V. a. Pneumonie] Was fordern Sie zusätzlich, und wie erkennen Sie eine Lobärpneumonie?", modelAnswer: "Seitliche (laterale) Aufnahme. Lobärpneumonie: flächige, lappenbegrenzte Verschattung mit positivem Bronchopneumogramm." },
          { id: "r4", text: "Welche anderen Pneumonie-Typen kennen Sie, und welcher Lappen ist typischerweise betroffen?", modelAnswer: "Lobär-, Bronchopneumonie, interstitielle (atypische) Pneumonie. Lokalisation je nach Aspiration/Belüftung; rechter Unterlappen häufig bei Aspiration." },
          { id: "r5", text: "[Röntgen Thorax] Nennen Sie die radiologischen Zeichen eines Lungenemphysems.", modelAnswer: "Fassthorax, abgeflachte Zwerchfelle, vermehrte Strahlentransparenz, verschmälerte Herzsilhouette, weite Interkostalräume, Bullae." },
          { id: "r6", text: "[Röntgen Thorax] Schmetterlingsverschattung — Verdachtsdiagnose?", modelAnswer: "Zentrales (kardiales) Lungenödem — schmetterlingsförmige perihiläre Verschattung, Kerley-B-Linien, Ergüsse." },
          { id: "r7", text: "[Röntgen Thorax, p.a. und seitlich] Wo erkennen Sie einen Pleuraerguss, und wie therapieren Sie ihn?", modelAnswer: "Verschattung mit Meniskuszeichen, Randwinkelverlegung; im Seitbild dorsaler Randwinkel. Therapie: Ursache klären, Pleurapunktion/Entlastung, ggf. Drainage." }
        ]},
        { phaseName: "Teil 2: Pneumothorax und Mediastinum", questions: [
          { id: "r8", text: "[Röntgen Thorax] Spannungspneumothorax: klinische und radiologische Zeichen. Erklären Sie den Ventilmechanismus.", modelAnswer: "Klinisch: akute Dyspnoe, hypersonorer Klopfschall, fehlendes AG, obere Einflussstauung, Hypotonie/Tachykardie, Trachealverlagerung. Radiologisch: fehlende Gefäßzeichnung, Mediastinalverlagerung zur Gegenseite, Zwerchfelltiefstand. Ventil: Luft strömt ein, nicht heraus → Druckanstieg." },
          { id: "r9", text: "Wie versorgen Sie einen Spannungspneumothorax präklinisch? Wo liegen Monaldi- und Bülau-Punkt?", modelAnswer: "Sofortige Entlastungspunktion (Nadel) im 2.–3. ICR medioklavikulär (Monaldi), dann Thoraxdrainage. Bülau: 4.–5. ICR vordere/mittlere Axillarlinie." },
          { id: "r10", text: "Welche pathologischen Befunde erwarten Sie bei der körperlichen Untersuchung eines Pneumothorax?", modelAnswer: "Hypersonorer Klopfschall, abgeschwächtes/fehlendes Atemgeräusch, verminderter Stimmfremitus auf der betroffenen Seite." },
          { id: "r11", text: "[Röntgen Thorax mit Mediastinalverbreiterung, Brustschmerz] Verdacht und weitere Abklärung? Was tun bei Zustand nach Sternotomie/Clips?", modelAnswer: "V. a. Aortendissektion (DD Aneurysma). CT-Angiographie (Goldstandard), TEE alternativ, RR beidseits. Clips/Sternotomie → Z. n. Bypass-OP als Ursache." },
          { id: "r12", text: "[CT] Wie differenzieren Sie Aortendissektion von Aortenaneurysma? Nennen Sie die Stanford-Klassifikation und warum Typ A ein Notfall ist.", modelAnswer: "Dissektion: Intimaflap/Doppellumen; Aneurysma: Wandausweitung > 1,5-fach. Stanford A (Aorta ascendens) = chirurgischer Notfall (Perikardtamponade, Aortenklappeninsuffizienz, Koronar-/Karotisverschluss). Stanford B: konservativ, Blutdrucksenkung." }
        ]},
        { phaseName: "Teil 3: Abdomen-Übersicht und CT", questions: [
          { id: "r13", text: "[Abdomenübersicht Linksseitenlage / seitlich] Freie Luft — was bedeutet das und wie gehen Sie vor?", modelAnswer: "Hohlorganperforation → Notfall. Freie Luft subdiaphragmal (im Stehen) bzw. an lateraler Bauchwand (Linksseitenlage). Notfall-OP." },
          { id: "r14", text: "[Röntgen Abdomen mit Spiegeln] Mechanischer vs. paralytischer Ileus — radiologisch und klinisch?", modelAnswer: "Mechanisch: Spiegel proximal der Stenose, Hyperperistaltik/klingende Darmgeräusche, Kolik. Paralytisch: diffus geblähte Schlingen, 'Totenstille'." },
          { id: "r15", text: "[Abdomen] Stark erweiterte Darmschlingen — an welche Differenzialdiagnosen denken Sie (z. B. toxisches Megakolon, Volvulus)?", modelAnswer: "Toxisches Megakolon (Kolondilatation > 6 cm bei Kolitis), Sigmavolvulus ('Kaffeebohnenzeichen'), Ogilvie-Syndrom." },
          { id: "r16", text: "[Bild] Ileostoma — was ist das und warum wird es angelegt?", modelAnswer: "Künstlicher Dünndarmausgang; als protektives (doppelläufiges) Stoma zum Schutz einer distalen Anastomose oder als endständiges Stoma nach Resektion." },
          { id: "r17", text: "[CT] Wann ist ein CT-Angio bei Verdacht auf Lungenarterienembolie indiziert? Und bei Mesenterialischämie?", modelAnswer: "LAE: bei hoher klinischer Wahrscheinlichkeit (Wells) oder positivem D-Dimer und hämodynamischer Stabilität. Mesenterialischämie: CT-Angiographie bei akutem Abdomen mit VHF/Laktatanstieg." },
          { id: "r18", text: "Bei Verdacht auf Nephrolithiasis: CT mit oder ohne Kontrastmittel — und warum?", modelAnswer: "Low-Dose-CT OHNE Kontrastmittel; KM würde die dichten Konkremente überlagern/maskieren." }
        ]},
        { phaseName: "Teil 4: Skelett und Schädel-CT", questions: [
          { id: "r19", text: "[Röntgen oberes Sprunggelenk] Erklären Sie die Weber-Klassifikation und die jeweilige Therapie.", modelAnswer: "Weber A (unter Syndesmose) meist konservativ; Weber B (auf Höhe) je nach Stabilität; Weber C (oberhalb, Syndesmose zerrissen) operativ. Immer zweite Ebene." },
          { id: "r20", text: "[Röntgen Becken] Proximale Femur-/Schenkelhalsfraktur: Klassifikationen, Therapie und wann operieren?", modelAnswer: "Garden/Pauwels. Junge/nicht disloziert: Osteosynthese; alt/disloziert: Endoprothese (Duokopf/TEP). OP möglichst < 24 h; Cave Femurkopfnekrose, TVT, Pneumonie." },
          { id: "r21", text: "[Röntgen LWS] Sie sehen Arthrose- und evtl. Aortenzeichen — woran müssen Sie bei Rückenschmerz zusätzlich denken?", modelAnswer: "Bauchaortenaneurysma (paravertebrale Verkalkung/Verbreiterung), Wirbelkörperfraktur/Osteoporose, Metastasen; MRT bei neurologischem Defizit." },
          { id: "r22", text: "[Schädel-CT, zwei Bilder] Epidurales vs. subdurales Hämatom — Form, Gefäß, Klinik, Therapie?", modelAnswer: "Epidural: bikonvex/linsenförmig, arteriell (A. meningea media), freies Intervall, respektiert Suturen. Subdural: sichelförmig/konkav, venös (Brückenvenen), ältere/antikoagulierte Pat. Therapie: neurochirurgische Entlastung." },
          { id: "r23", text: "[Schädel-CT] Ischämischer Schlaganfall — Vorgehen und Akuttherapie im Zeitfenster.", modelAnswer: "Nativ-CT (Blutungsausschluss), CT-Angio/Perfusion. Lyse (rtPA) < 4,5 h, Thrombektomie bei großem Gefäßverschluss bis 6 h (ausgewählt länger). Stroke Unit." },
          { id: "r24", text: "[Schädel-CT] Sinus-frontalis-Fraktur mit Pneumozephalus — Bedeutung und Behandlung?", modelAnswer: "Luft intrakraniell nach Fraktur mit Duraverletzung → Infektions-/Liquorrhö-Gefahr; neurochirurgische/MKG-Vorstellung, ggf. operative Versorgung, Antibiose." },
          { id: "r25", text: "[Röntgen Kind, einseitige Hypertransparenz] Woran denken Sie?", modelAnswer: "Fremdkörperaspiration mit Ventilmechanismus (Air trapping, einseitige Überblähung); Bronchoskopie." }
        ]},
        { phaseName: "Teil 5: Kontrastmittel und Strahlenschutz", questions: [
          { id: "r26", text: "Wie wirken jodhaltige Kontrastmittel? Nennen Sie Komplikationen und Kontraindikationen.", modelAnswer: "Erhöhen die Röntgendichte. Komplikationen: allergoide Reaktion, KM-Nephropathie, thyreotoxische Krise, Laktatazidose mit Metformin. KI/Vorsicht: Niereninsuffizienz, Hyperthyreose, KM-Allergie, Metformin, Schwangerschaft." },
          { id: "r27", text: "Wann führen Sie bei Schwangeren ein CT durch, und was bevorzugen Sie sonst?", modelAnswer: "Nur bei vitaler Indikation; sonst strahlenfreie Verfahren (Sonographie, MRT ohne Gadolinium wenn möglich)." },
          { id: "r28", text: "Nennen Sie die Grundprinzipien des Strahlenschutzes.", modelAnswer: "Rechtfertigung, Optimierung (ALARA), Dosisbegrenzung; praktisch: Abstand, Abschirmung, Aufenthaltsdauer; besonderer Schutz bei Schwangeren/Kindern." },
          { id: "r29", text: "Wann sollte man keine thorakale Perkussion durchführen?", modelAnswer: "Bei Verdacht auf Rippenfraktur (Schmerz/Instabilität) — Perkussion/Kompression unterlassen." }
        ]}
      ]
    },

    // -------------------------------------------------------------------------
    // FALL 7 — CHIRURGIE: Fragenkatalog
    // -------------------------------------------------------------------------
    {
      id: 7,
      caseTitle: "Fall 7: Chirurgie — Fragenkatalog",
      diagnosis: "Abdominalchirurgie, Gallenwege, Hernien, Schilddrüse",
      initialVignette: "Sammlung aller chirurgischen Fragen aus den Protokollen: Divertikulitis/Kolon, Gallenwege/Pankreas, Ileus/akutes Abdomen, Hernien, Schilddrüse und postoperatives Management.",
      phases: [
        { phaseName: "Teil 1: Divertikulitis, Kolon, Onkologie", questions: [
          { id: "c1", text: "Konservative vs. operative Therapie der Divertikulitis — wann operieren Sie? Welche Klassifikation nutzen Sie?", modelAnswer: "Unkompliziert: konservativ (Karenz/leichte Kost, ggf. Antibiotika, Analgesie). Kompliziert/Perforation/Rezidiv: OP. Notfall-OP bei freier Perforation/Peritonitis. Klassifikation: Hansen-Stock/CDD, Hinchey." },
          { id: "c2", text: "Erklären Sie die Hartmann-Operation und wann Sie primär vs. sekundär anastomosieren.", modelAnswer: "Hartmann: Sigmaresektion, endständiges Kolostoma, Blindverschluss des Rektumstumpfs — bei Peritonitis/instabilem Patienten. Primäre Anastomose bei sauberen, stabilen Verhältnissen; sekundär mit protektivem Stoma bei Kontamination." },
          { id: "c3", text: "Unterschied Divertikulose vs. Divertikulitis — woran erkennen Sie, dass (noch) keine Entzündung vorliegt?", modelAnswer: "Divertikulose: asymptomatische Ausstülpungen. Divertikulitis: Entzündung mit Schmerz, Fieber, CRP-/Leukozytenanstieg. Ohne Fieber/Stuhlveränderung/Entzündungszeichen eher Divertikulose." },
          { id: "c4", text: "Was ist eine Anastomoseninsuffizienz, wie erkennen und behandeln Sie sie?", modelAnswer: "Undichtigkeit der Naht → Peritonitis/Sepsis, Fieber, CRP-Anstieg, Sekret aus Drainage. Diagnostik CT mit KM; Therapie: Antibiose, Drainage/Re-OP, ggf. Stomaanlage." },
          { id: "c5", text: "Kolorektalkarzinom: Diagnostik, Staging und Therapie (inkl. neoadjuvant). Welche genetischen Syndrome sind assoziiert?", modelAnswer: "Koloskopie mit Biopsie, CT/MRT-Staging (TNM), CEA. Rektum-CA: neoadjuvante Radiochemo + OP; Kolon-CA: OP + adjuvante Chemo. Syndrome: FAP, HNPCC/Lynch, Peutz-Jeghers." },
          { id: "c6", text: "Warum legt man bei tiefer Rektumresektion ein (protektives) Ileostoma an?", modelAnswer: "Zum Schutz der distalen Anastomose vor Stuhlpassage → geringeres Insuffizienzrisiko; später Rückverlagerung." },
          { id: "c7", text: "Unterschied endständiges vs. doppelläufiges Stoma.", modelAnswer: "Endständig: ein Lumen, Darm durchtrennt (z. B. nach Hartmann). Doppelläufig: zu- und abführende Schlinge, protektiv, leichter rückverlagerbar." }
        ]},
        { phaseName: "Teil 2: Gallenwege, Cholezystitis, Pankreatitis", questions: [
          { id: "c8", text: "Erklären Sie Anatomie und Verlauf der Gallenwege. Wie führt eine Cholezystolithiasis zur biliären Pankreatitis?", modelAnswer: "D. hepaticus dexter+sinister → communis, + D. cysticus → D. choledochus, mit D. pancreaticus in die Papilla Vateri. Stein in der Papille staut auch den Pankreasgang → biliäre Pankreatitis." },
          { id: "c9", text: "Erklären Sie Cholezystolithiasis, Choledocholithiasis und Cholangitis. Nennen Sie die Charcot-Trias.", modelAnswer: "Steine in Gallenblase / im D. choledochus (Verschlussikterus) / bakterielle Gallengangsentzündung. Charcot-Trias: rechtsseitiger Oberbauchschmerz + Ikterus + Fieber; Reynolds-Pentade + Hypotonie + Bewusstseinsstörung." },
          { id: "c10", text: "Patientin mit asymptomatischen Gallensteinen zum Vorsorge-Check — Vorgehen und warum keine Operation?", modelAnswer: "Asymptomatische Cholezystolithiasis: keine OP, fettarme Ernährung. Grund: geringes Komplikationsrisiko, OP nur bei Symptomen (Ausnahmen: Porzellangallenblase, große Steine/Polypen, bestimmte Risikokonstellationen)." },
          { id: "c11", text: "[Sono] Nennen Sie die sonografischen Zeichen der Cholezystitis. Was noch gehört zur Diagnostik?", modelAnswer: "Wandverdickung (> 3–4 mm), Dreischichtung, Steine mit Schallschatten, perivesikale Flüssigkeit, sonografisches Murphy-Zeichen, erweiterter DHC. Zusätzlich Labor (Cholestase/Entzündung), ggf. MRCP." },
          { id: "c12", text: "Wann setzen Sie eine ERCP ein und was ist das Ziel? Führen Sie danach die Cholezystektomie durch?", modelAnswer: "ERCP bei Choledocholithiasis/Cholangitis zur Steinentfernung/Papillotomie und Gallengangsentlastung. Cholezystektomie im Verlauf (meist innerhalb derselben Aufnahme) zur Rezidivprophylaxe." },
          { id: "c13", text: "Biliäre Pankreatitis: Pathophysiologie, wichtigste Laborwerte, Therapie und Komplikationen.", modelAnswer: "Gangobstruktion → Autodigestion. Labor: Lipase (> 3-fach), Amylase unspezifisch, GGT/ALT, CRP, Kalzium, Harnstoff. Therapie: Volumen, Analgesie, ERCP bei Obstruktion. Komplikationen: Nekrose, Pseudozyste, Infektion." },
          { id: "c14", text: "Wie prüfen Sie das Murphy-Zeichen, und was bedeutet ein positives Zeichen?", modelAnswer: "Palpation unter dem rechten Rippenbogen bei tiefer Inspiration; schmerzbedingter Atemstopp = positiv, spricht für Cholezystitis." }
        ]},
        { phaseName: "Teil 3: Ileus, akutes Abdomen, Hernien", questions: [
          { id: "c15", text: "Ätiologie und Therapie des mechanischen und des paralytischen Ileus. Was ist ein Bridenileus?", modelAnswer: "Mechanisch: Briden/Verwachsungen, Hernien, Tumor, Gallenstein. Paralytisch: postoperativ, Peritonitis, Ischämie, Elektrolyte, Opioide. Bridenileus: durch Verwachsungen nach Voroperation. Therapie: Entlastung, Ursache; paralytisch Prokinetika." },
          { id: "c16", text: "Akutes Abdomen mit freier Luft — Vorgehen und OP-Fristen.", modelAnswer: "Stabilisierung, Analgesie, Breitband-Antibiose, sofortige explorative Laparotomie/Laparoskopie bei Perforation/Peritonitis (Notfall, keine Verzögerung)." },
          { id: "c17", text: "Unterschied direkte vs. indirekte Leistenhernie. Wie entsteht eine Schenkelhernie?", modelAnswer: "Indirekt: lateral der epigastrischen Gefäße durch inneren Leistenring, oft angeboren. Direkt: medial durch Hesselbach-Dreieck, erworben. Schenkelhernie: unter dem Leistenband durch die Lacuna vasorum, häufiger bei Frauen, hohe Inkarzerationsgefahr." },
          { id: "c18", text: "Welche OP-Verfahren mit Naht bzw. Netz kennen Sie bei Hernien?", modelAnswer: "Netzverfahren: Lichtenstein (offen), TEP/TAPP (laparoskopisch). Nahtverfahren: Shouldice (Naht ohne Netz), Bassini." },
          { id: "c19", text: "Warum wird eine Schenkelhernie (und bei Frauen die Leistenhernie) elektiv/immer operiert?", modelAnswer: "Hohe Inkarzerations- und Strangulationsgefahr; Notfallkomplikationen häufiger → frühzeitige/elektive Versorgung." },
          { id: "c20", text: "Bei bekanntem Vorhofflimmern und akutem Bauchschmerz — welche chirurgisch relevante Diagnose und Vorgehen?", modelAnswer: "Mesenterialischämie (arterielle Embolie): Vernichtungsschmerz mit freiem Intervall, Laktatanstieg. CT-Angio, Notfall-Revaskularisation/Embolektomie, ggf. Resektion, Antikoagulation." }
        ]},
        { phaseName: "Teil 4: Schilddrüse und postoperatives Management", questions: [
          { id: "c21", text: "Welche Komplikationen der Thyreoidektomie kennen Sie? Wie erkennen und behandeln Sie sie?", modelAnswer: "Recurrensparese (Heiserkeit; beidseitig Atemnot → Notfall), Hypoparathyreoidismus/Hypokalzämie (Parästhesien, Chvostek/Trousseau → Kalzium/Vit D), Nachblutung mit Atemwegskompression (sofortige Entlastung), Wundinfektion." },
          { id: "c22", text: "Warum ist ein Hämatom nach Thyreoidektomie gefährlich, und was tun Sie?", modelAnswer: "Kompression der Trachea → akute Atemnot/Erstickung. Sofortige Wunderöffnung/Hämatomausräumung, Atemwegssicherung." },
          { id: "c23", text: "Wie wird ein Patient nach Thyreoidektomie bei Schilddrüsenkarzinom weiterbehandelt?", modelAnswer: "Levothyroxin-Substitution (TSH-suppressiv), bei differenziertem CA Radiojodtherapie, Tumornachsorge (Thyreoglobulin, Sonographie); Kalzium/Vit D bei Hypoparathyreoidismus." },
          { id: "c24", text: "Ein postoperativer Patient nimmt Opioide — welche Nebenwirkungen überwachen Sie? Worauf achten Sie bei der Drainage?", modelAnswer: "Opioide: Atemdepression, Sedierung, Obstipation (Laxans!), Übelkeit/Erbrechen (initial emetisch), Harnverhalt, Miosis. Drainage: Menge, Farbe, Geruch — grüne Verfärbung = Galleleckage, viel frisches Blut = Nachblutung." },
          { id: "c25", text: "Was kontrollieren Sie generell postoperativ (KK/Nachsorge)?", modelAnswer: "Vitalparameter, Wunde/Verband, Drainagen, Schmerz, Mobilisation, Thromboseprophylaxe, Laborkontrollen, Ausscheidung, Atemtherapie." }
        ]},
        { phaseName: "Teil 5: Anatomie- und Grundlagenfragen (Chirurg)", questions: [
          { id: "c26", text: "Was verstehen Sie unter einem Dermatom? Zeigen Sie den Verlauf des Nervus ischiadicus.", modelAnswer: "Dermatom: sensibel von einer Spinalnervenwurzel versorgtes Hautareal. N. ischiadicus: aus Plexus sacralis (L4–S3), verläuft dorsal am Oberschenkel, teilt sich in N. tibialis und N. fibularis communis." },
          { id: "c27", text: "Welche Bedeutung hat die Vena portae? Was sind portokavale Anastomosen und wann werden sie klinisch relevant?", modelAnswer: "Pfortader führt nährstoffreiches Blut vom Darm zur Leber. Portokavale Anastomosen (Ösophagus-, Rektal-, Umbilikalvenen) werden bei portaler Hypertension (Leberzirrhose) relevant → Ösophagusvarizen, Caput medusae, Hämorrhoiden." },
          { id: "c28", text: "Was ist eine nosokomiale Infektion, und welche Institution ist in Deutschland dafür zuständig?", modelAnswer: "Infektion frühestens 48 h nach Aufnahme, behandlungsassoziiert. Zuständig: Robert Koch-Institut (RKI/KRINKO); Meldepflichten nach IfSG." }
        ]}
      ]
    },

    // -------------------------------------------------------------------------
    // FALL 8 — INNERE MEDIZIN & KARDIOLOGIE: Fragenkatalog
    // -------------------------------------------------------------------------
    {
      id: 8,
      caseTitle: "Fall 8: Innere Medizin & Kardiologie — Fragenkatalog",
      diagnosis: "EKG, ACS, Rhythmus, Herzinsuffizienz, Lunge, Endokrin",
      initialVignette: "Sammlung internistisch-kardiologischer Fragen: EKG-Blickdiagnosen, akutes Koronarsyndrom, Vorhofflimmern, Herzinsuffizienz, Hypertonie, Lungenembolie/TVT, Pneumonie und endokrine Notfälle.",
      phases: [
        { phaseName: "Teil 1: ACS, EKG und Reanimation", questions: [
          { id: "i1", text: "[EKG] STEMI der Vorderwand — welches Gefäß, Sofortmaßnahmen und Zeitfenster?", modelAnswer: "Vorderwand → LAD. MONA-BASH (Morphin, O2 bei Hypoxie, Nitrat, ASS + zweiter Plättchenhemmer, Heparin, Betablocker, Statin). Primär-PCI < 120 min; Lyse nur wenn PCI nicht rechtzeitig." },
          { id: "i2", text: "[EKG] ST-Hebungen in II, III und aVF — welche Wand/Gefäß, worauf achten Sie?", modelAnswer: "Inferiorer Infarkt, meist RCA. Cave Rechtsherzinfarkt (Nitrate vorsichtig, volumenabhängig), Bradykardie/AV-Block." },
          { id: "i3", text: "Wie wirken ASS und Prasugrel/Ticagrelor? Wann ist eine Lyse indiziert?", modelAnswer: "ASS: irreversible COX-1-Hemmung → weniger Thromboxan. Prasugrel/Ticagrelor: P2Y12-Hemmung. Lyse: STEMI, wenn PCI nicht innerhalb der Fristen verfügbar und keine Kontraindikationen." },
          { id: "i4", text: "Welche Stent-Typen kennen Sie, und was kontrollieren Sie nach PTCA?", modelAnswer: "Bare-Metal- vs. Drug-Eluting-Stent (DES bevorzugt). Nach PTCA: duale Plättchenhemmung, Echo zur EF-Beurteilung, Rhythmusmonitoring, Sekundärprophylaxe." },
          { id: "i5", text: "Welche Frühkomplikationen eines Myokardinfarkts kennen Sie, und wie erkennen Sie einen kardiogenen Schock?", modelAnswer: "Rhythmusstörungen (VT/VF), Herzinsuffizienz/Lungenödem, kardiogener Schock, Papillarmuskel-/Septumruptur, Perikarditis. Kardiogener Schock: Hypotonie, Hypoperfusion, Laktat, Oligurie trotz Volumen." },
          { id: "i6", text: "[EKG] Kammerflimmern — Therapie und Ursachen (kardial/extrakardial)?", modelAnswer: "Defibrillation + CPR 30:2, Adrenalin alle 3–5 min, Amiodaron nach 3. Schock. Ursachen: Ischämie, Kardiomyopathie, Long-QT; extrakardial Hypoxie, Elektrolyt (K+), Hypothermie, Intoxikation (4 H, HITS)." },
          { id: "i7", text: "[Notfall] Bewusstloser Patient auf der Straße — Vorgehen. Wie lautet die Notrufnummer?", modelAnswer: "Eigenschutz, Ansprechen/Rütteln, Atemwege, Atmung prüfen (≤ 10 s). Normale Atmung → stabile Seitenlage; keine → CPR 30:2 + AED. Notruf 112." }
        ]},
        { phaseName: "Teil 2: Vorhofflimmern und Herzinsuffizienz", questions: [
          { id: "i8", text: "[EKG] Vorhofflimmern beim Check-up (unregelmäßiger Puls) — wie gehen Sie vor?", modelAnswer: "Bestätigung im EKG, Anamnese/Ursachensuche, TSH, Echo. Risikostratifizierung CHA2DS2-VASc, Frequenz-/Rhythmuskontrolle, Antikoagulation je nach Score." },
          { id: "i9", text: "Wann antikoagulieren Sie bei Vorhofflimmern? Was, wenn der CHA2DS2-VASc-Score 0 ist?", modelAnswer: "Ab CHA2DS2-VASc ≥ 2 (Männer) bzw. ≥ 3 (Frauen) orale Antikoagulation (DOAK bevorzugt). Bei Score 0: keine Antikoagulation. Blutungsrisiko mit HAS-BLED abschätzen." },
          { id: "i10", text: "Welche Typen des Vorhofflimmerns gibt es? Wie heißt das VHF nach hohem Alkoholkonsum?", modelAnswer: "Paroxysmal, persistierend, langanhaltend persistierend, permanent. Nach Alkohol: 'Holiday-Heart-Syndrom'." },
          { id: "i11", text: "Wie behandeln Sie paroxysmales Vorhofflimmern? Nennen Sie Ursachen des VHF.", modelAnswer: "Frequenzkontrolle (Betablocker), Rhythmuskontrolle/Kardioversion oder Katheterablation je nach Symptomatik; Antikoagulation nach Score. Ursachen: Hypertonie, KHK, Herzinsuffizienz, Klappen, Hyperthyreose, Alkohol." },
          { id: "i12", text: "[Fall Linksherzinsuffizienz mit Pleuraerguss] Wie diagnostizieren und therapieren Sie eine Herzinsuffizienz?", modelAnswer: "Klinik (Dyspnoe, Ödeme, Rasselgeräusche), BNP/NT-proBNP, Echo (EF), Röntgen (Stauung, Erguss). Therapie: ACE-Hemmer/ARNI, Betablocker, MRA, SGLT2-Hemmer, Diuretika symptomatisch." }
        ]},
        { phaseName: "Teil 3: Hypertonie", questions: [
          { id: "i13", text: "Ist ein Blutdruck von 140/90 gut eingestellt? Wie klassifizieren Sie, und welches Ziel gilt?", modelAnswer: "140/90 = Grad-1-Hypertonie/Grenzwert, nicht optimal. Ziel < 140/90, bei Verträglichkeit ~130/80; individualisiert. Bestätigung durch wiederholte/24-h-Messung." },
          { id: "i14", text: "Nennen Sie die medikamentöse Stufentherapie der Hypertonie.", modelAnswer: "ACE-Hemmer oder Sartan + Kalziumantagonist oder Thiazid als Zweifachkombination; später Dreifach; bei Resistenz Spironolacton. Betablocker bei spezieller Indikation." },
          { id: "i15", text: "Was sind Hinweise auf eine sekundäre Hypertonie, und welche Ursachen kennen Sie?", modelAnswer: "Junges Alter, therapieresistent, plötzlicher Beginn, Hypokaliämie. Ursachen: Nierenarterienstenose, Hyperaldosteronismus (Conn), Phäochromozytom, Cushing, Schlafapnoe, Aortenisthmusstenose." },
          { id: "i16", text: "Beschreiben Sie die hypertensive Krise/den hypertensiven Notfall und die Therapie.", modelAnswer: "Notfall = stark erhöhter RR mit Endorganschaden (Enzephalopathie, Lungenödem, ACS). Kontrollierte i.v.-Senkung (z. B. Urapidil, Nitroglyzerin), nicht zu schnell (max. ~25 % in der 1. Stunde)." }
        ]},
        { phaseName: "Teil 4: Lungenembolie, TVT, Pneumonie", questions: [
          { id: "i17", text: "[Fall Dyspnoe nach langer Reise/Flug] Verdacht und wie sichern Sie die Diagnose?", modelAnswer: "Lungenembolie. Wells-Score; bei niedriger Wahrscheinlichkeit D-Dimer, bei hoher CT-Pulmonalisangiographie. EKG (S1Q3T3, RSB), Echo (Rechtsherzbelastung), BGA." },
          { id: "i18", text: "Welche Laborwerte bestimmen Sie bei Verdacht auf Lungenembolie, und was zeigt das EKG?", modelAnswer: "D-Dimere, Troponin, BNP, BGA, Nierenwerte (vor CT-Angio), TSH. EKG: Sinustachykardie, S1Q3T3, Rechtsschenkelblock, Rechtsherzbelastungszeichen." },
          { id: "i19", text: "Welche Manöver/Zeichen prüfen Sie bei Verdacht auf tiefe Venenthrombose?", modelAnswer: "Meyer- (Wadenkompressionsschmerz), Payr- (Fußsohlendruck), Homans-Zeichen (Dorsalflexion). Schwellung, Rötung, Überwärmung. Diagnostik: Wells, D-Dimer, Kompressionssonographie." },
          { id: "i20", text: "Was ist häufiger — Hirninfarkt oder Hirnblutung? Welche andere Differenzialdiagnose bei Luftnot und Husten?", modelAnswer: "Ischämischer Hirninfarkt ist häufiger (~85 %). Bei Luftnot/Husten DD: Pneumonie, LAE, Pneumothorax, Herzinsuffizienz/Lungenödem, COPD-Exazerbation." },
          { id: "i21", text: "Pneumonie: Wie klassifizieren Sie, welchen Score nutzen Sie, und wie therapieren Sie ambulant vs. stationär?", modelAnswer: "CAP vs. HAP vs. bei Immunsuppression. Schweregrad CRB-65. Ambulant ohne Risiko: Amoxicillin; stationär: Aminopenicillin/BLI oder Cephalosporin ± Makrolid. Nosokomial/Pseudomonas: Piperacillin-Tazobactam/Carbapenem." },
          { id: "i22", text: "Welche Antibiotika wählen Sie bei nosokomialer Pneumonie und gegen Pseudomonas?", modelAnswer: "Pseudomonas-wirksam: Piperacillin/Tazobactam, Ceftazidim/Cefepim, Carbapeneme (Meropenem), ggf. + Fluorchinolon/Aminoglykosid nach Risiko/Resistenzlage." }
        ]},
        { phaseName: "Teil 5: Endokrin und Diabetes", questions: [
          { id: "i23", text: "Wie behandeln Sie eine Hyperthyreose medikamentös? Was ist eine thyreotoxische Krise?", modelAnswer: "Thyreostatika (Thiamazol/Carbimazol; PTU im 1. Trimenon), Betablocker symptomatisch; definitiv Radiojod oder OP. Thyreotoxische Krise: lebensbedrohliche Entgleisung (Fieber, Tachyarrhythmie, Unruhe, Bewusstseinsstörung) → Intensiv, Thyreostatika, Betablocker, Glukokortikoide." },
          { id: "i24", text: "Welche Laborwerte und Therapie erwarten Sie bei einer Hypothyreose?", modelAnswer: "TSH erhöht, fT4 erniedrigt (primär); TPO-AK bei Hashimoto. Therapie: Levothyroxin, einschleichend bei Älteren/KHK." },
          { id: "i25", text: "Hyperglykämisches Koma / diabetische Entgleisung — Vorgehen und Therapie?", modelAnswer: "DKA vs. hyperosmolar. Volumen (NaCl), Insulin i.v., Kalium-Substitution unter Kontrolle, Ursachensuche, langsame BZ-Senkung; DKA: Ketone/Azidose behandeln." },
          { id: "i26", text: "Wie therapieren Sie einen Herpes Zoster?", modelAnswer: "Aciclovir/Valaciclovir/Brivudin früh (< 72 h), Analgesie, ggf. neuropathische Schmerztherapie; bei Immunsuppression/Zoster ophthalmicus i.v. und Fachvorstellung." }
        ]}
      ]
    },

    // -------------------------------------------------------------------------
    // FALL 9 — LABORMEDIZIN: Fragenkatalog
    // -------------------------------------------------------------------------
    {
      id: 9,
      caseTitle: "Fall 9: Labormedizin — Fragenkatalog",
      diagnosis: "Anämie, Blutbild, Gerinnung, Elektrolyte, Niere",
      initialVignette: "Sammlung labormedizinischer Fragen aus den Protokollen: Anämien, Leukozytose/Leukämie, Thrombozytopenie (HIT/DIC/ITP), Elektrolyt- und Nierenstörungen, Gerinnung und Leber-/Pankreaswerte.",
      phases: [
        { phaseName: "Teil 1: Anämie", questions: [
          { id: "l1", text: "Wie klassifizieren Sie eine Anämie, und welcher Laborwert leitet die Einteilung?", modelAnswer: "Nach MCV/MCH: mikrozytär-hypochrom (Eisenmangel, Thalassämie), normozytär-normochrom (renal, chronische Erkrankung, Blutung), makrozytär (Vit-B12-/Folsäuremangel)." },
          { id: "l2", text: "Makrozytäre hyperchrome Anämie — Ursache, Pathophysiologie und Therapie?", modelAnswer: "Vit-B12-Mangel (perniziöse Anämie): Intrinsic-Factor-Mangel bei Autoimmungastritis (Parietalzellen im Korpus/Fundus) → gestörte B12-Resorption im terminalen Ileum. Therapie: B12-Substitution (parenteral)." },
          { id: "l3", text: "Wie weisen Sie einen Intrinsic-Factor-Mangel bzw. eine perniziöse Anämie nach?", modelAnswer: "Vit-B12-Spiegel, Methylmalonsäure/Homocystein, Intrinsic-Factor- und Parietalzell-Antikörper, ggf. Gastroskopie mit Biopsie." },
          { id: "l4", text: "Renale Anämie — Laborkonstellation und Therapie?", modelAnswer: "Normozytäre, normochrome Anämie bei CNI durch Erythropoetin-Mangel; niedrige Retikulozyten. Therapie: EPO nach Ausschluss/Ausgleich von Eisenmangel (Ferritin, TSAT)." }
        ]},
        { phaseName: "Teil 2: Leukozytose, Thrombozytopenie, Gerinnung", questions: [
          { id: "l5", text: "[Blutbild] Leukozytose (stark erhöht), Anämie und Thrombozytopenie — Verdachtsdiagnose und nächste Schritte?", modelAnswer: "Verdacht auf Leukämie (Panzytopenie bei Blastenvermehrung). Nächste Schritte: Blutausstrich (Blasten) und Knochenmarkpunktion; Hämato-Onkologie." },
          { id: "l6", text: "[Postoperatives Labor] Thrombozytopenie < 29.000 — woran denken Sie, und welche Tests folgen?", modelAnswer: "HIT Typ II (heparininduziert) nach Heparingabe. 4T-Score; Tests: Anti-PF4-Heparin-Antikörper (ELISA), funktioneller Test (HIPA). Heparin stoppen, alternative Antikoagulation (Argatroban)." },
          { id: "l7", text: "Nennen Sie die wichtigsten Ursachen einer Thrombozytopenie (internistisch relevant).", modelAnswer: "HIT, DIC, ITP; ferner Sepsis, Leukämie/Knochenmarkschädigung, Splenomegalie, Medikamente, TTP/HUS, Alkohol." },
          { id: "l8", text: "[Kind mit Petechien] Differenzialdiagnose der Thrombozytopenie im Kindesalter?", modelAnswer: "ITP (häufig postinfektiös), Leukämie, Meningokokkensepsis (Waterhouse-Friderichsen), HUS, aplastische Anämie — dringende Abklärung bei Fieber/AZ-Verschlechterung." },
          { id: "l9", text: "Was ist eine DIC (Verbrauchskoagulopathie), und wie erkennen Sie sie im Labor?", modelAnswer: "Systemische Gerinnungsaktivierung mit Verbrauch. Labor: Thrombozyten ↓, Fibrinogen ↓, D-Dimere ↑, Quick ↓/INR ↑, PTT ↑. Ursache behandeln, Substitution nach Klinik." },
          { id: "l10", text: "Mit welchem DOAK beginnen Sie, und wovon hängt die Wahl ab? Was am ersten Tag?", modelAnswer: "DOAK-Wahl nach Nierenfunktion (z. B. Apixaban bei eingeschränkter GFR günstiger). Bei akuter Thrombose/LAE ggf. initial parenteral (NMH) oder DOAK mit Initialdosis (Rivaroxaban/Apixaban höher dosiert)." },
          { id: "l11", text: "Welche Gerinnungsstörungen (Thrombophilien) kennen Sie?", modelAnswer: "Faktor-V-Leiden, Prothrombinmutation, Protein-C-/S-Mangel, Antithrombinmangel, Antiphospholipid-Syndrom." }
        ]},
        { phaseName: "Teil 3: Elektrolyte und Niere", questions: [
          { id: "l12", text: "[Labor] Kalium 6,5 mmol/L und Kreatinin 5 mg/dL — was denken Sie und wie behandeln Sie die Hyperkaliämie?", modelAnswer: "Akute/chronische Niereninsuffizienz mit Hyperkaliämie. EKG (Zeltenzelte-T, QRS-Verbreiterung). Therapie: Kalziumglukonat (Membranstabilisierung), Glukose-Insulin, Betamimetika, Bikarbonat, Resonium/Diuretika, ggf. Dialyse." },
          { id: "l13", text: "Nennen Sie die KDIGO-Kriterien der akuten Nierenschädigung und Dialyse-Indikationen.", modelAnswer: "AKI: Kreatininanstieg ≥ 0,3 mg/dl in 48 h oder ≥ 1,5-fach in 7 Tagen bzw. Oligurie. Dialyse (AEIOU): Azidose, Elektrolyte (Hyperkaliämie), Intoxikation, Overload (Lungenödem), Urämie." },
          { id: "l14", text: "[Labor nach Thyreoidektomie] Hypokalzämie mit niedrigem PTH — Ursache und Therapie?", modelAnswer: "Postoperativer Hypoparathyreoidismus (Nebenschilddrüsen geschädigt/entfernt). Klinik: Parästhesien, Chvostek/Trousseau, Tetanie. Therapie: Kalzium + aktives Vitamin D (Calcitriol)." },
          { id: "l15", text: "Welche Laborkonstellation spricht für ein multiples Myelom, und wie klären Sie ab?", modelAnswer: "Anämie, Hyperkalzämie, Niereninsuffizienz, hohe BSG, Paraprotein. Abklärung: Serum-/Urin-Eiweißelektrophorese, freie Leichtketten, Knochenmark, Bildgebung (Osteolysen)." }
        ]},
        { phaseName: "Teil 4: Leber-, Pankreas- und Entzündungswerte", questions: [
          { id: "l16", text: "Welche Leberwerte bestimmen Sie, und was bedeutet ein erhöhter De-Ritis-Quotient (AST/ALT)?", modelAnswer: "ALT, AST, GGT, AP, Bilirubin, Albumin, INR. De-Ritis (AST/ALT) > 1 spricht für schweren/alkoholischen Leberschaden bzw. Zirrhose; < 1 eher leichte hepatozelluläre Schädigung." },
          { id: "l17", text: "Welche Laborwerte sichern eine Pankreatitis, und was ist unspezifisch?", modelAnswer: "Lipase > 3-fach (spezifisch); Amylase unspezifisch. Zusätzlich CRP/Leukozyten, Kalzium, Harnstoff, LDH (Prognose)." },
          { id: "l18", text: "Was ist Procalcitonin, und wann bestimmen Sie es?", modelAnswer: "Marker für bakterielle Infektion/Sepsis; zur Einschätzung der Schwere und Steuerung/Deeskalation der Antibiotikatherapie." },
          { id: "l19", text: "[Kind, Fieber, Nackensteifigkeit, Petechien] Verdachtsdiagnose, Diagnostik und Meldepflicht?", modelAnswer: "Meningokokken-Meningitis/-Sepsis. Blutkulturen, Liquorpunktion (nach Ausschluss Hirndruck), sofort Antibiose (Ceftriaxon). Isolierung, Meldung ans Gesundheitsamt (IfSG/RKI), Postexpositionsprophylaxe für Kontaktpersonen." }
        ]}
      ]
    },

    // -------------------------------------------------------------------------
    // FALL 10 — NOTFALL & PHARMAKOTHERAPIE: Fragenkatalog
    // -------------------------------------------------------------------------
    {
      id: 10,
      caseTitle: "Fall 10: Notfall & Pharmakotherapie — Fragenkatalog",
      diagnosis: "Analgesie, Antibiotika, Notfälle, Aufklärung",
      initialVignette: "Sammlung von Notfall- und Pharmafragen aus den Protokollen: Analgesie (WHO-Schema), Antibiotikawahl, Reanimation, gynäkologische Notfälle und Aufklärung.",
      phases: [
        { phaseName: "Teil 1: Analgesie und Pharmakotherapie", questions: [
          { id: "n1", text: "Nennen Sie das WHO-Stufenschema der Schmerztherapie.", modelAnswer: "Stufe 1: Nichtopioide (Metamizol, Paracetamol, NSAR). Stufe 2: schwache Opioide (Tramadol, Tilidin). Stufe 3: starke Opioide (Morphin, Oxycodon), jeweils + Koanalgetika/Adjuvanzien." },
          { id: "n2", text: "Wie dosieren und applizieren Sie Metamizol, und welche Nebenwirkung fürchten Sie?", modelAnswer: "500–1000 mg bis 4×/Tag p.o. oder i.v. (langsam als Kurzinfusion). Cave: Agranulozytose, Blutdruckabfall bei zu schneller i.v.-Gabe." },
          { id: "n3", text: "Warum geben Sie bei kolikartigem/abdominellem Schmerz eher Metamizol als Butylscopolamin (Buscopan)?", modelAnswer: "Metamizol wirkt analgetisch und leicht spasmolytisch; Butylscopolamin ist rein spasmolytisch, analgetisch unterlegen und anticholinerg kontraindiziert (Ileus, Glaukom, Tachyarrhythmie)." },
          { id: "n4", text: "Worauf achten Sie bei NSAR, und welche Begleitmedikation geben Sie?", modelAnswer: "Cave Ulkus/GI-Blutung, Niereninsuffizienz, kardiovaskuläres Risiko. Magenschutz mit PPI, besonders bei Risikopatienten." },
          { id: "n5", text: "Welche wichtigen Nebenwirkungen von Opioiden überwachen Sie?", modelAnswer: "Atemdepression, Sedierung, Obstipation (immer Laxans), Übelkeit/Erbrechen (initial emetisch), Harnverhalt, Miosis, Toleranz/Abhängigkeit." }
        ]},
        { phaseName: "Teil 2: Antibiotikatherapie", questions: [
          { id: "n6", text: "Welche kalkulierte Antibiose wählen Sie bei komplizierter Divertikulitis?", modelAnswer: "Gramnegativ + Anaerobier: Ciprofloxacin + Metronidazol oder Amoxicillin/Clavulansäure bzw. Piperacillin/Tazobactam." },
          { id: "n7", text: "Welche Antibiotika bei komplizierter Pyelonephritis, und welcher Erreger ist am häufigsten?", modelAnswer: "Ceftriaxon oder Ciprofloxacin i.v., Anpassung nach Antibiogramm. Häufigster Erreger E. coli (gramnegativ)." },
          { id: "n8", text: "Wann beginnen Sie mit der Antibiotikagabe, und was tun Sie vorher?", modelAnswer: "Nach Abnahme von Kulturen (Blutkultur, Urinkultur) — möglichst vor der ersten Gabe; bei Sepsis unverzüglich (Tarragona-Prinzip: früh, breit, deeskalieren)." },
          { id: "n9", text: "Welche Antibiose bei Cholangitis?", modelAnswer: "Breitspektrum gegen gramnegative Enterobakterien und Anaerobier (z. B. Piperacillin/Tazobactam oder Cephalosporin + Metronidazol) plus Gallengangsentlastung (ERCP)." }
        ]},
        { phaseName: "Teil 3: Notfälle und gynäkologische DD", questions: [
          { id: "n10", text: "[Junge Frau mit akuten Unterbauchschmerzen] Wie gehen Sie vor, welche DD, und würden Sie ein CT machen?", modelAnswer: "Immer Schwangerschaft ausschließen (Beta-HCG). DD: Appendizitis, Extrauteringravidität, Adnexitis, Ovarialtorsion/-zyste, HWI. Sonographie/Transvaginalsono; CT bei Schwangeren vermeiden (nur vitale Indikation)." },
          { id: "n11", text: "Warum ist ein Cauda-/Konus-Syndrom ein Notfall (N. pudendus)?", modelAnswer: "Kompression der Cauda equina → drohend irreversible Blasen-/Mastdarmlähmung, Reithosenanästhesie. Notfall-Dekompression innerhalb 24–48 h." },
          { id: "n12", text: "[Kind, Kontrastmittel/Strahlung] Welche Strahlendosis ist relevant, und ab wann besorgt?", modelAnswer: "Dosis in mSv angeben; diagnostische Röntgen-Dosen liegen meist deutlich unter Schwellen für deterministische Schäden. ALARA-Prinzip, strahlenfreie Alternativen bevorzugen." },
          { id: "n13", text: "Wie klären Sie präoperativ über eine laparoskopische Operation auf (z. B. Appendektomie/Cholezystektomie)?", modelAnswer: "Aufklärung über Diagnose, Ablauf, Alternativen und Risiken: Blutung, Infektion, Organ-/Gefäßverletzung, Konversion zur offenen OP, Thrombose, Narkoserisiko; rechtzeitig, verständlich, dokumentiert, mit Einwilligung." },
          { id: "n14", text: "Therapie der Aortendissektion Stanford B?", modelAnswer: "Meist konservativ: strikte Blutdruck-/Frequenzsenkung (Betablocker, z. B. Esmolol/Labetalol, + Vasodilatator), Analgesie, Monitoring; OP/Stent (TEVAR) bei Komplikationen (Malperfusion, Ruptur, Progредienz)." }
        ]}
      ]
    }
  ];

  for (var i = 0; i < bank.length; i++) caseSeries.push(bank[i]);
})();
