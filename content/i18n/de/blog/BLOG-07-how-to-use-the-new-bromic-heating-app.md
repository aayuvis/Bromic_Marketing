---
id: BLOG-07
type: blog
title: "So nutzen Sie die Bromic-Heizungs-App mit der Affinity Smart-Heat-Steuerung"
action: rewrite
audience: [RES, BLD]
stage: [BY]
cell: RES-BY
asset: A24
summary: "Die Bromic Smart-Heat App Schritt für Schritt einrichten: was Sie brauchen, ein Affinity-Steuergerät koppeln, Heizstrahler, Zonen, Szenen, Benutzer und Sprachsteuerung – und was die App nicht kann."
primary_keyword: "[[VERIFY: local keyword research — 454 Creative]]"
secondary_keywords: []
ai_prompt: "Wie richte ich die Bromic-Heizungs-App ein und wie nutze ich sie?"
meta_description: "Die Bromic Smart-Heat App einrichten: Affinity-Steuergerät koppeln, Heizstrahler benennen, Zonen und Szenen anlegen, Benutzer einladen, Alexa oder Google Home hinzufügen."
cta: {label: "Den Smart-Heat-Einrichtungsleitfaden öffnen", asset: A09}
hero: w-eclipse-electric-w-bromic-heating-app
images: [w-affinity-onoff]
owner_review: Megan Spies
technical_reviewer: Mike Clifford
last_reviewed: 2026-10-29
status: draft
gated: false
related: [RES-BY-01, RES-PP-01, COM-BY-01]
updated: 2026-10-29
lang: de
translation_of: BLOG-07
translation_status: machine-draft
native_reviewer: "[[VERIFY: native reviewer — Raffaele Marti]]"
sources:
  - id: s1
    publisher: Bromic Heating
    title: "How to Use the New Bromic Heating App (live post, Sept 2024)"
    year: 2024
    url: https://www.bromic.com/blog/how-to-use-the-new-bromic-heating-app/
    supports: "Setup steps: licensed electrician installs first; serial number on the control box; Bluetooth on, internet access; account, site, controller discovery within 30 ft; channel configuration; Wi-Fi or Ethernet for stable control; Admin and User roles; 0–100% slider; zones; scenes on a 7-day schedule; not compatible with legacy remote controllers"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "Bromic heating app page (FAQ)"
    year: 2026
    url: https://www.bromic.com/affinity-smart-heat-app/
    supports: "Not backward compatible; Apple Home not supported; Google Home and Alexa supported; default 4-hour timer-off (2, 4, 6, 8, 12 h or off); fallback to Bluetooth when Wi-Fi drops; unlimited heaters and sites; voice control not available on Bluetooth or BMS; BMS disables the app; wall switches for no-app installs"
    verified: true
  - id: s3
    publisher: Bromic Heating
    title: "Bromic Control System (Affinity range overview and FAQ)"
    year: 2026
    url: https://www.bromic.com/controls/
    supports: "Affinity controls are app-based only and ship without a physical remote; Alexa and Google Home compatible; 2.4 GHz Wi-Fi, Bluetooth within 30 ft"
    verified: true
  - id: s4
    publisher: Bromic Heating
    title: "Affinity Smart-Heat On/Off, Dimmer and Eclipse controller pages"
    year: 2026
    url: https://www.bromic.com/product/affinity-smart-heat-on-off-controllers/
    supports: "Channels 1, 2, 5 (Eclipse 1, 5); 2.4 GHz Wi-Fi only; schedule-based timer-off works only on Wi-Fi-connected appliances; 14-digit serial number on the label and in the app under Site configuration"
    verified: true
  - id: s5
    publisher: Apple App Store
    title: "Bromic Smart-Heat"
    year: 2026
    url: https://apps.apple.com/us/app/bromic-smart-heat/id6457416824
    supports: "App store listing name; linked from bromic.com"
    verified: false
---

Die Bromic-Heizungs-App, in den Stores als Bromic Smart-Heat geführt, steuert Bromic-Heizstrahler vom Smartphone aus, sobald kompatible Affinity Smart-Heat-Steuerungen installiert sind.[^s1] Sie koppeln das Steuergerät per Bluetooth aus höchstens ca. 9 m Entfernung, bringen es ins WLAN oder ans Ethernet, benennen dann die Heizstrahler, fassen sie zu Zonen zusammen und legen Szenen mit einem Wochenplan an. Affinity-Steuerungen sind separat erhältlich, und die App funktioniert nicht mit älteren Bromic-Fernbedienungen.[^s1][^s2]

![Bromic-App auf einem Smartphone neben einem Eclipse-Heizstrahler](img:w-eclipse-electric-w-bromic-heating-app)

## Was brauche ich, bevor ich beginne?

| Sie brauchen | Warum |
|---|---|
| Heizstrahler und ein Affinity-Steuergerät, installiert von einem eingetragenen Elektrofachbetrieb | Die App spricht mit dem Steuergerät, nicht mit dem Heizstrahler[^s1] |
| Ein Affinity On/Off-, Dimmer- oder Eclipse-Steuergerät | On/Off für Gas oder Elektro; Dimmer für Platinum und Tungsten Electric; Eclipse für Wärme und Licht von Eclipse Electric[^s3] |
| Die Seriennummer des Steuergeräts | Ein 14-stelliger Code auf dem Etikett des Steuerkastens[^s4] |
| Smartphone oder Tablet mit eingeschaltetem Bluetooth und Internetzugang | Die Einrichtung beginnt über Bluetooth[^s1] |
| Ein WLAN im 2,4-GHz-Band oder Ethernet | Fernsteuerung, Zeitpläne und Sprachsteuerung brauchen eine Netzwerkverbindung[^s2][^s4] |
| Eine E-Mail-Adresse für den Eigentümer des Standorts | Daran hängen das Konto und die Admin-Rolle[^s1] |

Ein manueller Wandschalter ist für sich eine vollständige Steuerung, verbindet sich aber nicht mit der App.[^s2]

## Wie richte ich die App ein?

1. **Installieren Sie die App** aus dem App Store oder Google Play und legen Sie ein Konto mit der E-Mail-Adresse des Eigentümers an.[^s1][^s5]
2. **Legen Sie einen Standort an** und geben Sie ihm einen einfachen Namen, etwa „Terrasse“ oder „Garten“.[^s1]
3. **Stellen Sie sich höchstens ca. 9 m vom Steuerkasten entfernt hin.** In der Liste erscheinen nur Steuergeräte in Bluetooth-Reichweite und im Suchmodus.[^s1]
4. **Gleichen Sie die Seriennummer** in der App mit dem Etikett am Kasten ab und wählen Sie dann das Steuergerät aus.[^s1]
5. **Konfigurieren Sie jeden Kanal**, einen je Heizstromkreis, und benennen Sie ihn nach dem Bereich, den er beheizt.[^s1]
6. **Verbinden Sie das Steuergerät mit WLAN oder Ethernet.** Steuergeräte starten über Bluetooth; eine Netzwerkverbindung ist stabiler und ermöglicht die Steuerung auch, wenn Sie nicht auf der Terrasse sind. Die Netzwerkeinstellungen erhalten Sie von Ihrem Installateur oder vom technischen Support von Bromic.[^s1]
7. **Fügen Sie weitere Steuergeräte oder Benutzer hinzu** oder schließen Sie die Einrichtung des Standorts ab, um zum Startbildschirm zu gelangen.[^s1]

<div class="diagram">Diagramm: Smartphone → Bluetooth (Einrichtung, bis ca. 9 m) → Affinity-Steuergerät → WLAN oder Ethernet → App von überall; jeder Kanal des Steuergeräts versorgt einen oder mehrere Heizstrahler.</div>

## Was kann ich auf dem Startbildschirm tun?

Der Startbildschirm listet Ihre Heizstrahler („Geräte“), Zonen und Szenen auf, mit einem Symbol, das zeigt, wie jedes Steuergerät verbunden ist: Bluetooth, WLAN oder Ethernet.[^s1]

- **Ein und aus.** Ein Schalter je Heizstrahler.
- **Heizstufe.** Heizstrahler an einem Dimmer- oder Eclipse-Steuergerät zeigen einen Schieberegler von 0 bis 100 Prozent.[^s1] Eclipse-Heizstrahler dimmen über dasselbe Steuergerät auch ihr Licht.[^s3]
- **Timer.** Öffnen Sie einen Heizstrahler, um ihn umzubenennen oder einen Timer zu stellen. Jedes Steuergerät hat außerdem eine voreingestellte automatische Abschaltung nach vier Stunden, einstellbar auf 2, 4, 6, 8 oder 12 Stunden. Bromic rät davon ab, sie zu deaktivieren.[^s2]

## Wie funktionieren Zonen und Szenen?

Eine **Zone** fasst Heizstrahler zusammen, die Sie gemeinsam nutzen, etwa am Esstisch oder in der Lounge. So schaltet ein Befehl sie ein, stellt eine gemeinsame Heizstufe ein oder plant ihre Abschaltung.[^s1] Planen Sie Zonen danach, wie Sie den Bereich nutzen, und zwar vor der Verkabelung: siehe [wo Terrassenheizstrahler hingehören](item:RES-PP-01).

Eine **Szene** automatisiert einen Ablauf nach einem Wochenplan: Wärme an Werktagen bei Einbruch der Dunkelheit an, nach einer Veranstaltung aus.[^s1] Die zeitplanbasierte Abschaltung funktioniert nur bei Steuergeräten, die per WLAN verbunden sind.[^s4]

## Können andere Personen die App nutzen?

Ja. Der Admin lädt Personen per E-Mail über Einstellungen, Benutzer verwalten ein. Admins können die Einrichtung des Standorts ändern; Benutzer können nur die Heizstrahler bedienen.[^s1][^s2] Für Einladungen muss das Steuergerät im WLAN sein.[^s1] Die Zahl der Heizstrahler je Standort und der Standorte je Konto ist nicht begrenzt.[^s2]

## Funktioniert sie mit Alexa oder Google Home?

Ja, über kompatible Affinity-Steuerungen; verknüpfen Sie sie in der Alexa- oder Google-Home-App. Apple Home wird derzeit nicht unterstützt.[^s2][^s3] Für die Sprachsteuerung muss das Steuergerät in einem Netzwerk sein: Über Bluetooth allein funktioniert sie nicht, ebenso wenig, wenn das Steuergerät über eine Gebäudeleittechnik läuft.[^s2] Für Systeme im ganzen Haus siehe [Bromic-Heizstrahler in die Hausautomation einbinden (auf Englisch)](https://www.bromic.com/blog/how-to-integrate-your-bromic-smart-heat-link-with-your-home-automation-system/).

## Was passiert, wenn das WLAN ausfällt?

Das Steuergerät wechselt auf eine andere verfügbare Verbindung oder auf Bluetooth und kehrt zu WLAN oder Ethernet zurück, sobald diese wieder da sind.[^s2] Verliert das Steuergerät die Stromversorgung, zeigt die App seine Heizstrahler als offline an.[^s2] [[VERIFY: heater state after a power cut and whether a wall switch can override an Affinity controller — Mike Clifford]]

## Häufige Fragen

### Funktioniert die App mit meiner älteren Bromic-Fernbedienung?
Nein. Die App ist für Affinity-Steuerungen gebaut und nicht abwärtskompatibel mit den älteren Fernbedienungen von Bromic.[^s1][^s2] [[VERIFY: recommended replacement path for owners of wireless On/Off and Dimmer controllers — Mike Clifford]]

### Wird zu Affinity-Steuergeräten eine Fernbedienung mitgeliefert?
Nein. Affinity-Steuerungen werden über die App bedient und ohne physische Fernbedienung geliefert.[^s3]

### Ist die App kostenlos?
[[VERIFY: app price and any subscription — Mike Clifford]] Die Steuergeräte sind separat erhältlich; siehe die [Bromic-Steuerungen](https://www.bromic.de/).

### Wo bekomme ich Hilfe?
Beim technischen Support von Bromic über [bromic.de](https://www.bromic.de/) oder in den [FAQ zur App (auf Englisch)](https://www.bromic.com/affinity-smart-heat-app/). [[VERIFY: Kontakt des technischen Supports für Deutschland — Raffaele Marti]]

Der Einrichtungsleitfaden erklärt Zonen, Szenen und Sprachsteuerung Schritt für Schritt an einem Ort.
