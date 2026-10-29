// Generated from config.json by tools/build-config.mjs — edit config.json, not this file.
export default {
  "_readme": "Every assumption the A20 five-year TCO model uses. An assumption is any object with a `value`: it carries unit, source, verified and owner, and a [[VERIFY]] note while verified is false. Purchase, install and maintenance figures are PLACEHOLDERS, not Bromic prices: the page labels them so. Edit this file, then run `node tools/build-config.mjs`.",
  "tool": {
    "asset_id": "A20",
    "matrix_cell": "COM-CO",
    "title": "Five-year cost of patio heating",
    "version": "0.1.0-draft",
    "years": {
      "value": 5,
      "unit": "years",
      "source": "Asset brief A20 (HANDOVER §8)",
      "verified": true,
      "verify": "",
      "owner": "Blake Petty"
    }
  },
  "cta": {
    "label": "Get your ROI assessment",
    "asset": "A21",
    "href": {
      "value": "../A21-roi/index.html",
      "unit": "url",
      "source": "Next-stage asset per data/journey-matrix.json (COM-CO → COM-IN, A21)",
      "verified": false,
      "verify": "[[VERIFY: live URL of the A21 ROI calculator — 454 Creative]]",
      "owner": "454 Creative"
    }
  },
  "space": {
    "ft2_per_seat": {
      "value": 15,
      "unit": "ft² of heated patio per seat",
      "source": "Rule-of-thumb placeholder for full-service patio dining; no published source read",
      "verified": false,
      "verify": "[[VERIFY: patio ft² per seat to use (and source) — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "default_seats": {
      "value": 40,
      "unit": "seats",
      "source": "Form default only",
      "verified": false,
      "verify": "[[VERIFY: default seat count shown in the form — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "default_ft2": {
      "value": 600,
      "unit": "ft²",
      "source": "Form default only",
      "verified": false,
      "verify": "[[VERIFY: default area shown in the form — Blake Petty]]",
      "owner": "Blake Petty"
    }
  },
  "operation": {
    "hours_per_year": {
      "value": 900,
      "unit": "heater hours per year",
      "source": "Placeholder: 6 hours a night × 150 nights",
      "verified": false,
      "verify": "[[VERIFY: typical heated hours per year by climate — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "average_output_pct": {
      "value": 100,
      "unit": "% of rated input, averaged over operating hours",
      "source": "Conservative default: heaters at full output whenever on. Dimmers and Eclipse 33/66/100% steps lower this",
      "verified": false,
      "verify": "[[VERIFY: typical average output with Affinity dimming — Mike Clifford]]",
      "owner": "Mike Clifford"
    },
    "fuel_escalation_pct": {
      "value": 0,
      "unit": "% per year applied to fuel prices",
      "source": "Default: flat prices; no forecast applied",
      "verified": false,
      "verify": "[[VERIFY: whether to apply an EIA STEO price outlook — Brian Kim/Finance]]",
      "owner": "Brian Kim"
    }
  },
  "prices": {
    "electric_per_kwh": {
      "value": 0.1354,
      "unit": "$/kWh",
      "source": "EIA Monthly Energy Review, Aug 2026, Figure 9.2: US commercial average retail electricity price, May 2026, 13.54¢/kWh (read from a search snippet; label order uncertain). https://www.eia.gov/totalenergy/data/monthly/ · cross-check EIA Electric Power Monthly Table 5.6.A https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a",
      "verified": false,
      "verify": "[[VERIFY: 2026 commercial $/kWh from EIA EPM Table 5.6.A, national and by state — Brian Kim/Finance]]",
      "owner": "Brian Kim"
    },
    "natural_gas_per_therm": {
      "value": 0.87,
      "unit": "$/therm",
      "source": "EIA Natural Gas Prices (US commercial), Jan–May 2026 average $9.03 per thousand cubic feet (9.03, 9.42, 9.72, 8.18, 8.81) ÷ 10.36 therms per Mcf. https://www.eia.gov/dnav/ng/ng_pri_sum_dcu_nus_m.htm",
      "verified": false,
      "verify": "[[VERIFY: 2026 commercial $/therm and the Mcf→therm heat content used — Brian Kim/Finance]]",
      "owner": "Brian Kim"
    },
    "propane_per_gal": {
      "value": 2.674,
      "unit": "$/gal",
      "source": "EIA Heating Oil and Propane Update, week of 30 Mar 2026: US average RESIDENTIAL propane $2.674/gal (EIA publishes no commercial series; cylinder-exchange prices run higher). https://www.eia.gov/petroleum/heatingoilpropane/",
      "verified": false,
      "verify": "[[VERIFY: commercial propane or cylinder-exchange $/gal operators actually pay — Brian Kim/Finance]]",
      "owner": "Brian Kim"
    }
  },
  "conversions": {
    "btu_per_therm": {
      "value": 100000,
      "unit": "BTU/therm",
      "source": "Definition of the therm; writer brief running-cost formula",
      "verified": true,
      "verify": "",
      "owner": "Brian Kim"
    },
    "btu_per_gal_propane": {
      "value": 91500,
      "unit": "BTU/gal",
      "source": "Writer brief running-cost formula (approx. heat content of propane)",
      "verified": false,
      "verify": "[[VERIFY: propane heat content to standardise on (91,500 vs 91,452 BTU/gal) — Brian Kim]]",
      "owner": "Brian Kim"
    },
    "therms_per_mcf": {
      "value": 10.36,
      "unit": "therms per thousand cubic feet",
      "source": "Approx. US average heat content of delivered natural gas, about 1,036 BTU/ft³ (EIA)",
      "verified": false,
      "verify": "[[VERIFY: current EIA heat content of natural gas delivered to consumers — Brian Kim]]",
      "owner": "Brian Kim"
    }
  },
  "propane_handling": {
    "cylinder_gal": {
      "value": 4.7,
      "unit": "gal per cylinder exchange",
      "source": "Derived: 20 lb cylinder ÷ about 4.24 lb per gallon. Many exchange cylinders are filled to 15 lb (about 3.5 gal)",
      "verified": false,
      "verify": "[[VERIFY: cylinder size used by Tungsten Freestanding Gas and the usable fill — Mike Clifford]]",
      "owner": "Mike Clifford"
    },
    "minutes_per_exchange": {
      "value": 10,
      "unit": "staff minutes per cylinder swap",
      "source": "Placeholder: swap, leak check, storage cage, paperwork",
      "verified": false,
      "verify": "[[VERIFY: staff minutes per cylinder exchange from operators — Blake Petty]]",
      "owner": "Blake Petty"
    },
    "wage_per_hour": {
      "value": 15.71,
      "unit": "$/hour",
      "source": "BLS OEWS May 2024 median for Dining Room and Cafeteria Attendants and Bartender Helpers (35-9011), via O*NET OnLine. https://www.onetonline.org/link/localwages/35-9011.00. Unloaded: add payroll burden if wanted",
      "verified": true,
      "verify": "",
      "owner": "Blake Petty"
    }
  },
  "options": [
    {
      "id": "electric",
      "label": "Electric",
      "fuel": "electric",
      "model": "Platinum Smart-Heat Electric 4500W",
      "controls": "Affinity Smart-Heat Dimmer or On/Off controller and a wall switch per zone; Bromic Smart-Heat app",
      "coverage_ft2": {
        "value": 143,
        "unit": "ft² per heater",
        "source": "Lookbook 2026 p.21 (top of 65–143 ft² range mapped to 4500W)",
        "verified": false,
        "verify": "[[VERIFY: 4500W coverage — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "input_kw": {
        "value": 4.5,
        "unit": "kW per heater",
        "source": "Lookbook 2026 p.21 (4500W)",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "purchase_per_heater": {
        "value": 2500,
        "unit": "$ per heater incl. controls share",
        "source": "PLACEHOLDER, not a Bromic price",
        "verified": false,
        "verify": "[[VERIFY: commercial price per heater incl. Affinity controls — Blake Petty]]",
        "owner": "Blake Petty"
      },
      "install_per_heater": {
        "value": 900,
        "unit": "$ per heater (circuit, mounting, labour)",
        "source": "PLACEHOLDER",
        "verified": false,
        "verify": "[[VERIFY: typical installed cost per electric heater — Blake Petty]]",
        "owner": "Blake Petty"
      },
      "maintenance_per_heater_year": {
        "value": 25,
        "unit": "$ per heater per year",
        "source": "PLACEHOLDER",
        "verified": false,
        "verify": "[[VERIFY: annual maintenance per electric heater — Blake Petty]]",
        "owner": "Blake Petty"
      }
    },
    {
      "id": "natural_gas",
      "label": "Natural gas",
      "fuel": "natural_gas",
      "model": "Tungsten Smart-Heat Freestanding Gas (natural gas)",
      "controls": "[[VERIFY: control options for Tungsten Freestanding Gas — Mike Clifford]]",
      "coverage_ft2": {
        "value": 215,
        "unit": "ft² per heater",
        "source": "Lookbook 2026 p.39",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "input_btu": {
        "value": 38000,
        "unit": "BTU/hr per heater",
        "source": "Lookbook 2026 p.39 (freestanding; built-in gas BTU is not published)",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "purchase_per_heater": {
        "value": 3000,
        "unit": "$ per heater",
        "source": "PLACEHOLDER, not a Bromic price",
        "verified": false,
        "verify": "[[VERIFY: commercial price per gas heater — Blake Petty]]",
        "owner": "Blake Petty"
      },
      "install_per_heater": {
        "value": 1500,
        "unit": "$ per heater (gas line, fitter)",
        "source": "PLACEHOLDER",
        "verified": false,
        "verify": "[[VERIFY: typical installed cost per natural-gas heater — Blake Petty]]",
        "owner": "Blake Petty"
      },
      "maintenance_per_heater_year": {
        "value": 100,
        "unit": "$ per heater per year",
        "source": "PLACEHOLDER",
        "verified": false,
        "verify": "[[VERIFY: annual service per gas heater — Blake Petty]]",
        "owner": "Blake Petty"
      }
    },
    {
      "id": "propane",
      "label": "Propane",
      "fuel": "propane",
      "model": "Tungsten Smart-Heat Freestanding Gas (propane)",
      "controls": "[[VERIFY: control options for Tungsten Freestanding Gas — Mike Clifford]]",
      "coverage_ft2": {
        "value": 215,
        "unit": "ft² per heater",
        "source": "Lookbook 2026 p.39",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "input_btu": {
        "value": 38000,
        "unit": "BTU/hr per heater",
        "source": "Lookbook 2026 p.39",
        "verified": false,
        "verify": "[[VERIFY: sign-off of product-facts.json — Mike Clifford]]",
        "owner": "Mike Clifford"
      },
      "purchase_per_heater": {
        "value": 3000,
        "unit": "$ per heater",
        "source": "PLACEHOLDER, not a Bromic price",
        "verified": false,
        "verify": "[[VERIFY: commercial price per gas heater — Blake Petty]]",
        "owner": "Blake Petty"
      },
      "install_per_heater": {
        "value": 0,
        "unit": "$ per heater",
        "source": "PLACEHOLDER: freestanding on cylinders, no fixed install",
        "verified": false,
        "verify": "[[VERIFY: set-up cost for propane freestanding heaters — Blake Petty]]",
        "owner": "Blake Petty"
      },
      "maintenance_per_heater_year": {
        "value": 100,
        "unit": "$ per heater per year",
        "source": "PLACEHOLDER",
        "verified": false,
        "verify": "[[VERIFY: annual service per propane heater — Blake Petty]]",
        "owner": "Blake Petty"
      }
    }
  ],
  "notes": {
    "scope": "Excludes electricity demand charges, utility connection fees, financing, tax and resale value. Prices are national averages; your utility bill is the better input.",
    "controls": "Every option needs its controls to run as a complete system. Wi-Fi and app features require compatible Affinity Smart-Heat controls, sold separately.",
    "code": "Confirm every installation with your local building authority and a licensed electrician or gas fitter (US: NFPA 70 for electric, NFPA 54 for gas).",
    "code_source_url": "https://www.nfpa.org/codes-and-standards/nfpa-54-standard-development/54"
  }
};
