// A20 "Five-year cost of patio heating" — pure TCO logic. No DOM, no I/O: every default comes from `cfg` (config.json).
// Tested by test.mjs; inlined into index.html by tools/build-config.mjs.
//
// Fuel cost per hour (writer brief; COM-CO-01):
//   electric     kW × $/kWh
//   natural gas  BTU/hr ÷ 100,000 × $/therm
//   propane      BTU/hr ÷ 91,500 × $/gal
// Five-year total per option = purchase + install + maintenance × years + fuel over the years (+ propane handling).

const val = (a) => (a && typeof a === 'object' && 'value' in a ? a.value : a);

export const OPTION_IDS = ['electric', 'natural_gas', 'propane'];
export const BASES = ['seats', 'ft2'];

export function defaults(cfg) {
  const d = {
    basis: 'seats',
    seats: val(cfg.space.default_seats),
    area_ft2: val(cfg.space.default_ft2),
    hours_per_year: val(cfg.operation.hours_per_year),
    average_output_pct: val(cfg.operation.average_output_pct),
    fuel_escalation_pct: val(cfg.operation.fuel_escalation_pct),
    price_kwh: val(cfg.prices.electric_per_kwh),
    price_therm: val(cfg.prices.natural_gas_per_therm),
    price_gal: val(cfg.prices.propane_per_gal),
    cylinder_gal: val(cfg.propane_handling.cylinder_gal),
    minutes_per_exchange: val(cfg.propane_handling.minutes_per_exchange),
    wage_per_hour: val(cfg.propane_handling.wage_per_hour),
  };
  for (const o of cfg.options) {
    d[`${o.id}_count`] = '';
    d[`${o.id}_purchase`] = val(o.purchase_per_heater);
    d[`${o.id}_install`] = val(o.install_per_heater);
    d[`${o.id}_maintenance`] = val(o.maintenance_per_heater_year);
  }
  return d;
}

const toNum = (x) => (x === '' || x == null ? NaN : Number(String(x).replace(/[,$\s]/g, '')));

// Clean and range-check raw form values. Returns {input, errors}. Blank `<id>_count` means "size it from the area".
export function normalise(raw, cfg) {
  const d = defaults(cfg);
  const r = { ...d, ...raw };
  const errors = {};
  const input = { basis: BASES.includes(r.basis) ? r.basis : 'seats' };
  const need = (k, min, max, msg) => {
    const n = toNum(r[k]);
    if (!Number.isFinite(n) || n < min || n > max) errors[k] = msg;
    input[k] = n;
  };
  if (input.basis === 'seats') { need('seats', 1, 5000, 'Enter seats from 1 to 5,000.'); input.area_ft2 = toNum(r.area_ft2); }
  else { need('area_ft2', 10, 100000, 'Enter an area from 10 to 100,000 ft².'); input.seats = toNum(r.seats); }
  need('hours_per_year', 0, 8760, 'Enter hours from 0 to 8,760 a year.');
  need('average_output_pct', 1, 100, 'Enter a percentage from 1 to 100.');
  need('fuel_escalation_pct', -20, 50, 'Enter a yearly change from -20% to 50%.');
  need('price_kwh', 0, 5, 'Enter a price from $0 to $5 per kWh.');
  need('price_therm', 0, 20, 'Enter a price from $0 to $20 per therm.');
  need('price_gal', 0, 20, 'Enter a price from $0 to $20 per gallon.');
  need('cylinder_gal', 0.5, 500, 'Enter usable gallons per cylinder from 0.5 to 500.');
  need('minutes_per_exchange', 0, 240, 'Enter minutes from 0 to 240.');
  need('wage_per_hour', 0, 500, 'Enter a wage from $0 to $500 an hour.');
  for (const o of cfg.options) {
    const c = r[`${o.id}_count`];
    if (c === '' || c == null) input[`${o.id}_count`] = null;
    else {
      const n = toNum(c);
      if (!Number.isInteger(n) || n < 1 || n > 500) errors[`${o.id}_count`] = 'Enter a whole number of heaters from 1 to 500, or leave it blank.';
      input[`${o.id}_count`] = n;
    }
    need(`${o.id}_purchase`, 0, 1e6, 'Enter a cost from $0.');
    need(`${o.id}_install`, 0, 1e6, 'Enter a cost from $0.');
    need(`${o.id}_maintenance`, 0, 1e5, 'Enter a cost from $0.');
  }
  return { input, errors };
}

export function heaterCount(areaFt2, coverageFt2) {
  if (!(coverageFt2 > 0) || !(areaFt2 > 0)) return null;
  return Math.max(1, Math.ceil(areaFt2 / coverageFt2 - 1e-9));
}

// Fuel units and dollars per hour for `count` heaters of option `o` at `outputPct` of rated input.
export function hourly(o, count, input, cfg) {
  const out = input.average_output_pct / 100;
  if (o.fuel === 'electric') {
    const units = val(o.input_kw) * count * out;
    return { units, unit: 'kWh', cost: units * input.price_kwh };
  }
  if (o.fuel === 'natural_gas') {
    const units = val(o.input_btu) * count * out / val(cfg.conversions.btu_per_therm);
    return { units, unit: 'therm', cost: units * input.price_therm };
  }
  if (o.fuel === 'propane') {
    const units = val(o.input_btu) * count * out / val(cfg.conversions.btu_per_gal_propane);
    return { units, unit: 'gal', cost: units * input.price_gal };
  }
  throw new Error(`unknown fuel ${o.fuel}`);
}

// Sum of a first-year amount over `years`, growing by `pct` each year after the first.
export function escalatedSum(firstYear, pct, years) {
  let t = 0;
  for (let i = 0; i < years; i++) t += firstYear * Math.pow(1 + pct / 100, i);
  return t;
}

// Cylinder swaps a year: usable gallons burned ÷ gallons per cylinder, rounded to whole swaps.
export function exchangesPerYear(gallons, cylinderGal) {
  return cylinderGal > 0 ? Math.round(gallons / cylinderGal) : 0;
}

export function tco(rawInput, cfg) {
  const { input, errors } = normalise(rawInput, cfg);
  if (Object.keys(errors).length) return { ok: false, errors, input };
  const years = val(cfg.tool.years);
  const area = input.basis === 'seats' ? input.seats * val(cfg.space.ft2_per_seat) : input.area_ft2;

  const options = cfg.options.map((o) => {
    const coverage = val(o.coverage_ft2);
    const sized = heaterCount(area, coverage);
    const count = input[`${o.id}_count`] ?? sized;
    const h = hourly(o, count, input, cfg);
    const annualUnits = h.units * input.hours_per_year;
    const fuelYear1 = h.cost * input.hours_per_year;
    const fuel = escalatedSum(fuelYear1, input.fuel_escalation_pct, years);
    let handling = null;
    if (o.fuel === 'propane') {
      const exchanges = exchangesPerYear(annualUnits, input.cylinder_gal);
      const perYear = exchanges * input.minutes_per_exchange / 60 * input.wage_per_hour;
      handling = { exchanges, hours: exchanges * input.minutes_per_exchange / 60, per_year: perYear, total: perYear * years };
    }
    const purchase = count * input[`${o.id}_purchase`];
    const install = count * input[`${o.id}_install`];
    const maintenance = count * input[`${o.id}_maintenance`] * years;
    const total = purchase + install + maintenance + fuel + (handling ? handling.total : 0);
    return {
      id: o.id, label: o.label, fuel: o.fuel, model: o.model, controls: o.controls,
      coverage_ft2: coverage, count, sized_count: sized, count_overridden: input[`${o.id}_count`] != null,
      rating: o.fuel === 'electric' ? `${val(o.input_kw)} kW` : `${val(o.input_btu).toLocaleString('en-US')} BTU/hr`,
      per_hour: h.cost, annual_units: annualUnits, unit: h.unit, fuel_year1: fuelYear1, fuel,
      handling, purchase, install, maintenance, total,
      running: fuel + (handling ? handling.total : 0) + maintenance,
      placeholder_costs: [o.purchase_per_heater, o.install_per_heater, o.maintenance_per_heater_year].some((a) => a.verified === false),
    };
  });
  const ranked = [...options].sort((a, b) => a.total - b.total);
  return {
    ok: true, input, years, area: Math.round(area * 10) / 10, options,
    cheapest: ranked[0].id, most_expensive: ranked[ranked.length - 1].id,
    spread: ranked[ranked.length - 1].total - ranked[0].total,
  };
}
