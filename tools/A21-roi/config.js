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
      "value": 6,
      "unit": "heaters",
      "source": "COM-IN-01 worked example (illustrative input)",
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
      "value": 30000,
      "unit": "$ installed: heaters, Affinity controls, wiring, permits",
      "source": "PLACEHOLDER from the COM-IN-01 worked example, not a Bromic price or quote",
      "verified": false,
      "verify": "[[VERIFY: benchmarks — Blake Petty]]",
      "owner": "Blake Petty"
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
  }
};
