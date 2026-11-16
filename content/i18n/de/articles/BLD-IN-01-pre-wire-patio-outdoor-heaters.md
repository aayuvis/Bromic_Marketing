---
id: BLD-IN-01
type: article
title: "Terrassenheizstrahler vorverkabeln: die Checkliste zur Rohinstallation für Bauträger"
audience: [BLD]
stage: [IN]
cell: BLD-IN
asset: A24
summary: "Was vor dem Schließen der Untersicht vorbereitet werden muss: ein eigener Stromkreis je Heizstrahler, die Stromrechnung bei 230 V, die Bemessung als Dauerlast, Fragen zum Fehlerstromschutz, Dosen und Unterkonstruktion sowie ein Weg für die Steuerung."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Welche Verkabelung sollte ich für Terrassenheizstrahler in der Rohinstallation vorsehen?"
meta_description: "Terrassenheizstrahler richtig vorverkabeln: ein eigener Stromkreis je Gerät, Dosen und Unterkonstruktion, ein Ort für die Steuerung, Strom bei 230 V."
cta: {label: "Den Leitfaden zur Vorverkabelung herunterladen", asset: A16}
hero: g-rough-in
images: [l-005-022]
owner_review: Fachhandelsvertrieb
status: draft
gated: false
related: [BLD-IN-KB1, BLD-IN-KB2, BLD-BY-01, BLD-CO-01]
updated: 2026-11-16
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Platinum Smart-Heat Electric 2300/3400/4500 W; recessed, ceiling or wall mount; Affinity Smart-Heat Controls; Wi-Fi/app need compatible Affinity controls, sold separately"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "The Official Outdoor Heating Planning Guide, US v1.2"
    year: 2021
    url: sources/Bromic_Planning_Guide_US_v1.2_2021.pdf
    supports: "Electric heaters follow ANSI/NFPA 70; wall mounts at least 72 in. above floor, ceiling mounts at least 96 in. (varies with output); recess kits for flush mounting; commercial voltages 208/240/277 V; check with local building authority"
    verified: true
  - id: s3
    publisher: EC&M
    title: "Don't get burned by the NEC's space-heating equipment rules"
    year: 2020
    url: https://www.ecmweb.com/national-electrical-code/code-basics/article/20901105/dont-get-burned-by-the-necs-space-heating-equipment-rules
    supports: "Branch-circuit conductors and overcurrent devices for fixed electric space-heating equipment sized at not less than 125% of the total heating load (NEC Article 424 with 210.19(A)(1) and 210.20(A))"
    verified: true
  - id: s4
    publisher: EC&M
    title: "Understanding requirements for appliances (NEC Article 422)"
    year: 2020
    url: https://www.ecmweb.com/code-basics/understanding-requirements-appliances
    supports: "Branch circuit for a continuous-load appliance rated not less than 125% of marked ampere rating (100% where the assembly is listed for it); OCPD not to exceed the rating marked on the appliance (422.11(A)); continuous load = maximum current expected for 3 hours or more"
    verified: true
  - id: s5
    publisher: Eaton
    title: "NEC 2023 updates: GFCI 210.8(F) outdoor outlets"
    year: 2023
    url: https://www.eaton.com/us/en-us/markets/residential/nec-2023-updates/gfci-210-8f-outdoor-outlets.html
    supports: "2023 NEC 210.8(F): GFCI for dwelling outdoor outlets, single-phase, 150 V or less to ground, 50 A or less"
    verified: true
  - id: s6
    publisher: Minnesota Department of Labor and Industry
    title: "2026 NEC change summary"
    year: 2026
    url: https://dli.mn.gov/sites/default/files/pdf/boe-011526-change-summary.pdf
    supports: "2026 NEC raises the 210.8(F) outdoor-outlet threshold from 50 A to 60 A"
    verified: true
  - id: s7
    publisher: UL Solutions
    title: "Coordination between model codes and standards (2026 NEC)"
    year: 2025
    url: https://www.ul.com/thecodeauthority/knowledge/coordination-between-model-codes-standards09
    supports: "2026 NFPA 70 issued Aug. 20, 2025, effective Sept. 9, 2025; adoption varies by jurisdiction"
    verified: true
  - id: s8
    publisher: National Fire Protection Association
    title: "NFPA 70, National Electrical Code (free online access)"
    year: 2025
    url: https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70
    supports: "Primary code text: Articles 100, 210, 240, 422, 424"
    verified: false
lang: de
translation_of: BLD-IN-01
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Partner Deutschland]]"
---

Ziehen Sie in der Rohinstallation zu jeder Heizstrahler-Position einen eigenen Stromkreis, bemessen nach dem Typenschild des Heizstrahlers und als Dauerlast, dazu eine Dose und eine tragfähige Unterkonstruktion an jeder Position und eine Dose am Ort des Steuergeräts. All das kommt vor Trockenbau, Untersicht oder Deckenverkleidung, sodass Stromkreis, Dose, Unterkonstruktion und Bedienpunkt einmal entschieden werden und die fertige Decke später nie geöffnet werden muss.

*Dies ist eine Planungshilfe, keine Rechtsberatung. Vorschriften unterscheiden sich je nach Ort und Ausgabe. Klären Sie jede Anforderung mit dem örtlichen Bauamt und einem eingetragenen Elektrofachbetrieb (DIN VDE 0100) und befolgen Sie die Installationsanleitung des Produkts. [[VERIFY: aktuelle VDE-Regeln für Heizstrahler im Freien — Partner Deutschland]]*

![Minimalistischer Glaspavillon mit nahtlos in die Decke eingelassenen Heizstrahlern](img:l-010-075)

## Warum die Rohinstallation der Moment für Wärme ist

Wärme, über die erst nach dem Rohbau entschieden wird, wird zur Nachrüstung. Einen Stromkreis durch eine fertige Untersicht zu ziehen, heißt schneiden, spachteln und neu streichen, und die Reklamation landet beim Bauträger – in der Rohinstallation dagegen ist es schlicht eine weitere Leitung in der Verteilerliste.

Verkabeln Sie jede überdachte Terrasse vor, auf der Wärme verkauft werden könnte, auch wenn der Käufer sie noch nicht gewählt hat, und verschließen und beschriften Sie ungenutzte Positionen.

## Die Spannung und der Stromkreis, die jeder Heizstrahler braucht

Platinum Smart-Heat® Electric gibt es mit 2300, 3400 und 4500 W[^s1]. In Deutschland beträgt die Netzspannung 230 V, 50 Hz; Bromic nennt für gewerbliche US-Standorte Anschlüsse mit 208, 240 und 277 V[^s2]. Prüfen Sie die Spannung des genau bestellten Modells, bevor Sie Leitungen ziehen [[VERIFY: Versorgungsspannung je Platinum und Tungsten Electric Modell für Deutschland, Wohn- und Gewerbebau — Produktteam]].

Der Strom ist Leistung geteilt durch Spannung, **I = W ÷ V**. Behandeln Sie einen Heizstrahler im Freien als Dauerlast. Der US-amerikanische NEC definiert eine Dauerlast als Last, bei der der maximale Strom drei Stunden oder länger erwartet wird[^s4], und Stromkreise für Dauerlasten und fest installierte Raumheizungen werden dort mit mindestens 125 % der Last bemessen[^s3][^s4]. In Deutschland legt der Elektrofachbetrieb Leitungsschutzschalter, Leitungsquerschnitt und Verlegeart nach DIN VDE 0100 fest.

| Heizstrahler | Spannung | Strom (W ÷ V) |
|---|---|---|
| 2300 W | 230 V | 10,0 A |
| 3400 W | 230 V | 14,8 A |
| 4500 W | 230 V | 19,6 A |

Absicherung und Querschnitt übernehmen Sie nicht aus US-Tabellen; sie richten sich nach DIN VDE 0100, der Leitungslänge, der Verlegeart und dem Spannungsfall. Dieselbe Rechnung zeigt zwei Punkte, auf die es sich zu achten lohnt:

- **Ein Heizstrahler an einer niedrigeren Spannung als seiner Nennspannung** liefert weniger Leistung, im Verhältnis zum Quadrat der Spannungen. Ein 240-V-Heizstrahler an 208 V (in den USA im Mehrfamilienbau üblich) erreicht (208 ÷ 240)², also rund 75 % seiner Nennleistung; aus 4500 W werden rund 3.380 W. Bestellen Sie das Modell passend zur Netzspannung.
- **Das Schutzorgan darf das auf dem Typenschild angegebene Maximum nicht überschreiten**[^s4]. Der Elektrofachbetrieb prüft Strombelastbarkeit, Klemmen, Spannungsfall und Leerrohrfüllung. Zum Vergleich: Den US-Text des NEC stellt die NFPA kostenlos online bereit[^s8].

## Einen Stromkreis teilen

Heizstrahler können sich in Grenzen einen Stromkreis teilen, doch ein Heizstrahler je Stromkreis ist einfacher in Zonen aufzuteilen und bei Störungen leichter zu prüfen. Siehe [wie viele Heizstrahler an einen Stromkreis passen](item:BLD-IN-KB2).

## Fehlerstromschutz für Stromkreise von Terrassenheizstrahlern

Planen Sie ihn ein und klären Sie das früh. In Deutschland legt die DIN VDE 0100 fest, welche Stromkreise im Freien eine Fehlerstrom-Schutzeinrichtung (RCD) brauchen; der Elektrofachbetrieb bestätigt das für Ihr Projekt [[VERIFY: Anforderungen an den Fehlerstromschutz für fest angeschlossene Heizstrahler im Freien nach DIN VDE 0100 — Partner Deutschland]]. Zum Vergleich die US-Regeln: Der NEC 2023 verlangt einen Fehlerstromschutz (GFCI) für Außenanschlüsse an Wohngebäuden bei einphasigen Stromkreisen mit höchstens 150 V gegen Erde und höchstens 50 A[^s5], und die Ausgabe 2026 hebt diese Grenze auf 60 A an[^s6]. Ob ein fest angeschlossener Heizstrahler dort als „Anschluss“ nach 210.8(F) gilt, legen US-Behörden unterschiedlich aus, und die Ausgaben werden zu unterschiedlichen Zeitpunkten eingeführt[^s7]. Lassen Sie sich die Antwort schriftlich geben und prüfen Sie, was die Installationsanleitung vorgibt [[VERIFY: Anforderung an GFCI- bzw. RCD-Schutz in der Bromic-Installationsanleitung — Produktteam]]. Mehr dazu in [der Antwort zum Fehlerstromschutz](item:BLD-BY-KB1).

## Was an jede Heizstrahler-Position gehört

| Element | Maßnahme in der Rohinstallation |
|---|---|
| Dose | Witterungsbeständige Abzweigdose an jeder Heizstrahler-Position, an der in der Anleitung angegebenen Stelle relativ zur Halterung [[VERIFY: Dosentyp und Versatz je Montageart — Produktteam]] |
| Unterkonstruktion | Tragfähige Auswechslung zwischen Balken oder Ständern, die Halterung und Gewicht des Heizstrahlers trägt [[VERIFY: Gewichte der Heizstrahler je Modell — Produktteam]] |
| Höhe | Wandmontage mindestens 1,83 m über dem Boden; Deckenmontage mindestens 2,44 m, je nach Leistung abweichend[^s2] |
| Abstände | Abstände zu Wänden, Balken und brennbaren Materialien laut Anleitung markieren [[VERIFY: Abstandstabelle je Modell — Produktteam]] |
| Einbaurahmen | Öffnung und Hohlraumtiefe für den Einbaurahmen vor dem Beplanken herstellen [[VERIFY: Rohbauöffnung und Hohlraumtiefe des Einbaurahmens je Modell — Produktteam]] |

![Heizstrahler bündig in eine weiße Decke eingelassen (Tungsten Coastal, demnächst erhältlich)](img:l-005-022)

Mit Einbaurahmen sitzen Platinum und Tungsten Electric Heizstrahler bündig im Deckenhohlraum[^s2], für ein klares, nahtloses Finish. Weil der Rahmen die Unterkonstruktion bestimmt, muss er schon im Rohbau gewählt werden, lange vor dem Ausbau.

## Die Steuerung dorthin, wo die Familie sie nutzt

Setzen Sie das Steuergerät dorthin, wo die Familie steht, wenn sie Wärme möchte, meist innen neben der Terrassentür. Jeder Bromic-Heizstrahler wird mit seiner Steuerung kombiniert, einem Affinity Smart-Heat® On/Off- oder Dimmer-Steuergerät (dem Eclipse Steuergerät für Eclipse Heizstrahler) und einem manuellen Wandschalter[^s1].

In der Rohinstallation:

- Setzen Sie am Ort des Steuergeräts eine tiefe Dose, passend für das Affinity Steuergerät [[VERIFY: Dosengröße für das Affinity Steuergerät und ob es in den Netzspannungsstromkreis eingeschleift wird — Produktteam]].
- Führen Sie jeden Heizstrahler-Stromkreis über diesen Ort oder so, wie es der Schaltplan der Anleitung zeigt.
- Lassen Sie einen Weg frei, etwa ein leeres Leerrohr mit Zugdraht, zum Standort von Medien- oder Haustechnik, falls eine Smart-Home-Steuerung verkauft wird.

App, Zeitpläne und Sprachsteuerung erfordern kompatible Affinity Smart-Heat Steuerungen, die separat erhältlich sind, und die Integration in Control4, Crestron und Lutron kann zusätzliche Hardware oder Konfiguration erfordern[^s1].

## Jede Position dokumentieren

Fotografieren Sie jede Position, bevor sie verschlossen wird, mit Dose, Unterkonstruktion, Leitungsbeschriftung und einem Maßband, das die Höhe zeigt. Legen Sie die Fotos zur Verteilerliste, damit der Monteur jede Dose beim ersten Mal findet.

## Ihre Checkliste zur Rohinstallation

- Modell, Leistung und Spannung des Heizstrahlers vor der Rohinstallation bestätigt.
- Ein eigener Stromkreis je Heizstrahler; Schutzorgan und Leitung nach DIN VDE 0100 bemessen und innerhalb des Typenschild-Maximums.
- Fehlerstromschutz mit dem Elektrofachbetrieb abgestimmt.
- Dose und Unterkonstruktion an jeder Position; Höhen mindestens 1,83 m (Wand) und 2,44 m (Decke).
- Öffnungen für Einbaurahmen dort hergestellt, wo bündige Heizstrahler verkauft werden könnten.
- Dose für das Steuergerät neben der Tür; Leerrohr zum Standort der Haustechnik.
- Ungenutzte Positionen verschlossen und beschriftet.
- Fotos jeder Position mit Maßen in der Bauakte.

## FAQ

### Welche Verkabelung brauchen Terrassenheizstrahler?
Einen eigenen Stromkreis je Heizstrahler mit seiner Nennspannung, als Dauerlast bemessen, der in einer Dose an der Heizstrahler-Position endet, mit einem Bedienpunkt im Stromkreis. Klären Sie die Details mit einem eingetragenen Elektrofachbetrieb.

### Wie groß muss der Stromkreis für einen 4500-W-Heizstrahler bei 230 V sein?
Er nimmt 19,6 A auf. Absicherung und Querschnitt legt der Elektrofachbetrieb nach DIN VDE 0100 fest, innerhalb des auf dem Typenschild angegebenen Maximums. Zum Vergleich: In den USA ergibt die 125-%-Regel bei 240 V (18,75 A) 23,4 A. Siehe [Absicherung für einen 4500-W-Heizstrahler](item:BLD-IN-KB1).

### Kann ich einen Heizstrahler an einer niedrigeren Spannung betreiben?
Nicht bei diesen Leistungen. Die Leistung fällt mit dem Quadrat der Spannung, deshalb bestellen Sie das Modell, das zu Ihrer Netzspannung passt.

### Sollte ich vorverkabeln, wenn der Käufer keine Wärme gewählt hat?
Ja. Ein verschlossener, beschrifteter Stromkreis kostet in der Rohinstallation wenig und erspart später das Öffnen einer fertigen Untersicht.

### Brauche ich einen Fehlerstromschutz?
Planen Sie ihn ein. Was DIN VDE 0100 für Ihr Projekt verlangt, bestätigt der Elektrofachbetrieb vor der Rohinstallation.

Bevor die nächste Bodenplatte gegossen wird, laden Sie den Leitfaden zur Vorverkabelung herunter.

[^s1]: Bromic, Lookbook 2026.
[^s2]: Bromic, Outdoor Heating Planning Guide US v1.2, 2021.
[^s3]: EC&M, NEC-Regeln für Raumheizgeräte.
[^s4]: EC&M, NEC-Anforderungen an Geräte (Artikel 422; Definition der Dauerlast in Artikel 100).
[^s5]: Eaton, NEC 2023, 210.8(F) Außenanschlüsse.
[^s6]: Minnesota DLI, Zusammenfassung der Änderungen im NEC 2026.
[^s7]: UL Solutions, Veröffentlichung und Einführung des NEC 2026.
[^s8]: NFPA, NFPA 70 National Electrical Code.
