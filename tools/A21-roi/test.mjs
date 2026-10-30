// node tools/A21-roi/test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { roi, defaults, paybackMonths, seasonNights, autoHeaters, venueProfile } from './logic.js';

const cfg = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (±${tol})`);

test('1. COM-IN-01 worked example: $81,000 revenue, $24,300 margin, $1,330 running, about 18.3 months', () => {
  const r = roi(defaults(cfg), cfg); // the config defaults ARE the article's inputs (templates/calculation-model.md)
  assert.equal(r.ok, true);
  near(r.revenue, 81000, 1e-6, 'added revenue'); // 40 × 1.5 × $45 × 60 × 0.5
  near(r.margin, 24300, 1e-6, 'added margin'); // × 30%
  near(r.kwh, 9450, 1e-9, 'kWh'); // 7 × 4.5 kW × 5 h × 60
  near(r.running, 1330, 0.5, 'running cost'); // × $0.1407 = $1,329.62
  near(r.net, 22970, 0.5, 'net annual gain');
  near(r.payback_months, 18.3, 0.05, 'payback'); // $35,000 ÷ $1,914.2
  near(r.payback_on_margin_only, 17.3, 0.05, 'margin before running cost');
  near(r.payback_on_revenue, 5.2, 0.05, 'on revenue');
  assert.match(r.controls, /Affinity/);
});
test('2. COM-IN-01 sensitivity table: 25% → about 39 months, 75% → about 12', () => {
  const r = roi(defaults(cfg), cfg);
  const [lo, mid, hi] = r.sensitivity;
  near(lo.revenue, 40500, 1e-6, '25% revenue');
  near(lo.net, 10820, 0.5, '25% net');
  near(lo.payback_months, 38.8, 0.05, '25% payback');
  near(mid.payback_months, r.payback_months, 1e-9, '50% matches the main result');
  near(hi.revenue, 121500, 1e-6, '75% revenue');
  near(hi.net, 35120, 0.5, '75% net');
  near(hi.payback_months, 12.0, 0.05, '75% payback');
  near(r.capture_for_12_months, 74.8, 0.1, 'capture for a one-year payback');
});
test('3. No heaters to run, a different margin: running cost falls out, payback follows the margin', () => {
  const r = roi({ ...defaults(cfg), heaters: 0, margin_pct: 60, installed_cost: 48600 }, cfg);
  assert.equal(r.running, 0);
  near(r.margin, 48600, 1e-6, 'margin');
  near(r.payback_months, 12, 1e-9, 'exactly a year');
  near(r.capture_for_12_months, 50, 1e-9, 'capture needed for a one-year payback');
});

test('4. A gain that never pays back returns null, not a negative or infinite month count', () => {
  const r = roi({ ...defaults(cfg), heated_seats: 1, capture_pct: 1, margin_pct: 1, heaters: 10, hours_per_night: 10 }, cfg);
  assert.ok(r.net < 0);
  assert.equal(r.payback_months, null);
  assert.equal(r.capture_for_12_months, null);
  assert.equal(paybackMonths(1000, 0), null);
});

test('5. Guard rails: bad numbers are rejected per field', () => {
  const r = roi({ ...defaults(cfg), heated_seats: 0, capture_pct: 120, average_check: 'x', installed_cost: '' }, cfg);
  assert.equal(r.ok, false);
  for (const k of ['heated_seats', 'capture_pct', 'average_check', 'installed_cost']) assert.ok(r.errors[k], k);
  assert.equal(roi({ ...defaults(cfg), average_check: '$45', installed_cost: '30,000' }, cfg).ok, true, 'accepts $ and thousands separators');
});

test('6. Season, auto heaters and cost per heater: March and November, 7 days → 61 nights; 40 seats → 7 heaters; 7 × $5,000', () => {
  const marNov = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0].map(Boolean);
  assert.equal(seasonNights(marNov, 7), 61);
  assert.equal(seasonNights(marNov, 3.5), 31);
  assert.equal(autoHeaters(40, cfg), 7);   // 800 ft² ÷ (143 × 0.85) = 6.6
  const r = roi({ ...defaults(cfg), months: '001000000010', days_per_week: 7, heaters: '', installed_cost: '', installed_per_heater: 5000 }, cfg);
  assert.equal(r.ok, true);
  assert.equal(r.input.extra_nights, 61);
  assert.equal(r.input.heaters, 7);
  assert.equal(r.input.heaters_auto, true);
  assert.equal(r.input.installed_cost, 35000);
  // the cash curve starts at minus the installation and crosses zero at the payback month
  assert.equal(r.cash[0], -35000);
  const m = Math.ceil(r.payback_months);
  assert.ok(r.cash[m - 1] < 0 && r.cash[m] >= 0);
  near(r.cost_of_sales, r.revenue - r.margin, 0.01, 'cost of sales');
  const none = roi({ ...defaults(cfg), months: '000000000000', days_per_week: 7 }, cfg);
  assert.equal(none.ok, false);
  for (const v of cfg.venues) { const p = venueProfile(v.id, cfg); assert.ok(p.heated_seats > 0 && p.months.some(Boolean) && p.days_per_week >= 1, v.id); }
});
