// Generated from config.json by tools/build-config.mjs — edit config.json, not this file.
export default {
  "_readme": "Every assumption the A03 sizing calculator uses. An assumption is any object with a `value`: it must carry unit, source, verified and owner, and a [[VERIFY]] note while verified is false. Edit this file, then run `node tools/build-config.mjs` to regenerate config.js and re-inline it into index.html. Bromic product values mirror data/product-facts.json and stay verified:false until Mike Clifford signs off.",
  "tool": {
    "asset_id": "A03",
    "matrix_cell": "RES-CO",
    "title": "How many heaters?",
    "version": "0.1.0-draft"
  },
  "cta": {
    "label": "Book a design consult",
    "asset": "A07",
    "href": {
      "value": "https://www.bromic.com/design-your-space/",
      "unit": "url",
      "source": "Lookbook 2026 p.43 (design service)",
      "verified": false,
      "verify": "[[VERIFY: final A07 Design Your Space 2.0 landing URL — 454 Creative]]",
      "owner": "454 Creative"
    }
  },
  "limits": {
    "min_side_ft": {
      "value": 4,
      "unit": "ft",
      "source": "Tool guard rail, not a product fact",
      "verified": false,
      "verify": "[[VERIFY: smallest space the tool should size — Brian Kim]]",
      "owner": "Brian Kim"
    },
    "max_side_ft": {
      "value": 200,
      "unit": "ft",
      "source": "Tool guard rail, not a product fact",
      "verified": false,
      "verify": "[[VERIFY: largest side the tool should accept — Brian Kim]]",
      "owner": "Brian Kim"
    },
    "large_space_ft2": {
      "value": 1500,
      "unit": "ft²",
      "source": "Tool guard rail: above this the result tells the visitor to use the design service",
      "verified": false,
      "verify": "[[VERIFY: area above which we route to the design team — Shaughn Ritchie]]",
      "owner": "Shaughn Ritchie"
    }
  },
  "outdoor_rule": {
    "min_open_perimeter_pct": {
      "value": 30,
      "unit": "% of perimeter permanently open",
      "source": "Planning Guide v1.2 (2021) Step 01; data/product-facts.json principles.outdoor-definition",
      "verified": false,
      "verify": "[[VERIFY: confirm the 30% open rule for 2026 — Mike Clifford]]",
      "owner": "Mike Clifford"
    }
  },
  "enclosure": {
    "open": {
      "label": "Open",
      "hint": "No roof over the heated area.",
      "factor": {
        "value": 0.85,
        "unit": "× nominal coverage",
        "source": "Assumption: no overhead cover, so no 'heat cloud' and more wind exposure (Planning Guide v1.2 Step 01, qualitative only)",
        "verified": false,
        "verify": "[[VERIFY: coverage derate for fully open spaces — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    "partial": {
      "label": "Partially covered",
      "hint": "A pergola, umbrella or part roof over some of the area.",
      "factor": {
        "value": 1,
        "unit": "× nominal coverage",
        "source": "Assumption: Lookbook coverage treated as the partially covered reference case",
        "verified": false,
        "verify": "[[VERIFY: which setting the Lookbook coverage figures assume — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    "covered": {
      "label": "Covered",
      "hint": "A solid roof, with walls on some sides.",
      "factor": {
        "value": 1.1,
        "unit": "× nominal coverage",
        "source": "Assumption: a cover traps a 'heat cloud' that adds a convective boost (Planning Guide v1.2 Step 01, qualitative only)",
        "verified": false,
        "verify": "[[VERIFY: coverage uplift for covered spaces — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    }
  },
  "climate": {
    "mild": {
      "label": "Mild",
      "hint": "Evenings you heat are usually above about 50°F.",
      "factor": {
        "value": 1,
        "unit": "× coverage",
        "source": "Assumption. Planning Guide v1.2 Step 05 says colder states may need more heaters for the same space (its example: 2 heaters in California, 3 in Massachusetts for 20 × 10 ft)",
        "verified": false,
        "verify": "[[VERIFY: climate derate factors and the temperature bands that define them — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    "cool": {
      "label": "Cool",
      "hint": "Evenings you heat are usually about 40–50°F.",
      "factor": {
        "value": 0.85,
        "unit": "× coverage",
        "source": "Assumption (see mild)",
        "verified": false,
        "verify": "[[VERIFY: climate derate factors — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    "cold": {
      "label": "Cold",
      "hint": "Evenings you heat are often below about 40°F.",
      "factor": {
        "value": 0.7,
        "unit": "× coverage",
        "source": "Assumption (see mild). Note: the Planning Guide's example (2 gas heaters for 200 ft² in California) implies a layout or overlap allowance this tool does not model",
        "verified": false,
        "verify": "[[VERIFY: climate derate factors — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    }
  },
  "mounting": {
    "min_wall_mount_in": {
      "value": 72,
      "unit": "in above floor",
      "source": "Planning Guide v1.2 (2021) Step 06; data/product-facts.json principles.codes-electric",
      "verified": false,
      "verify": "[[VERIFY: 2026 minimum wall-mount height per model — Mike Clifford]]",
      "owner": "Mike Clifford"
    },
    "min_ceiling_mount_in": {
      "value": 96,
      "unit": "in above floor",
      "source": "Planning Guide v1.2 (2021) Step 06 (varies with output)",
      "verified": false,
      "verify": "[[VERIFY: 2026 minimum ceiling-mount height per model — Mike Clifford]]",
      "owner": "Mike Clifford"
    },
    "default_height_ft": {
      "value": 9,
      "unit": "ft",
      "source": "Form default only",
      "verified": false,
      "verify": "[[VERIFY: default mount height shown in the form — Brian Kim]]",
      "owner": "Brian Kim"
    },
    "height_bands": {
      "value": [
        {
          "up_to_ft": 10,
          "factor": 1
        },
        {
          "up_to_ft": 12,
          "factor": 0.9
        },
        {
          "up_to_ft": 99,
          "factor": 0.8
        }
      ],
      "unit": "× coverage by mount height (built-in heaters only)",
      "source": "Assumption. Lookbook 2026 notes coverage varies with mounting height but publishes no curve",
      "verified": false,
      "verify": "[[VERIFY: coverage by mount height per model — Mike Clifford]]",
      "owner": "Mike Clifford"
    },
    "max_recommended_ft": {
      "value": 14,
      "unit": "ft",
      "source": "Assumption: above this the result suggests a suspension pole (Planning Guide v1.2 Step 07 lists suspension poles to bring units down in high ceilings)",
      "verified": false,
      "verify": "[[VERIFY: height above which to suggest a suspension pole — Mike Clifford]]",
      "owner": "Mike Clifford"
    }
  },
  "layout": {
    "overlap_factor": {
      "value": 1,
      "unit": "× effective coverage (1.0 = no allowance for overlap or awkward shapes)",
      "source": "Assumption. The Planning Guide v1.2 Step 05 example recommends 2 gas heaters for a 20 × 10 ft patio in California although one heater's nominal coverage exceeds 200 ft², which suggests an overlap or layout allowance",
      "verified": false,
      "verify": "[[VERIFY: overlap / layout allowance to apply to nominal coverage — Mike Clifford]]",
      "owner": "Mike Clifford"
    }
  },
  "products": [
    {
      "id": "platinum-electric-2300",
      "family": "platinum-electric",
      "name": "Platinum Smart-Heat Electric 2300W",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "affinity",
      "coverage_ft2": {
        "value": 65,
        "unit": "ft²",
        "source": "Lookbook 2026 p.21: range 65–143 ft² across 2300/3400/4500W; lowest wattage mapped to the low end",
        "verified": false,
        "verify": "[[VERIFY: coverage of the 2300W model — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": 2300,
        "unit": "W",
        "source": "Lookbook 2026 p.21",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "platinum-electric-3400",
      "family": "platinum-electric",
      "name": "Platinum Smart-Heat Electric 3400W",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "affinity",
      "coverage_ft2": {
        "value": 108,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/platinum-smart-heat-electric/ (read 29 Oct 2026) spec table: 3400W, 108 ft²; replaces the 104 ft² interpolation",
        "verified": false,
        "verify": "[[VERIFY: coverage of the 3400W model — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": 3400,
        "unit": "W",
        "source": "Lookbook 2026 p.21",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "platinum-electric-4500",
      "family": "platinum-electric",
      "name": "Platinum Smart-Heat Electric 4500W",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "affinity",
      "coverage_ft2": {
        "value": 143,
        "unit": "ft²",
        "source": "Lookbook 2026 p.21: highest wattage mapped to the high end of 65–143 ft²",
        "verified": false,
        "verify": "[[VERIFY: coverage of the 4500W model — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": 4500,
        "unit": "W",
        "source": "Lookbook 2026 p.21",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "eclipse-electric",
      "family": "eclipse-electric",
      "name": "Eclipse Smart-Heat Electric (pole mount)",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "eclipse",
      "coverage_ft2": {
        "value": 121,
        "unit": "ft²",
        "source": "Lookbook 2026 p.27",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": null,
        "unit": "W",
        "source": "Not published in Lookbook 2026",
        "verified": false,
        "verify": "[[VERIFY: Eclipse Electric wattage — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "eclipse-freestanding",
      "family": "eclipse-freestanding",
      "name": "Eclipse Smart-Heat Freestanding Electric",
      "fuel": "electric",
      "style": "freestanding",
      "status": "current",
      "controls": "eclipse",
      "coverage_ft2": {
        "value": 121,
        "unit": "ft²",
        "source": "Lookbook 2026 p.33",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": null,
        "unit": "W",
        "source": "Not published in Lookbook 2026",
        "verified": false,
        "verify": "[[VERIFY: Eclipse Freestanding wattage and plug type — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "tungsten-freestanding-gas",
      "family": "tungsten-freestanding-gas",
      "name": "Tungsten Smart-Heat Freestanding Gas",
      "fuel": "gas",
      "style": "freestanding",
      "status": "current",
      "controls": "gas-freestanding",
      "coverage_ft2": {
        "value": 215,
        "unit": "ft²",
        "source": "Lookbook 2026 p.39",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "btu": {
        "value": 38000,
        "unit": "BTU/hr",
        "source": "Lookbook 2026 p.39 (freestanding only)",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "tungsten-electric-coastal",
      "family": "tungsten-electric",
      "name": "Tungsten Smart-Heat Electric — Coastal collection",
      "fuel": "electric",
      "style": "built-in",
      "status": "coming-soon",
      "controls": "affinity",
      "coverage_ft2": {
        "value": [
          64,
          144
        ],
        "unit": "ft² (range by model and size)",
        "source": "Lookbook 2026 pp.7, 15",
        "verified": false,
        "verify": "[[VERIFY: launch date and per-model coverage — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "tungsten-electric-select",
      "family": "tungsten-electric",
      "name": "Tungsten Smart-Heat Electric — Select collection",
      "fuel": "electric",
      "style": "built-in",
      "status": "coming-soon",
      "controls": "affinity",
      "coverage_ft2": {
        "value": [
          64,
          144
        ],
        "unit": "ft² (range by model and size)",
        "source": "Lookbook 2026 pp.11, 15",
        "verified": false,
        "verify": "[[VERIFY: launch date and per-model coverage — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "platinum-gas-s",
      "family": "platinum-gas",
      "name": "Platinum Smart-Heat Gas, smaller model",
      "fuel": "gas",
      "style": "built-in",
      "status": "current",
      "controls": "gas-builtin",
      "coverage_ft2": {
        "value": 160,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/platinum-smart-heat-gas/ (read 29 Oct 2026) spec table: 160 ft²",
        "verified": false,
        "verify": "[[VERIFY: Platinum Gas coverage per model — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "platinum-gas-l",
      "family": "platinum-gas",
      "name": "Platinum Smart-Heat Gas, larger model",
      "fuel": "gas",
      "style": "built-in",
      "status": "current",
      "controls": "gas-builtin",
      "coverage_ft2": {
        "value": 215,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/platinum-smart-heat-gas/ (read 29 Oct 2026) spec table: 215 ft²",
        "verified": false,
        "verify": "[[VERIFY: Platinum Gas coverage per model — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "tungsten-gas-builtin-s",
      "family": "tungsten-gas-builtin",
      "name": "Tungsten Smart-Heat Gas (built-in), smaller model",
      "fuel": "gas",
      "style": "built-in",
      "status": "current",
      "controls": "gas-builtin",
      "coverage_ft2": {
        "value": 160,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-gas/ (read 29 Oct 2026) spec table: 160 ft². Output is not shown: Tungsten gas BTU stays unpublished until verified",
        "verified": false,
        "verify": "[[VERIFY: Tungsten Gas built-in coverage and BTU — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "tungsten-gas-builtin-l",
      "family": "tungsten-gas-builtin",
      "name": "Tungsten Smart-Heat Gas (built-in), larger model",
      "fuel": "gas",
      "style": "built-in",
      "status": "current",
      "controls": "gas-builtin",
      "coverage_ft2": {
        "value": 215,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-gas/ (read 29 Oct 2026) spec table: 215 ft². Output is not shown: Tungsten gas BTU stays unpublished until verified",
        "verified": false,
        "verify": "[[VERIFY: Tungsten Gas built-in coverage and BTU — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "tungsten-electric-2000",
      "family": "tungsten-electric",
      "name": "Tungsten Smart-Heat Electric 2000W",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "affinity",
      "coverage_ft2": {
        "value": 65,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-electric/ (read 29 Oct 2026) spec table: 2000 W, 65 ft²",
        "verified": false,
        "verify": "[[VERIFY: coverage of the Tungsten Smart-Heat Electric 2000W — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": 2000,
        "unit": "W",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-electric/ (read 29 Oct 2026)",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "tungsten-electric-3000",
      "family": "tungsten-electric",
      "name": "Tungsten Smart-Heat Electric 3000W",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "affinity",
      "coverage_ft2": {
        "value": 100,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-electric/ (read 29 Oct 2026) spec table: 3000 W, 100 ft²",
        "verified": false,
        "verify": "[[VERIFY: coverage of the Tungsten Smart-Heat Electric 3000W — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": 3000,
        "unit": "W",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-electric/ (read 29 Oct 2026)",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "tungsten-electric-4000",
      "family": "tungsten-electric",
      "name": "Tungsten Smart-Heat Electric 4000W",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "affinity",
      "coverage_ft2": {
        "value": 130,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-electric/ (read 29 Oct 2026) spec table: 4000 W, 130 ft²",
        "verified": false,
        "verify": "[[VERIFY: coverage of the Tungsten Smart-Heat Electric 4000W — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": 4000,
        "unit": "W",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-electric/ (read 29 Oct 2026)",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "tungsten-electric-6000",
      "family": "tungsten-electric",
      "name": "Tungsten Smart-Heat Electric 6000W",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "affinity",
      "coverage_ft2": {
        "value": 160,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-electric/ (read 29 Oct 2026) spec table: 6000 W, 160 ft²",
        "verified": false,
        "verify": "[[VERIFY: coverage of the Tungsten Smart-Heat Electric 6000W — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": 6000,
        "unit": "W",
        "source": "bromic.com product page https://www.bromic.com/product/tungsten-smart-heat-electric/ (read 29 Oct 2026)",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "cobalt-4000",
      "family": "cobalt",
      "name": "Cobalt Smart-Heat Electric 4000W",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "affinity",
      "coverage_ft2": {
        "value": 130,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/cobalt-smart-heat-electric/ (read 29 Oct 2026) spec table: 4000 W, 130 ft²",
        "verified": false,
        "verify": "[[VERIFY: coverage of the Cobalt Smart-Heat Electric 4000W — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": 4000,
        "unit": "W",
        "source": "bromic.com product page https://www.bromic.com/product/cobalt-smart-heat-electric/ (read 29 Oct 2026)",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    {
      "id": "cobalt-6000",
      "family": "cobalt",
      "name": "Cobalt Smart-Heat Electric 6000W",
      "fuel": "electric",
      "style": "built-in",
      "status": "current",
      "controls": "affinity",
      "coverage_ft2": {
        "value": 160,
        "unit": "ft²",
        "source": "bromic.com product page https://www.bromic.com/product/cobalt-smart-heat-electric/ (read 29 Oct 2026) spec table: 6000 W, 160 ft²",
        "verified": false,
        "verify": "[[VERIFY: coverage of the Cobalt Smart-Heat Electric 6000W — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "watts": {
        "value": 6000,
        "unit": "W",
        "source": "bromic.com product page https://www.bromic.com/product/cobalt-smart-heat-electric/ (read 29 Oct 2026)",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    }
  ],
  "controls": {
    "affinity": {
      "items": [
        {
          "name": "Affinity Smart-Heat Dimmer or On/Off controller channel (controllers come in 1, 2 or 5 channels)",
          "per": "zone"
        },
        {
          "name": "Manual wall switch",
          "per": "zone"
        },
        {
          "name": "Bromic Smart-Heat app (zones, schedules, timers)",
          "per": "system"
        }
      ],
      "max_heaters_per_controller": {
        "value": null,
        "unit": "heaters (or kW) per controller",
        "source": "Worked out per model from max_kw_per_channel and the heater wattage (one channel per zone)",
        "verified": false,
        "verify": "[[VERIFY: maximum heaters or load per Affinity channel — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "max_kw_per_channel": {
        "value": 6,
        "unit": "kW per controller channel at 208–277 V",
        "source": "bromic.com product page https://www.bromic.com/product/affinity-smart-heat-dimmer-controllers/ (read 29 Oct 2026); same on the On/Off page",
        "verified": false,
        "verify": "[[VERIFY: Affinity capacity per channel at 208 V and 240 V — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    "eclipse": {
      "items": [
        {
          "name": "Affinity Smart-Heat Eclipse controller channel (1 or 5 channels) or the Eclipse Dimmer Controller",
          "per": "zone"
        },
        {
          "name": "Manual wall switch",
          "per": "zone"
        },
        {
          "name": "Bromic Smart-Heat app (zones, schedules, timers)",
          "per": "system"
        }
      ],
      "max_heaters_per_controller": {
        "value": 1,
        "unit": "Eclipse heaters per controller channel",
        "source": "bromic.com product page https://www.bromic.com/product/affinity-smart-heat-eclipse-controllers/ (read 29 Oct 2026): one Eclipse heater per channel",
        "verified": false,
        "verify": "[[VERIFY: heaters per Eclipse controller; whether Eclipse Freestanding uses the same controller — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    "gas-freestanding": {
      "items": [
        {
          "name": "Controls for Tungsten Smart-Heat Freestanding Gas — confirmed by the Bromic design team [[VERIFY: control options and Affinity compatibility for Tungsten Freestanding Gas — Mike Clifford]]",
          "per": "heater"
        }
      ],
      "max_heaters_per_controller": {
        "value": null,
        "unit": "heaters per controller",
        "source": "Not published",
        "verified": false,
        "verify": "[[VERIFY: control options for Tungsten Freestanding Gas — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    "gas-builtin": {
      "items": [
        {
          "name": "Affinity Smart-Heat On/Off controller channel (dimming is not available on gas)",
          "per": "zone"
        },
        {
          "name": "Manual wall switch",
          "per": "zone"
        },
        {
          "name": "Bromic Smart-Heat app (zones, schedules, timers)",
          "per": "system"
        }
      ],
      "max_heaters_per_controller": {
        "value": 10,
        "unit": "gas heaters per On/Off channel",
        "source": "bromic.com product page https://www.bromic.com/product/affinity-smart-heat-on-off-controllers/ (read 29 Oct 2026): up to 10 gas heaters (or 6,000 W) per channel; Platinum Gas FAQ: on/off only",
        "verified": false,
        "verify": "[[VERIFY: On/Off control of Platinum Gas and Tungsten Gas built-in (the On/Off spec table lists only electric) — Mike Clifford]]",
        "owner": "Mike Clifford"
      }
    },
    "app_note": "Wi-Fi and app features require compatible Affinity Smart-Heat controls, sold separately.",
    "integration_note": "Works with Amazon Alexa, Google Assistant, Control4, Crestron and Lutron. Compatibility varies by system and may need additional integration hardware or configuration."
  },
  "disclaimers": {
    "coverage": "Coverage is approximate and varies by heater model, mounting height, environment and installation conditions (Lookbook 2026). This is a first estimate, not a design.",
    "code": "Electric heaters in the US follow ANSI/NFPA 70 (NEC) and gas heaters ANSI Z223.1/NFPA 54. Confirm every installation with your local building authority and a licensed electrician or gas fitter.",
    "code_source_url": "https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70"
  },
  "families": [
    {
      "id": "any",
      "name": "Help me choose",
      "tagline": "Show the best fit across the range",
      "fuel": "any",
      "style": "any",
      "image": ""
    },
    {
      "id": "platinum-electric",
      "name": "Platinum Electric",
      "tagline": "Slim linear heat for walls, ceilings and flush recesses",
      "fuel": "electric",
      "style": "built-in",
      "image": "w-platinum-black"
    },
    {
      "id": "tungsten-electric",
      "name": "Tungsten Electric",
      "tagline": "Linear heat in black or white, 2 to 6 kW",
      "fuel": "electric",
      "style": "built-in",
      "image": "w-tungelec-stacked"
    },
    {
      "id": "eclipse-electric",
      "name": "Eclipse",
      "tagline": "Round heat and light on a pole or pendant",
      "fuel": "electric",
      "style": "built-in",
      "image": "w-eclipse-electric"
    },
    {
      "id": "eclipse-freestanding",
      "name": "Eclipse Freestanding",
      "tagline": "Heat and light that moves with you",
      "fuel": "electric",
      "style": "freestanding",
      "image": "w-eclipse-portable"
    },
    {
      "id": "cobalt",
      "name": "Cobalt Electric",
      "tagline": "Silver linear heat for walls and ceilings",
      "fuel": "electric",
      "style": "built-in",
      "image": "w-cobalt-electric-product"
    },
    {
      "id": "platinum-gas",
      "name": "Platinum Gas",
      "tagline": "Built-in gas heat for larger terraces",
      "fuel": "gas",
      "style": "built-in",
      "image": "w-platinum-gas-300"
    },
    {
      "id": "tungsten-gas-builtin",
      "name": "Tungsten Gas",
      "tagline": "Built-in gas heat in matte black",
      "fuel": "gas",
      "style": "built-in",
      "image": "w-tungsten-gas-500"
    },
    {
      "id": "tungsten-freestanding-gas",
      "name": "Tungsten Portable",
      "tagline": "Freestanding gas heat, no wiring",
      "fuel": "gas",
      "style": "freestanding",
      "image": "w-tung-port"
    }
  ],
  "controls_images": {
    "controller": "w-affinity-dimmer-1ch-2",
    "switch": "w-manual-1ch-indoor-switch-image"
  },
  "shapes": [
    {
      "id": "rect",
      "name": "Rectangle"
    },
    {
      "id": "l",
      "name": "L-shape"
    },
    {
      "id": "u",
      "name": "U-shape or courtyard"
    },
    {
      "id": "narrow",
      "name": "Long and narrow"
    },
    {
      "id": "round",
      "name": "Round"
    }
  ]
};
