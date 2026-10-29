// A21 "Patio heating payback" — pure ROI logic. No DOM, no I/O: every default comes from `cfg` (config.json).
// Tested by test.mjs; inlined into index.html by tools/build-config.mjs.
//
// The COM-IN-01 method:
//   added revenue  = heated seats × turns × average check × extra nights × capture rate
//   added margin   = added revenue × contribution (gross) margin
//   running cost   = heaters × kW × hours a night × extra nights × $/kWh
//   net annual gain = added margin − running cost
//   payback months = installed cost ÷ (net annual gain ÷ 12)

const val = (a) => (a && typeof a === 'object' && 'value' in a ? a.value : a);

export const FIELDS = {
  heated_seats: ['revenue', 1, 5000, 'Enter seats from 1 to 5,000.'],
  average_check: ['revenue', 0.01, 10000, 'Enter an average check above $0.'],
  turns_per_night: ['revenue', 0.1, 20, 'Enter turns from 0.1 to 20.'],
  extra_nights: ['revenue', 1, 366, 'Enter nights from 1 to 366.'],
  capture_pct: ['revenue', 1, 100, 'Enter a capture rate from 1% to 100%.'],
  margin_pct: ['revenue', 1, 100, 'Enter a margin from 1% to 100%.'],
  heaters: ['running', 0, 500, 'Enter heaters from 0 to 500.'],
  kw_per_heater: ['running', 0, 50, 'Enter kW from 0 to 50.'],
  hours_per_night: ['running', 0, 24, 'Enter hours from 0 to 24.'],
  price_kwh: ['running', 0, 5, 'Enter a price from $0 to $5 per kWh.'],
  installed_cost: ['investment', 1, 1e7, 'Enter an installed cost above $0.'],
};

export function defaults(cfg) {
  const d = {};
  for (const [k, [group]] of Object.entries(FIELDS)) d[k] = val(cfg[group][k]);
  return d;
}

const toNum = (x) => (x === '' || x == null ? NaN : Number(String(x).replace(/[,$%\s]/g, '')));

export function normalise(raw, cfg) {
  const r = { ...defaults(cfg), ...raw };
  const input = {}, errors = {};
  for (const [k, [, min, max, msg]] of Object.entries(FIELDS)) {
    const n = toNum(r[k]);
    if (!Number.isFinite(n) || n < min || n > max) errors[k] = msg;
    input[k] = n;
  }
  return { input, errors };
}

export const addedRevenue = (i) => i.heated_seats * i.turns_per_night * i.average_check * i.extra_nights * (i.capture_pct / 100);
export const runningCost = (i) => i.heaters * i.kw_per_heater * i.hours_per_night * i.extra_nights * i.price_kwh;
export const kwhPerYear = (i) => i.heaters * i.kw_per_heater * i.hours_per_night * i.extra_nights;

// Months to pay back `cost` from an annual gain; null when the gain never pays it back.
export function paybackMonths(cost, annualGain) {
  return annualGain > 0 ? cost / (annualGain / 12) : null;
}

export function evaluate(i) {
  const revenue = addedRevenue(i);
  const margin = revenue * i.margin_pct / 100;
  const running = runningCost(i);
  const net = margin - running;
  return {
    revenue, margin, running, kwh: kwhPerYear(i), net, monthly: net / 12,
    payback_months: paybackMonths(i.installed_cost, net),
    // The two other bases, shown so the reader can see why margin after running cost is used.
    payback_on_margin_only: paybackMonths(i.installed_cost, margin),
    payback_on_revenue: paybackMonths(i.installed_cost, revenue),
    covers: i.heated_seats * i.turns_per_night * i.extra_nights * (i.capture_pct / 100),
  };
}

export function roi(rawInput, cfg) {
  const { input, errors } = normalise(rawInput, cfg);
  if (Object.keys(errors).length) return { ok: false, errors, input };
  const result = evaluate(input);
  const sensitivity = val(cfg.sensitivity.capture_pcts).map((pct) => ({ capture_pct: pct, ...evaluate({ ...input, capture_pct: pct }) }));
  // The capture rate at which the heaters pay back within a year (null if not reachable at 100%).
  const perPct = (evaluate({ ...input, capture_pct: 1 }).margin);
  const capture_for_12_months = perPct > 0 ? (input.installed_cost + result.running) / perPct : null;
  return {
    ok: true, input, ...result, sensitivity,
    capture_for_12_months: capture_for_12_months != null && capture_for_12_months <= 100 ? capture_for_12_months : null,
    controls: cfg.running.controls, model: cfg.running.model,
  };
}
