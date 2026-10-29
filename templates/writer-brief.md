# Writer brief (shared by every content agent)

Repo: /home/user/bromic_marketing. Before writing, read: CLAUDE.md, HANDOVER.md (binding), templates/content-schema.md
(the exact frontmatter + body conventions — follow them precisely, the app and tests parse them), data/product-facts.json
(the ONLY source of product facts), data/journey-matrix.json, data/assets.json, sources/*.txt (text of the three Bromic PDFs),
images/library/manifest.json (pick `hero` and body images by id; match product and audience; prefer Lookbook `l-` images
for current products; `p-` images show the 2021 range, use them only for generic commercial scenes).

Research: use WebSearch (and WebFetch on non-Bromic sites; bromic.com is blocked in this sandbox). Prefer primary sources:
NAHB, AIA Home Design Trends, Harvard JCHS, NAR Remodeling Impact, EIA (electricity, natural gas, propane prices), DOE,
NFPA/ICC code text, ENERGY STAR, state energy codes (CA Title 24, NYC LL97, WA/Denver/etc.), National Restaurant Association,
Houzz, IRS/ASHRAE where relevant. Every non-Bromic number gets a `sources:` entry with a real URL and `[^sN]` marker.
`verified: true` only if you read it (page or a search snippet that states the number); else `verified: false` plus
`[[VERIFY: …]]` in the body. Never invent a stat, price, customer, quote, code clause or keyword volume. Paraphrase; don't copy.

Voice: Bromic — direct, expert, calm, mature. Pithy: short sentences, no filler, no "in today's world", no hype, no
exclamation marks, no emoji. Sentence case headings. People and moments first, then numbers. Every product recommendation
names the controls needed (Affinity Smart-Heat On/Off, Dimmer or Eclipse controller, wall switch, Smart-Heat app; Wi-Fi/app
features require compatible Affinity controls, sold separately). Tungsten Coastal/Select are always "(coming soon)". No legacy
"500 series". No Tungsten built-in gas BTU. Competitors only if factual + sourced + `needs_approval: Shaughn Ritchie` in frontmatter.
Code/permit content: disclaimer to confirm with the local authority and a licensed electrician/gas fitter; link primary source.

Running-cost maths: cost/hr = kW × $/kWh (electric); BTU/hr ÷ 100,000 × $/therm (natural gas); BTU/hr ÷ 91,500 × $/gal (propane).
Use the latest EIA averages you can find, cite them, show the formula, mark [[VERIFY: 2026 rates — Brian Kim/Finance]].

Write ONLY in the folders you are assigned. Do not run git. Log every open question / [[VERIFY]] you create to
reviews/open-questions/<your-agent-name>.md as a table: | item id | question | suggested owner |.
When done, reply with: files written, word counts, sources count (verified/unverified), and the top open questions.
