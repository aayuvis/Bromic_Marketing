// node tools/A03-sizing/test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { size, heaterCount, effectiveCoverage, controlsBundle, heightFactor, shapeGeometry, placeHeaters } from './logic.js';

const cfg = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
const base = { length_ft: 20, width_ft: 12, enclosure: 'partial', open_30: 'yes', climate: 'mild', mount_height_ft: 9, fuel: 'any', style: 'any', zones: 1 };

test('1. 20 × 12 ft, partially covered, mild, any heater: counts per model, closest fit leads', () => {
  const r = size(base, cfg);
  assert.equal(r.ok, true);
  assert.equal(r.area, 240);
  // 240 ft² ÷ 215 (Tungsten Freestanding Gas, factors 1.0) = 1.12 → 2, raised to 3 by the four-seat rule; ÷ 143 → 2; ÷ 121 → 2; ÷ 104 → 3; ÷ 65 → 4
  const byId = Object.fromEntries(r.options.map((o) => [o.id, o]));
  assert.equal(byId['tungsten-freestanding-gas'].count, 3);   // by area 2, but 240 ft² ÷ 20 = 12 seats ÷ 4 = 3 (calculation model)
  assert.equal(byId['eclipse-freestanding'].count, 3);
  assert.equal(byId['platinum-electric-4500'].count, 2);
  assert.equal(byId['eclipse-electric'].count, 2);
  assert.equal(byId['platinum-electric-3400'].count, 3);
  assert.equal(byId['platinum-electric-2300'].count, 4);
  // Recessed is the default mount, so a recessable heater leads; ties at 2: the closest fit (smallest heater) leads.
  assert.equal(r.recommended.id, 'platinum-electric-4500');
  assert.equal(byId['platinum-electric-4500'].load_kw, 9);
});

test('2. Cold, open, electric built-in at 11 ft: every derate applies and controls are always in the result', () => {
  const r = size({ ...base, enclosure: 'open', climate: 'cold', fuel: 'electric', style: 'built-in', mount_height_ft: 11, zones: 2 }, cfg);
  // effective 4500W = 143 × 0.85 × 0.7 × 0.9 × 1.0 = 76.58 → 240/76.58 = 3.13 → 4
  const p45 = r.options.find((o) => o.id === 'platinum-electric-4500');
  assert.equal(p45.coverage_effective, 76.6);
  assert.equal(p45.count, 4);
  assert.ok(r.options.every((o) => o.fuel === 'electric' && o.style === 'built-in'));
  for (const o of r.options) {
    assert.ok(o.controls.items.length >= 1, `${o.id} has controls`);
    assert.match(o.controls.app_note, /sold separately/);
  }
  const ctl = p45.controls.items.find((i) => /Affinity/.test(i.name));
  // A 6 kW Affinity channel takes one 4500 W heater (bromic.com controller page), so 4 heaters need 4 channels, never fewer than the 2 zones asked for.
  assert.equal(ctl.qty, 4, 'one channel per 6 kW of heaters');
  assert.equal(controlsBundle('affinity', 4, 1, cfg, 2300).zones, 2, 'two 2300 W heaters share a 6 kW channel');
  // Coming-soon Tungsten collections are shown as a range and labelled, never as the recommendation.
  const coastal = r.options.find((o) => o.id === 'tungsten-electric-coastal');
  assert.equal(coastal.status, 'coming-soon');
  assert.deepEqual(coastal.count_range, [4, 8]); // 240 ÷ (144 or 64 × 0.5355)
  assert.notEqual(r.recommended.status, 'coming-soon');
});

test('3. Covered with less than 30% open: not an outdoor space, no heater count', () => {
  const r = size({ ...base, enclosure: 'covered', open_30: 'no' }, cfg);
  assert.equal(r.ok, true);
  assert.equal(r.outdoor, false);
  assert.equal(r.recommended, null);
  assert.match(r.message, /30%/);
});

test('4. Gas + built-in: sized from bromic.com coverage, no Tungsten gas BTU shown, On/Off control', () => {
  const r = size({ ...base, fuel: 'gas', style: 'built-in' }, cfg);
  assert.ok(r.recommended && r.recommended.fuel === 'gas');
  assert.ok(r.options.length >= 4 && r.options.every((o) => o.count >= 1));
  assert.ok(r.options.filter((o) => o.id.startsWith('tungsten-gas-builtin')).every((o) => o.btu_each == null), 'Tungsten gas BTU stays unpublished');
  assert.ok(r.options.every((o) => o.controls.items.some((i) => /On\/Off/.test(i.name))), 'gas runs on On/Off, no dimming');
});

test('5. Guard rails and helpers: bad sizes rejected, low mount warned, freestanding ignores height', () => {
  assert.equal(size({ ...base, length_ft: 'abc' }, cfg).ok, false);
  assert.equal(size({ ...base, width_ft: 0 }, cfg).ok, false);
  const low = size({ ...base, mount_height_ft: 7 }, cfg);
  assert.ok(low.warnings.some((w) => /ceiling mount/.test(w)));
  const fs = size({ ...base, style: 'freestanding', mount_height_ft: '' }, cfg);
  assert.equal(fs.ok, true);
  assert.ok(fs.options.every((o) => o.style === 'freestanding'));
  assert.equal(heaterCount(100, 100), 1);
  assert.equal(heaterCount(100.01, 100), 2);
  assert.equal(heaterCount(10, 0), null);
  assert.equal(effectiveCoverage(100, { enclosure: 1, climate: 0.5, height: 1, layout: 1 }), 50);
  assert.equal(heightFactor(13, cfg), 0.8);
  assert.equal(controlsBundle('affinity', 3, 5, cfg).zones, 3, 'never more zones than heaters');
});

test('6. Shapes: areas, and placement puts every heater inside the space (every arm of an L or U gets heat)', () => {
  const g = (o) => shapeGeometry({ length_ft: 22, width_ft: 10, arm_l_ft: 12, arm_w_ft: 10, diameter_ft: 18, ...o });
  assert.equal(g({ shape: 'rect' }).area, 220);
  assert.equal(g({ shape: 'l' }).area, 340);
  assert.equal(g({ shape: 'u', length_ft: 28, arm_w_ft: 9 }).area, 496);
  assert.equal(g({ shape: 'round' }).area, 254.5);
  for (const shape of ['rect', 'l', 'u', 'narrow', 'round']) {
    const geom = g({ shape, length_ft: 28, arm_w_ft: 9 });
    for (let n = 1; n <= 9; n++) {
      const pts = placeHeaters(geom, n);
      assert.ok(pts.length >= n && pts.length <= n + 3, `${shape} ${n}: ${pts.length}`);
      if (n <= 2) assert.equal(pts.length, n, `${shape} ${n}: one or two heaters are never rounded up`);
      // symmetric: every heater has a mirror image across the space's centre line (an L has no mirror axis)
      if (shape !== 'l') {
        const W = geom.circle ? geom.circle.r * 2 : geom.bbox.w;
        for (const p of pts) assert.ok(pts.some((q) => Math.abs(q.x - (W - p.x)) < 0.15 && Math.abs(q.y - p.y) < 0.15), `${shape} ${n}: heater at ${p.x},${p.y} has no mirror`);
      }
      for (const p of pts) {
        const inside = geom.circle ? Math.hypot(p.x - geom.circle.cx, p.y - geom.circle.cy) <= geom.circle.r
          : geom.rects.some((q) => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        assert.ok(inside, `${shape} ${n} heater at ${p.x},${p.y} is outside`);
      }
    }
  }
  const u = placeHeaters(g({ shape: 'u', length_ft: 28, arm_w_ft: 9 }), 3);
  assert.ok(u.some((p) => p.x < 9) && u.some((p) => p.x > 19), 'both arms of the U get a heater');
});

test('8. Rows stay even: 3 heaters in 20 × 12 ft sit in one row, 7 in 40 × 20 ft become 2 rows of 4, wall mount pairs', () => {
  const g = shapeGeometry({ shape: 'rect', length_ft: 20, width_ft: 12 });
  const three = placeHeaters(g, 3);
  assert.equal(new Set(three.map((p) => p.y)).size, 1, 'one row');
  const big = placeHeaters(shapeGeometry({ shape: 'rect', length_ft: 40, width_ft: 20 }), 7);
  assert.equal(big.length, 8);
  const ys = [...new Set(big.map((p) => p.y))]; assert.equal(ys.length, 2);
  assert.equal(big.filter((p) => p.y === ys[0]).length, 4);
  const wall = placeHeaters(g, 3, 'wall');
  assert.equal(wall.length, 4); assert.equal(new Set(wall.map((p) => p.y)).size, 2);
});

test('9. Recessed by default, Affinity Dimmer for electric, On/Off for gas', () => {
  const r = size(base, cfg);
  assert.equal(r.input.mount, 'recessed');
  assert.equal(r.recommended.mount, 'recessed');
  assert.match(r.recommended.family, /platinum-electric/);
  assert.ok(r.recommended.controls.items.some((i) => /Dimmer/.test(i.name)));
  const wall = size({ ...base, mount: 'wall' }, cfg);
  assert.equal(wall.recommended.mount, 'wall');
  const gas = size({ ...base, fuel: 'gas', style: 'built-in' }, cfg);
  assert.equal(gas.recommended.mount, 'ceiling', 'gas does not recess');
  assert.ok(gas.recommended.controls.items.every((i) => !/Dimmer/.test(i.name)));
});

test('7. A chosen heater family sizes only that family, and the result carries the plan', () => {
  const r = size({ ...base, shape: 'l', arm_l_ft: 10, arm_w_ft: 8, family: 'eclipse-electric' }, cfg);
  assert.equal(r.area, 320);
  assert.ok(r.options.every((o) => o.family === 'eclipse-electric'));
  assert.equal(r.placement.length, r.recommended.count);
  assert.ok(r.radius_ft > 0);
  const bad = size({ ...base, shape: 'u', arm_w_ft: 11 }, cfg);
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.arm_w_ft);
});
