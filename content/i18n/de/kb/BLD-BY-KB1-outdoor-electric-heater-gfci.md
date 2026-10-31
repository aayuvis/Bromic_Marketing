---
id: BLD-BY-KB1
type: kb
title: "Brauchen elektrische Heizstrahler im Außenbereich einen FI-Schutzschalter?"
audience: [BLD]
stage: [BY]
cell: BLD-BY
asset: A17
summary: "Warum der Fehlerstromschutz (RCD, FI-Schutzschalter) für Außenstromkreise in Deutschland eine Frage der DIN VDE 0100 und des Elektrofachbetriebs ist, was die US-Regel NEC 210.8(F) zum Vergleich sagt und warum ein fest angeschlossener Heizstrahler vor der Vorverkabelung geklärt werden sollte."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Brauchen elektrische Heizstrahler im Außenbereich einen FI-Schutzschalter?"
meta_description: "Fehlerstromschutz für elektrische Terrassenheizstrahler: was in Deutschland nach DIN VDE 0100 zu klären ist, und was die US-Regel NEC 210.8(F) zum Vergleich verlangt."
cta: {label: "Die Installationsleitfäden herunterladen", asset: A17}
hero: l-010-066
owner_review: Arvin Avaness
status: draft
gated: false
related: [BLD-BY-01, BLD-IN-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Eaton
    title: "NEC 2023 updates: GFCI 210.8(F) outdoor outlets"
    year: 2023
    url: https://www.eaton.com/us/en-us/markets/residential/nec-2023-updates/gfci-210-8f-outdoor-outlets.html
    supports: "2023 NEC 210.8(F): GFCI for dwelling outdoor outlets, single-phase, 150 V or less to ground, 50 A or less; replaced equipment on such an outlet must get GFCI"
    verified: true
  - id: s2
    publisher: Minnesota Department of Labor and Industry
    title: "2026 NEC change summary"
    year: 2026
    url: https://dli.mn.gov/sites/default/files/pdf/boe-011526-change-summary.pdf
    supports: "2026 NEC raises 210.8(F) threshold from 50 A to 60 A"
    verified: true
  - id: s3
    publisher: UL Solutions
    title: "Coordination between model codes and standards (2026 NEC)"
    year: 2025
    url: https://www.ul.com/thecodeauthority/knowledge/coordination-between-model-codes-standards09
    supports: "2026 NFPA 70 issued Aug. 20, 2025; adoption varies by jurisdiction"
    verified: true
  - id: s4
    publisher: Bromic Heating
    title: "Lookbook 2026"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Affinity Smart-Heat controllers and manual wall switch; Wi-Fi/app need compatible Affinity controls, sold separately"
    verified: true
lang: de
translation_of: BLD-BY-KB1
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Raffaele Marti]]"
---
In der Regel ja. In Deutschland sind Außenstromkreise nach DIN VDE 0100 zu errichten, und ein Fehlerstromschutzschalter (RCD, umgangssprachlich FI-Schutzschalter) ist für viele Stromkreise im Außenbereich vorgesehen [[VERIFY: welche Teile der DIN VDE 0100 (z. B. 0100-410, 0100-737) einen RCD für fest angeschlossene Heizstrahler im Außenbereich verlangen, mit Bemessungsfehlerstrom — Raffaele Marti]]. Ob ein fest angeschlossener Heizstrahler darunter fällt, entscheidet der Elektrofachbetrieb anhand der aktuellen Norm und der Installationsanleitung. Klären Sie das vor der Vorverkabelung.

Zum Vergleich die Regel in den USA, auf die sich die US-Ausgabe dieses Artikels stützt: Der National Electrical Code (NEC) verlangt dort einen Fehlerstromschutz (GFCI) für Außenanschlüsse an Wohngebäuden bei einphasigen Stromkreisen mit höchstens 150 V gegen Erde, in der Ausgabe 2023 bis 50 A[^s1] und in der Ausgabe 2026 bis 60 A[^s2].

*Stimmen Sie die Installation mit Ihrem örtlichen Bauamt, einem Elektrofachbetrieb und der Installationsanleitung des Produkts ab.* [[VERIFY: aktuelle VDE- und DVGW-Regeln für Heizstrahler im Außenbereich — Raffaele Marti]]

## Was regelt die US-Vorschrift?

| Ausgabe (USA) | Geltungsbereich von 210.8(F) an Wohngebäuden | US-Heizstrahlerstromkreis (240 V, 120 V gegen Erde) |
|---|---|---|
| NEC 2023 | Außenanschlüsse, einphasig, ≤ 150 V gegen Erde, ≤ 50 A[^s1] | Erfasst bis zu einem 50-A-Stromkreis |
| NEC 2026 | Wie oben, Grenze auf ≤ 60 A angehoben[^s2] | Erfasst bis zu einem 60-A-Stromkreis |

Die Ausgabe 2026 erschien im August 2025, doch jeder US-Bundesstaat und jede Stadt übernimmt die Ausgaben nach eigenem Zeitplan[^s3]. Für Deutschland gilt dieser Zeitplan nicht: Maßgeblich ist die zum Zeitpunkt der Errichtung gültige Fassung der DIN VDE 0100. Im deutschen Netz mit 230 V, 50 Hz liegt ein einphasiger Heizstrahlerstromkreis bei 230 V gegen Erde.

## Warum ist ein fest angeschlossener Heizstrahler eine Grauzone?

Die US-Regel spricht von „Anschlüssen“ (outlets). Manche US-Behörden werten einen festen Anschlusspunkt als solchen, andere nicht. In Deutschland stellt sich die Frage anders, weil die DIN VDE 0100 nach Art des Stromkreises und des Betriebsmittels unterscheidet. Planen Sie einen Fehlerstromschutz ein, solange der Elektrofachbetrieb nicht schriftlich etwas anderes festlegt. Prüfen Sie dann die Installationsanleitung, die eigene Anforderungen stellen kann [[VERIFY: Anforderung an GFCI/RCD in der Bromic-Installationsanleitung — Mike Clifford]].

## Wie wird der Fehlerstromschutz bei einem Heizstrahlerstromkreis umgesetzt?

Üblicherweise mit einem Fehlerstromschutzschalter oder einem FI/LS-Schalter im Verteiler, bemessen nach den Anforderungen des Stromkreises und der DIN VDE 0100. Setzen Sie ihn vor das Affinity Smart-Heat Steuergerät und den Wandschalter[^s4], wie es der Schaltplan zeigt.

## Was sollte der Elektrofachbetrieb bei der Inbetriebnahme prüfen?

- Fehlerstromschutz dort eingebaut, wo er gefordert ist; mit der Prüftaste ausgelöst und geprüft.
- Löst der Fehlerstromschutz wiederholt aus: Stromkreis freischalten, Verbindungen und Dichtungen prüfen, bevor er wieder eingeschaltet wird; nie durch einen Schutzschalter ohne Fehlerstromschutz ersetzen.
- Angewandte Normfassung und die Festlegung des Elektrofachbetriebs im Prüfprotokoll vermerken.

[^s1]: Eaton, NEC 2023 210.8(F), Außenanschlüsse (USA).
[^s2]: Minnesota DLI, Zusammenfassung der Änderungen im NEC 2026 (USA).
[^s3]: UL Solutions, Veröffentlichung und Übernahme des NEC 2026 (USA).
[^s4]: Bromic, Lookbook 2026.
