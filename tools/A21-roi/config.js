// Generated from config.json by tools/build-config.mjs — edit config.json, not this file.
export default {
  "_readme": "Every assumption the A21 patio revenue ROI calculator uses. An assumption is any object with a `value`: it carries unit, source, verified and owner, and a [[VERIFY]] note while verified is false. Revenue defaults are the COM-IN-01 worked example's illustrative inputs, NOT benchmarks: every one waits on [[VERIFY: benchmarks — Blake Petty]]. Payback is on contribution (gross) margin after running cost, the article's basis: 30% margin less $1,140 of electricity gives the article's 15.5 months. Edit this file, then run `node tools/build-config.mjs`.",
  "tool": {
    "asset_id": "A21",
    "matrix_cell": "COM-IN",
    "title": "Patio heating payback",
    "version": "0.1.0-draft"
  },
  "cta": {
    "label": "Get the permit and fire-code checklist",
    "asset": "A22",
    "href": {
      "value": "#A22-permit-checklist",
      "unit": "url",
      "source": "Next-stage asset per data/journey-matrix.json (COM-IN → COM-PP, A22 permit & fire-code checklist). Placeholder anchor until the A22 page has a URL",
      "verified": false,
      "verify": "[[VERIFY: live URL of the A22 permit and fire-code checklist — 454 Creative]]",
      "owner": "454 Creative"
    }
  },
  "revenue": {
    "heated_seats": {
      "value": 40,
      "unit": "seats inside heated coverage",
      "source": "COM-IN-01 worked example (illustrative input, not a benchmark)",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "average_check": {
      "value": 45,
      "unit": "$ revenue per guest",
      "source": "COM-IN-01 worked example (illustrative input, not a benchmark)",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "turns_per_night": {
      "value": 1.5,
      "unit": "seatings per seat per evening",
      "source": "COM-IN-01 worked example (illustrative input, not a benchmark)",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "extra_nights": {
      "value": 60,
      "unit": "nights a year the patio opens that it would not unheated",
      "source": "COM-IN-01 worked example (illustrative input, not a benchmark)",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "capture_pct": {
      "value": 50,
      "unit": "% of heated seats filled on those nights",
      "source": "COM-IN-01 worked example (illustrative input, not a benchmark); the article advises starting low",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "margin_pct": {
      "value": 30,
      "unit": "% contribution (gross) margin: revenue left after food, drink and variable labour",
      "source": "COM-IN-01 worked example (illustrative input, not a benchmark). This is the basis that gives the article's 15.5-month payback",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
    }
  },
  "running": {
    "model": "Platinum Smart-Heat Electric 4500W",
    "controls": "Affinity Smart-Heat Dimmer or On/Off controller and a wall switch per zone; Bromic Smart-Heat app (zones, schedules, timers)",
    "heaters": {
      "value": 7,
      "unit": "heaters",
      "source": "COM-IN-01 worked example: 40 seats × 20 ft² ÷ (143 × 0.85) = 6.6 → 7 (templates/calculation-model.md)",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "kw_per_heater": {
      "value": 4.5,
      "unit": "kW per heater",
      "source": "Lookbook 2026 p.21 (Platinum Smart-Heat Electric 4500W); data/product-facts.json",
      "verified": false,
      "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
      "owner": "Mike Clifford"
    },
    "hours_per_night": {
      "value": 5,
      "unit": "heated hours per extra night",
      "source": "COM-IN-01 worked example (illustrative input)",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "price_kwh": {
      "value": 0.1407,
      "unit": "$/kWh",
      "source": "EIA Monthly Energy Review: US commercial average retail electricity price, Jan–May 2026, 14.07¢/kWh (COM-IN-01 source s2). https://www.eia.gov/totalenergy/data/monthly/",
      "verified": false,
      "verify": "[[VERIFY: 2026 commercial $/kWh; A20 uses 13.54¢ (May 2026) — align the two — Brian Kim/Finance]]",
      "owner": "Brian Kim"
    }
  },
  "investment": {
    "installed_cost": {
      "value": 35000,
      "unit": "$ installed: heaters, Affinity controls, wiring, permits",
      "source": "PLACEHOLDER: 7 heaters × the $5,000 all-in placeholder a heater (COM-IN-01 worked example). Not a Bromic price or quote",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "installed_per_heater": {
      "value": 5000,
      "unit": "$ per heater installed, all in: heater, its share of Affinity controls, wiring, mounting, permits",
      "source": "PLACEHOLDER: the COM-IN-01 worked example's $30,000 for six heaters, divided by six. Not a Bromic price or quote",
      "verified": false,
      "verify": "[[VERIFY: typical all-in installed cost per Platinum 4500W heater with Affinity controls — Shaughn Ritchie]]",
      "owner": "Shaughn Ritchie"
    }
  },
  "sensitivity": {
    "capture_pcts": {
      "value": [
        25,
        50,
        75
      ],
      "unit": "% capture rates shown in the sensitivity table",
      "source": "COM-IN-01 sensitivity table",
      "verified": true,
      "verify": "",
      "owner": "Blake Petty"
    }
  },
  "notes": {
    "basis": "Payback = installed cost ÷ ((added revenue × contribution margin − running cost) ÷ 12). Margin, not revenue: food, drink and variable labour come out of every added cover.",
    "controls": "Every heater needs its controls to run as a complete system. Wi-Fi and app features require compatible Affinity Smart-Heat controls, sold separately.",
    "scope": "Illustrative: every default is an assumption chosen to show the method, not a benchmark or a promise. Excludes financing, tax, depreciation, demand charges and maintenance. Use your own POS and P&L figures.",
    "code": "Code and permit requirements vary by city and change over time. Confirm with your local building and fire authority, and use a licensed electrician or gas fitter (US: NFPA 70 for electric, NFPA 54 for gas).",
    "code_source_url": "https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70"
  },
  "venues": [
    {
      "id": "restaurant",
      "label": "Restaurant patio",
      "image": "p-004-007",
      "profile": {
        "value": {
          "heated_seats": 40,
          "months": [
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0
          ],
          "days_per_week": 7,
          "hours_per_night": 5
        },
        "unit": "starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night",
        "source": "Starting point only, not a survey: heat adds March and November, close to the COM-IN-01 example of 60 extra nights. The visitor changes every part of it.",
        "verified": false,
        "verify": "[[VERIFY: typical heated seats and shoulder season for this venue type — Brian Kim]]",
        "owner": "Brian Kim"
      }
    },
    {
      "id": "rooftop",
      "label": "Rooftop bar",
      "image": "w-aba-restaurant",
      "profile": {
        "value": {
          "heated_seats": 60,
          "months": [
            0,
            0,
            1,
            1,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            0
          ],
          "days_per_week": 7,
          "hours_per_night": 5
        },
        "unit": "starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night",
        "source": "Starting point only, not a survey: heat adds spring and autumn evenings. The visitor changes every part of it.",
        "verified": false,
        "verify": "[[VERIFY: typical heated seats and shoulder season for this venue type — Brian Kim]]",
        "owner": "Brian Kim"
      }
    },
    {
      "id": "hotel",
      "label": "Hotel terrace",
      "image": "w-bromic-ambiente-sedona-10",
      "profile": {
        "value": {
          "heated_seats": 30,
          "months": [
            0,
            0,
            1,
            1,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            0
          ],
          "days_per_week": 7,
          "hours_per_night": 4
        },
        "unit": "starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night",
        "source": "Starting point only, not a survey: heat adds spring and autumn evenings. The visitor changes every part of it.",
        "verified": false,
        "verify": "[[VERIFY: typical heated seats and shoulder season for this venue type — Brian Kim]]",
        "owner": "Brian Kim"
      }
    },
    {
      "id": "pub",
      "label": "Pub or beer garden",
      "image": "w-1",
      "profile": {
        "value": {
          "heated_seats": 80,
          "months": [
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            0
          ],
          "days_per_week": 7,
          "hours_per_night": 5
        },
        "unit": "starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night",
        "source": "Starting point only, not a survey: heat adds March, October and November. The visitor changes every part of it.",
        "verified": false,
        "verify": "[[VERIFY: typical heated seats and shoulder season for this venue type — Brian Kim]]",
        "owner": "Brian Kim"
      }
    },
    {
      "id": "casual",
      "label": "Café or food hall",
      "image": "w-commercial-australia-sydney-manly-wharf-15",
      "profile": {
        "value": {
          "heated_seats": 50,
          "months": [
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0
          ],
          "days_per_week": 7,
          "hours_per_night": 6
        },
        "unit": "starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night",
        "source": "Starting point only, not a survey: heat adds March and November, longer hours. The visitor changes every part of it.",
        "verified": false,
        "verify": "[[VERIFY: typical heated seats and shoulder season for this venue type — Brian Kim]]",
        "owner": "Brian Kim"
      }
    },
    {
      "id": "cafe",
      "label": "Sidewalk café",
      "image": "w-eclipse-electric-wall-mount-commercial-scene",
      "profile": {
        "value": {
          "heated_seats": 20,
          "months": [
            0,
            0,
            1,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0
          ],
          "days_per_week": 7,
          "hours_per_night": 4
        },
        "unit": "starting profile: heated seats, months heat keeps the patio open, days a week, heated hours a night",
        "source": "Starting point only, not a survey: heat adds cool spring and autumn days. The visitor changes every part of it.",
        "verified": false,
        "verify": "[[VERIFY: typical heated seats and shoulder season for this venue type — Brian Kim]]",
        "owner": "Brian Kim"
      }
    }
  ],
  "default_venue": "restaurant",
  "sizing": {
    "ft2_per_seat": {
      "value": 20,
      "unit": "ft² of heated patio a seat, aisles and breathing room included",
      "source": "NAFEM space-planning chart as published in the Restaurant Furniture seating capacity guide (https://www.restaurant-furniture.com/resources/guides/restaurant-seating-capacity-guide): full-service dining 12–15 ft² a seat, fine dining 18–20. The top of the range is used so tables are not crammed (owner, 30 Oct 2026)",
      "verified": false,
      "verify": "[[VERIFY: open the NAFEM chart itself and confirm the 18–20 ft² fine-dining figure — Brian Kim]]",
      "owner": "Brian Kim"
    },
    "coverage_ft2": {
      "value": 143,
      "unit": "ft² per heater",
      "source": "Lookbook 2026 p.21 (top of the 65–143 ft² range mapped to the 4500W Platinum); same basis as A20",
      "verified": false,
      "verify": "[[VERIFY: coverage of the 4500W model — Mike Clifford]]",
      "owner": "Mike Clifford"
    },
    "derate": {
      "value": 0.85,
      "unit": "× coverage (partly covered, cool evenings)",
      "source": "templates/calculation-model.md: the A03 factors for the default site, partly covered (1.0) × cool (0.85)",
      "verified": false,
      "verify": "[[VERIFY: A03 cover and climate factors — Mike Clifford]]",
      "owner": "Mike Clifford"
    }
  },
  "product_image": "w-platinum-black"
};
