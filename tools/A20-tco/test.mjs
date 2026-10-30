// node tools/A20-tco/test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { tco, defaults, heaterCount, escalatedSum, exchangesPerYear, seasonHours, venueProfile, pricesFor } from './logic.js';

const cfg = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (±${tol})`);

// COM-CO-01's worked example: its own rates, 1,000 h, $25/h loaded labour, fuel and handling only.
const article = {
  ...defaults(cfg),
  hours_per_year: 1000, average_output_pct: 100, fuel_escalation_pct: 0,
  price_kwh: 0.1407, price_therm: 1.01, price_gal: 2.46,
  cylinder_gal: 4.7, minutes_per_exchange: 10, wage_per_hour: 25,
  electric_count: 6, natural_gas_count: 4, propane_count: 4,
  electric_purchase: 0, electric_install: 0, electric_maintenance: 0,
  natural_gas_purchase: 0, natural_gas_install: 0, natural_gas_maintenance: 0,
  propane_purchase: 0, propane_install: 0, propane_maintenance: 0,
};

test('1. COM-CO-01 five-year example: fuel and propane handling reproduce the article', () => {
  const r = tco(article, cfg);
  assert.equal(r.ok, true);
  const o = Object.fromEntries(r.options.map((x) => [x.id, x]));
  // Electric: 27 kW × 1,000 h = 27,000 kWh × $0.1407 = $3,799 a year; $18,995 over five
  near(o.electric.annual_units, 27000, 1e-6, 'electric kWh');
  near(o.electric.fuel_year1, 3799, 0.5, 'electric a year');
  near(o.electric.fuel, 18995, 0.5, 'electric five years');
  // Natural gas: 4 × 0.38 therm × 1,000 h = 1,520 therms × $1.01 = $1,535 a year; $7,676 over five
  near(o.natural_gas.annual_units, 1520, 1e-6, 'therms');
  near(o.natural_gas.fuel_year1, 1535, 0.5, 'gas a year');
  near(o.natural_gas.fuel, 7676, 0.5, 'gas five years');
  // Propane: 1,661 gal × $2.46 = $4,086 a year; the article multiplies the rounded $4,086 by 5 = $20,430
  near(o.propane.annual_units, 1661, 0.5, 'gallons');
  near(o.propane.fuel_year1, 4086, 1, 'propane a year');
  near(o.propane.fuel, 20430, 5, 'propane five years');
  // About 353 swaps × 10 min × $25/h = $1,471 a year; $7,354 over five
  assert.equal(o.propane.handling.exchanges, 353);
  near(o.propane.handling.per_year, 1471, 0.5, 'handling a year');
  near(o.propane.handling.total, 7354, 0.5, 'handling five years');
  // Fuel plus handling: $18,995 / $7,676 / $27,784
  near(o.electric.total, 18995, 0.5, 'electric total');
  near(o.natural_gas.total, 7676, 0.5, 'gas total');
  near(o.propane.total, 27784, 5, 'propane total');
  assert.equal(r.cheapest, 'natural_gas');
  assert.equal(r.most_expensive, 'propane');
});

test('2. Heater counts come from the area unless overridden: 858 ft² → 6 electric, 4 gas; 40 seats × 15 ft² → 5 and 3', () => {
  const r = tco({ ...defaults(cfg), basis: 'ft2', area_ft2: 858 }, cfg);
  const o = Object.fromEntries(r.options.map((x) => [x.id, x]));
  assert.equal(o.electric.count, 6);
  assert.equal(o.natural_gas.count, 4);
  assert.equal(o.propane.count, 4);
  const s = tco(defaults(cfg), cfg);
  assert.equal(s.area, 600);
  assert.deepEqual(s.options.map((x) => x.count), [5, 3, 3]);
  assert.equal(heaterCount(143.01, 143), 2);
  assert.equal(heaterCount(0, 143), null);
});

test('3. Config defaults: purchase, install and maintenance are added per heater, flagged as placeholders, and every option names its controls', () => {
  const r = tco(defaults(cfg), cfg);
  const e = r.options.find((x) => x.id === 'electric');
  // 5 heaters × ($2,500 + $900) + 5 × $25 × 5 + 4.5 × 5 kW × 900 h × $0.1354 × 5
  const fuel = 4.5 * 5 * 900 * 0.1354 * 5;
  near(e.total, 5 * 2500 + 5 * 900 + 5 * 25 * 5 + fuel, 1e-6, 'electric total');
  assert.ok(r.options.every((x) => x.placeholder_costs), 'placeholder costs are flagged');
  assert.ok(r.options.every((x) => typeof x.controls === 'string' && x.controls.length > 0), 'controls named');
  assert.match(e.controls, /Affinity/);
  // Propane handling is counted from the config's cylinder, minutes and wage.
  const p = r.options.find((x) => x.id === 'propane');
  const gal = 3 * 38000 / 91500 * 900;
  assert.equal(p.handling.exchanges, Math.round(gal / 4.7));
  near(p.handling.per_year, p.handling.exchanges * 10 / 60 * 15.71, 1e-9, 'handling');
});

test('4. Escalation compounds fuel, not handling; dimming scales fuel', () => {
  const base = tco(article, cfg);
  const up = tco({ ...article, fuel_escalation_pct: 3 }, cfg);
  const b = base.options[0], u = up.options[0];
  near(u.fuel, b.fuel_year1 * (1 + 1.03 + 1.03 ** 2 + 1.03 ** 3 + 1.03 ** 4), 1e-6, 'escalated electric');
  near(escalatedSum(100, 0, 5), 500, 1e-9, 'flat');
  assert.equal(up.options[2].handling.total, base.options[2].handling.total);
  const half = tco({ ...article, average_output_pct: 50 }, cfg);
  near(half.options[1].fuel, base.options[1].fuel / 2, 1e-6, 'half output halves gas');
  assert.equal(exchangesPerYear(10, 0), 0);
});

test('5. Guard rails: bad numbers are rejected with a message per field', () => {
  const r = tco({ ...article, hours_per_year: -1, price_kwh: 'abc', electric_count: 0, propane_count: 2.5 }, cfg);
  assert.equal(r.ok, false);
  for (const k of ['hours_per_year', 'price_kwh', 'electric_count', 'propane_count']) assert.ok(r.errors[k], k);
  assert.equal(tco({ ...defaults(cfg), basis: 'ft2', area_ft2: '' }, cfg).ok, false);
  assert.equal(tco({ ...defaults(cfg), basis: 'seats', seats: 40, area_ft2: '' }, cfg).ok, true, 'area ignored on seats basis');
});

const P = JSON.parse(readFileSync(new URL('./state-prices.json', import.meta.url), 'utf8'));

test('6. Season: months, days a week and hours a day set the hours a year', () => {
  const octApr = [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1].map(Boolean);
  assert.equal(seasonHours(octApr, 7, 5), 212 * 5);
  assert.equal(seasonHours(octApr, 6, 5), Math.round(212 * 6 / 7 * 5));
  const r = tco({ ...defaults(cfg), months: '111100000111', nights_per_week: 7, hours_per_night: 5 }, cfg);
  assert.equal(r.input.hours_per_year, 1060);
  const none = tco({ ...defaults(cfg), months: '000000000000', nights_per_week: 7, hours_per_night: 5 }, cfg);
  assert.equal(none.ok, false);
  assert.ok(none.errors.months);
  // every venue profile is a usable season
  for (const v of cfg.venues) {
    const p = venueProfile(v.id, cfg);
    assert.ok(p.seats > 0 && p.months.length === 12 && p.months.some(Boolean) && p.nights_per_week >= 1 && p.hours_per_night > 0, v.id);
  }
});

test('7. State prices: every state has all three prices, each from the state or a named fallback', () => {
  assert.equal(Object.keys(P.states).length, 51);
  for (const [k, s] of Object.entries(P.states)) {
    for (const f of ['kwh', 'therm', 'gal']) assert.ok(s[f] > 0 && s[f] < 10, `${k} ${f}`);
    assert.ok(s.gal_from === 'state' || /PADD|US average/.test(s.gal_from), `${k} propane source`);
  }
  for (const f of ['kwh', 'therm', 'gal']) assert.match(P.sources[f].label, /^EIA /);
  assert.equal(pricesFor('CA', P, cfg).kwh, P.states.CA.kwh);
  assert.equal(pricesFor('ZZ', P, cfg).kwh, P.US.kwh);
});

test('8. Running totals end at the five-year total; a payback year is found where the lines cross', () => {
  const r = tco({ ...defaults(cfg), months: '111100000111', nights_per_week: 6, hours_per_night: 5 }, cfg);
  for (const o of r.options) {
    assert.equal(o.series.length, r.years + 1);
    assert.ok(Math.abs(o.series[r.years] - o.total) < 0.01, o.id);
    assert.equal(o.series[0], o.purchase + o.install);
  }
  for (const c of r.crossovers) {
    const a = r.options.find((o) => o.id === c.a), b = r.options.find((o) => o.id === c.b);
    assert.ok(a.series[0] > b.series[0] && a.total < b.total && c.year > 0 && c.year <= r.years);
  }
});
