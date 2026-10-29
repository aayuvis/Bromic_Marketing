---
id: BLOG-09
type: blog
title: "How to connect Bromic heaters to a home automation or building management system"
slug: how-to-integrate-your-bromic-smart-heat-link-with-your-home-automation-system
live_url: https://www.bromic.com/blog/how-to-integrate-your-bromic-smart-heat-link-with-your-home-automation-system/
action: merge-target
merges: [https://www.bromic.com/blog/how-do-i-connect-my-outdoor-radiant-heater-to-my-home-automation-system/]
audience: [BLD, RES]
stage: [BY]
cell: BLD-BY
asset: A24
summary: "How Bromic heaters connect to Alexa, Google Home, Control4, Crestron, Lutron or a building management system today: Affinity controllers, the expansion board's Ethernet and 0–10 V, what the integrator needs, and what replaced the Smart-Heat Link."
primary_keyword: outdoor heater home automation
secondary_keywords: [patio heater control4, patio heater crestron, outdoor heater bms, 0-10v heater control, smart-heat link]
ai_prompt: "How do I connect my outdoor heater to Control4, Crestron or Lutron?"
meta_description: "Connect Bromic heaters to home automation or a BMS: Affinity controllers, the expansion board's Ethernet and 0-10 V, and what the integrator needs."
cta: {label: "Get the install guide series", asset: A17}
hero: w-expansion-board-2-1600x1600-1
images: [w-expansion-board]
owner_review: Megan Spies
technical_reviewer: Mike Clifford
last_reviewed: 2026-10-29
status: draft
gated: false
related: [BLD-BY-01, RES-BY-01, COM-BY-01, BLD-IN-01]
updated: 2026-10-29
sources:
  - id: s1
    publisher: Bromic Heating
    title: "Affinity Smart-Heat Expansion Board"
    year: 2026
    url: https://www.bromic.com/product/affinity-smart-heat-expansion-board/
    supports: "Ethernet and 0–10 V for home automation or BMS; fits 1- and 2-channel On/Off and Dimmer, built into 5-channel; fits inside the controller with two screws and draws its power from it; BMS needs the included jumper and disables the app; Alexa and Google Home integrate without the board; $384"
    verified: true
  - id: s2
    publisher: Bromic Heating
    title: "Intelligent Controls Systems (smart controls page)"
    year: 2026
    url: https://www.bromic.com/smart-controls/
    supports: "Compatible with Google Home, Amazon Alexa, Lutron, Crestron, Control4, Domotica and Josh.ai; 0–10 V via the expansion board"
    verified: false
  - id: s3
    publisher: Bromic Heating
    title: "Outdoor Lookbook 2026, p.41 — Affinity Smart-Heat Control System"
    year: 2026
    url: sources/Bromic_Lookbook_2026.pdf
    supports: "Alexa, Google Assistant, Control4, Crestron, Lutron; compatibility varies by system and may need additional integration hardware or configuration; Wi-Fi and app features need compatible Affinity controls, sold separately"
    verified: true
  - id: s4
    publisher: Bromic Heating
    title: "Bromic heating app page (FAQ)"
    year: 2026
    url: https://www.bromic.com/affinity-smart-heat-app/
    supports: "BMS and app cannot run at the same time; voice control does not work on Bluetooth or BMS setups; Apple Home not supported"
    verified: true
  - id: s5
    publisher: Bromic Heating
    title: "Affinity On/Off, Dimmer and Eclipse controller pages"
    year: 2026
    url: https://www.bromic.com/product/affinity-smart-heat-on-off-controllers/
    supports: "Channels, 6 kW per channel at 208–277 V, 5-channel three-phase options including 120/208 V; 5-channel includes the expansion board; 2.4 GHz Wi-Fi, Bluetooth 30 ft"
    verified: true
  - id: s6
    publisher: Bromic Heating
    title: "How to Integrate Your Bromic Smart-Heat Link with Your Home Automation System (live post, 2022)"
    year: 2022
    url: https://www.bromic.com/blog/how-to-integrate-your-bromic-smart-heat-link-with-your-home-automation-system/
    supports: "Smart-Heat Link: RS232 (DB9), 5 VDC 500 mA supply, 19200 baud 8-N-1, Docklight programming, pairs with Wireless On/Off and Dimmer controllers, up to 50 remotes; licensed system integrator; wiring diagrams 220–240 V"
    verified: true
  - id: s7
    publisher: Bromic Heating
    title: "How Do I Connect My Outdoor Radiant Heater to My Home Automation System? (live post, 2022)"
    year: 2022
    url: https://www.bromic.com/blog/how-do-i-connect-my-outdoor-radiant-heater-to-my-home-automation-system/
    supports: "Merged post: RS232 route, professional installer and licensed electrician, integrator maps commands to the interface"
    verified: true
  - id: s8
    publisher: National Fire Protection Association
    title: "NFPA 70, National Electrical Code"
    year: 2026
    url: https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70
    supports: "US electrical installation code that governs heater and controller circuits"
    verified: false
---

Bromic heaters join a smart home through Affinity Smart-Heat controllers, sold separately. Alexa and Google Home link straight to the Bromic app with no extra hardware. Control4, Crestron, Lutron and building management systems connect through the Affinity expansion board, which adds Ethernet and a 0–10 V control input; it is built into 5-channel controllers and added to 1- and 2-channel ones.[^s1][^s2] This replaces the older RS232 Smart-Heat Link route.

![Affinity expansion board in its clear housing](img:w-expansion-board-2-1600x1600-1)

## Which route fits the project?

| Goal | What to install | Notes |
|---|---|---|
| App and voice (Alexa, Google Home) | Affinity On/Off, Dimmer or Eclipse controller on Wi-Fi | No expansion board needed[^s1]. Apple Home is not supported[^s4] |
| Whole-home system (Control4, Crestron, Lutron and others) | Affinity controller plus expansion board | 0–10 V and Ethernet; compatibility varies by system and may need extra integration hardware or configuration[^s3] |
| Building management system (BMS) | Affinity controller plus expansion board, BMS mode | The BMS takes over and the app is disabled[^s1][^s4] |
| No automation | Manual wall switch | On and off at the wall; no app or voice |

Bromic also lists Domotica and Josh.ai as compatible platforms.[^s2] [[VERIFY: tested integrations, drivers or modules for Control4, Crestron, Lutron, Domotica and Josh.ai, and whether 0–10 V is the only interface — Mike Clifford]]

## What does the expansion board do?

It sits inside a 1- or 2-channel On/Off or Dimmer controller, fixed with two screws and powered by the controller, and adds two things:[^s1]

- **Ethernet**, a wired network link that is steadier than Wi-Fi across a large site.
- **A 0–10 V terminal block**, so the automation system can switch or set the level of each channel.

The 5-channel On/Off and Dimmer controllers include the board.[^s5] [[VERIFY: does the Eclipse controller accept the expansion board or 0–10 V — Mike Clifford]]

<div class="diagram">Diagram: automation processor → 0–10 V pair and Ethernet → expansion board inside an Affinity 2-channel Dimmer → two heater circuits; a dotted line from the router to the controller for the app, crossed out when BMS mode is on.</div>

## What happens to the app in BMS mode?

The app and a BMS cannot run at the same time. Fitting the board's jumper hands control to the BMS, and the app stops working for that controller; voice control stops too.[^s1][^s4] Decide with the owner which system will be the single point of control before commissioning. A restaurant group running heat from its building system will choose BMS; most homeowners keep the app and voice.

## What does the integrator need?

- **The controller model and channel map:** which channel feeds which heater, and its load.
- **The control signal per channel:** on/off for On/Off controllers and gas heaters; level for Dimmer channels. [[VERIFY: 0–10 V scaling to heater output on Dimmer channels, and whether On/Off channels switch at a threshold — Mike Clifford]]
- **A network drop** to the controller location if Ethernet is used.
- **The Affinity installation manual and wiring diagrams** from Bromic's technical resources. [[VERIFY: Affinity wiring diagrams cover 208 V and 277 V as well as 220–240 V; the earlier Smart-Heat Link diagrams showed 220–240 V only — Mike Clifford]]

Controllers handle 6 kW per channel at 208–277 V, and 5-channel units come in three-phase versions, including 120/208 V.[^s5]

## What about the Smart-Heat Link?

The Smart-Heat Link was an RS232 gateway programmed over a serial connection. It paired with the earlier Wireless On/Off and Dimmer controllers, not with Affinity.[^s6][^s7] New projects use Affinity controllers and the expansion board. [[VERIFY: Smart-Heat Link status (discontinued, spares only, or supported) and the upgrade path for existing RS232 installs — Mike Clifford]] Owners of a Smart-Heat Link system should contact Bromic Technical Support before changing anything.

## Who installs it?

A licensed electrician installs the heaters, controllers and circuits, and a qualified system integrator configures the automation side.[^s6][^s7] Heater and control wiring in the US follows NFPA 70, the National Electrical Code,[^s8] as adopted locally: confirm requirements with your local authority having jurisdiction and a licensed electrician before work starts.

## Frequently asked

### Do I need the expansion board for Alexa?
No. Alexa and Google Home link through the Bromic app without it.[^s1]

### Can I use the app and a BMS together?
No. BMS mode disables the app for that controller.[^s4]

### Can gas heaters be automated?
Yes, on an Affinity On/Off controller, up to 10 gas heaters per channel, switched on and off.[^s5]

### Will my RS232 Smart-Heat Link work with Affinity?
[[VERIFY: compatibility between Smart-Heat Link and Affinity controllers — Mike Clifford]] For app setup, see [how to use the Bromic heating app](https://www.bromic.com/blog/how-to-use-the-new-bromic-heating-app/); for the full range, the [Bromic controls page](https://www.bromic.com/controls/).

Wiring and commissioning steps are in the install guide series.
