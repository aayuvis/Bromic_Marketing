// A03 "How many heaters?" — pure sizing logic. No DOM, no I/O: every number comes from `cfg` (config.json).
// Tested by test.mjs; inlined into index.html by tools/build-config.mjs.

const val = (a) => (a && typeof a === 'object' && 'value' in a ? a.value : a);

export const ENCLOSURES = ['open', 'partial', 'covered'];
export const CLIMATES = ['mild', 'cool', 'cold'];
export const FUELS = ['electric', 'gas', 'any'];
export const STYLES = ['built-in', 'freestanding', 'any'];
export const SHAPES = ['rect', 'l', 'u', 'narrow', 'round'];

// The space as rectangles (or a circle) in feet, top-left origin. Used for the area, the plan drawing and heater placement.
//   rect / narrow: length × width · l: main run + one arm down from its left end · u: back run + two arms down from both ends
//   round: diameter
export function shapeGeometry(i) {
  const L = i.length_ft, W = i.width_ft, aL = i.arm_l_ft, aW = i.arm_w_ft;
  if (i.shape === 'round') { const d = i.diameter_ft; return { rects: [], circle: { cx: d / 2, cy: d / 2, r: d / 2 }, bbox: { w: d, h: d }, area: round1(Math.PI * d * d / 4) }; }
  const rects = [{ x: 0, y: 0, w: L, h: W }];
  if (i.shape === 'l') rects.push({ x: 0, y: W, w: aW, h: aL });
  if (i.shape === 'u') rects.push({ x: 0, y: W, w: aW, h: aL }, { x: L - aW, y: W, w: aW, h: aL });
  const area = round1(rects.reduce((n, r) => n + r.w * r.h, 0));
  // For placing heaters, an L or U reads better as full-height columns at the arms plus the run between them,
  // so every arm gets its own heat.
  let parts = rects;
  if (i.shape === 'l') parts = [{ x: 0, y: 0, w: aW, h: W + aL }, { x: aW, y: 0, w: L - aW, h: W }];
  if (i.shape === 'u') parts = [{ x: 0, y: 0, w: aW, h: W + aL }, { x: aW, y: 0, w: L - 2 * aW, h: W }, { x: L - aW, y: 0, w: aW, h: W + aL }];
  parts = parts.filter((r) => r.w > 0 && r.h > 0);
  return { rects, parts, circle: null, bbox: { w: L, h: W + (i.shape === 'l' || i.shape === 'u' ? aL : 0) }, area };
}
const round1 = (n) => Math.round(n * 10) / 10;

// Spread n heaters over the space: each rectangle gets a share by area, then a grid that follows its proportions.
// A circle gets a ring (and a centre heater from seven up). Positions are in feet, for the plan drawing only.
export function placeHeaters(geom, n) {
  if (!n || n < 1) return [];
  if (geom.circle) {
    const { cx, cy, r } = geom.circle;
    if (n === 1) return [{ x: cx, y: cy }];
    const centre = n >= 7 ? 1 : 0; const ring = n - centre; const rr = r * (ring <= 4 ? 0.5 : 0.62);
    const pts = Array.from({ length: ring }, (_, k) => ({ x: round1(cx + rr * Math.cos(-Math.PI / 2 + (2 * Math.PI * k) / ring)), y: round1(cy + rr * Math.sin(-Math.PI / 2 + (2 * Math.PI * k) / ring)) }));
    return centre ? [{ x: cx, y: cy }, ...pts] : pts;
  }
  const parts = geom.parts || geom.rects;
  const total = parts.reduce((a, r) => a + r.w * r.h, 0);
  const share = parts.map((r) => (r.w * r.h) / total * n);
  // with enough heaters, every part gets at least one
  const counts = share.map((x) => (n >= parts.length ? Math.max(1, Math.floor(x)) : Math.floor(x)));
  while (counts.reduce((a, b) => a + b, 0) > n) { const i = counts.indexOf(Math.max(...counts)); counts[i]--; }
  let left = n - counts.reduce((a, b) => a + b, 0);
  share.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { counts[i]++; left--; } });
  const pts = [];
  parts.forEach((r, i) => {
    const k = counts[i]; if (!k) return;
    const cols = Math.max(1, Math.min(k, Math.round(Math.sqrt(k * r.w / r.h)))); const rows = Math.ceil(k / cols);
    for (let j = 0; j < k; j++) {
      const row = Math.floor(j / cols); const inRow = row === rows - 1 ? k - cols * (rows - 1) : cols; const col = j % cols;
      pts.push({ x: round1(r.x + r.w * (col + 0.5) / inRow), y: round1(r.y + r.h * (row + 0.5) / rows) });
    }
  });
  return pts;
}

export function defaults(cfg) {
  return {
    shape: 'rect', length_ft: 20, width_ft: 12, arm_l_ft: 10, arm_w_ft: 8, diameter_ft: 16, family: 'any',
    enclosure: 'partial', open_30: true, climate: 'cool',
    mount_height_ft: val(cfg.mounting.default_height_ft), fuel: 'any', style: 'any', zones: 1,
  };
}

// Clean and range-check raw form values. Returns {input, errors}.
export function normalise(raw, cfg) {
  const errors = {};
  const num = (k) => Number(String(raw[k] ?? '').replace(',', '.'));
  const min = val(cfg.limits.min_side_ft), max = val(cfg.limits.max_side_ft);
  const fam = (cfg.families || []).find((f) => f.id === raw.family);
  const input = {
    shape: SHAPES.includes(raw.shape) ? raw.shape : 'rect',
    family: fam ? fam.id : 'any',
    length_ft: num('length_ft'),
    width_ft: num('width_ft'),
    arm_l_ft: num('arm_l_ft'), arm_w_ft: num('arm_w_ft'), diameter_ft: num('diameter_ft'),
    enclosure: ENCLOSURES.includes(raw.enclosure) ? raw.enclosure : 'partial',
    open_30: raw.open_30 === true || raw.open_30 === 'yes',
    climate: CLIMATES.includes(raw.climate) ? raw.climate : 'cool',
    mount_height_ft: num('mount_height_ft'),
    fuel: FUELS.includes(raw.fuel) ? raw.fuel : 'any',
    style: STYLES.includes(raw.style) ? raw.style : 'any',
    zones: Math.max(1, Math.min(20, Math.round(num('zones')) || 1)),
  };
  // a chosen heater family sets the fuel and style
  if (fam) { input.fuel = fam.fuel; input.style = fam.style; }
  const need = input.shape === 'round' ? ['diameter_ft'] : input.shape === 'l' || input.shape === 'u' ? ['length_ft', 'width_ft', 'arm_l_ft', 'arm_w_ft'] : ['length_ft', 'width_ft'];
  for (const k of need) {
    if (!Number.isFinite(input[k]) || input[k] < min || input[k] > max) errors[k] = `Enter a number from ${min} to ${max} ft.`;
  }
  if (!errors.arm_w_ft && (input.shape === 'l' || input.shape === 'u') && input.arm_w_ft > (input.shape === 'u' ? input.length_ft / 2 : input.length_ft)) errors.arm_w_ft = input.shape === 'u' ? 'Each arm must be narrower than half the length.' : 'The arm must be narrower than the length.';
  if (input.style !== 'freestanding' && (!Number.isFinite(input.mount_height_ft) || input.mount_height_ft < 5 || input.mount_height_ft > 30)) {
    errors.mount_height_ft = 'Enter a mount height from 5 to 30 ft.';
  }
  return { input, errors };
}

export function heightFactor(heightFt, cfg) {
  const bands = val(cfg.mounting.height_bands);
  for (const b of bands) if (heightFt <= b.up_to_ft) return b.factor;
  return bands[bands.length - 1].factor;
}

// The coverage one heater gives in this space, after every derate.
export function effectiveCoverage(nominal, factors) {
  return nominal * factors.enclosure * factors.climate * factors.height * factors.layout;
}

export function heaterCount(areaFt2, effective) {
  if (!(effective > 0)) return null;
  return Math.max(1, Math.ceil(areaFt2 / effective - 1e-9));
}

// Controls bundle for `count` heaters of one family. Controls are always part of the recommendation.
export function controlsBundle(controlsKey, count, zonesWanted, cfg, watts = null) {
  const spec = cfg.controls[controlsKey];
  const kw = spec.max_kw_per_channel ? val(spec.max_kw_per_channel) : null;
  const perController = kw && watts ? Math.max(1, Math.floor(kw * 1000 / watts)) : val(spec.max_heaters_per_controller);
  const zones = Math.min(count, Math.max(zonesWanted, perController ? Math.ceil(count / perController) : 1));
  const items = spec.items.map((it) => ({
    name: it.name,
    qty: it.per === 'zone' ? zones : it.per === 'heater' ? count : 1,
    per: it.per,
  }));
  return {
    zones, items,
    app_note: cfg.controls.app_note,
    integration_note: cfg.controls.integration_note,
    capacity_verified: !!perController,
  };
}

function matches(p, input) {
  if (input.family && input.family !== 'any') return p.family === input.family;
  return (input.fuel === 'any' || p.fuel === input.fuel) && (input.style === 'any' || p.style === input.style);
}

export function size(rawInput, cfg) {
  const { input, errors } = normalise(rawInput, cfg);
  if (Object.keys(errors).length) return { ok: false, errors, input };

  const geom = shapeGeometry(input);
  const area = geom.area;
  const warnings = [];
  const outdoor = !(input.enclosure === 'covered' && !input.open_30);
  if (!outdoor) {
    return {
      ok: true, input, area, geom, outdoor: false, options: [], recommended: null, warnings: [], placement: [],
      message: `With less than ${val(cfg.outdoor_rule.min_open_perimeter_pct)}% of the perimeter permanently open, the space is not treated as outdoor. Outdoor heaters may not be suitable: talk to the Bromic design team before choosing.`,
    };
  }

  const builtInHeight = input.style !== 'freestanding';
  const factors = {
    enclosure: val(cfg.enclosure[input.enclosure].factor),
    climate: val(cfg.climate[input.climate].factor),
    height: 1,
    layout: val(cfg.layout.overlap_factor),
  };
  const hf = builtInHeight ? heightFactor(input.mount_height_ft, cfg) : 1;
  const minCeilFt = val(cfg.mounting.min_ceiling_mount_in) / 12;
  const minWallFt = val(cfg.mounting.min_wall_mount_in) / 12;
  if (builtInHeight && input.mount_height_ft < minCeilFt) {
    warnings.push(input.mount_height_ft < minWallFt
      ? `A mount height of ${input.mount_height_ft} ft is below Bromic's 2021 guidance for both wall mounts (${minWallFt} ft) and ceiling mounts (${minCeilFt} ft). A freestanding heater may suit better.`
      : `At ${input.mount_height_ft} ft, a ceiling mount is below Bromic's 2021 guidance of ${minCeilFt} ft; a wall mount (from ${minWallFt} ft) may work. Minimums vary with output.`);
  }
  if (builtInHeight && input.mount_height_ft > val(cfg.mounting.max_recommended_ft)) {
    warnings.push(`At ${input.mount_height_ft} ft, ask about a suspension pole to bring heaters down to an effective height.`);
  }
  if (area > val(cfg.limits.large_space_ft2)) {
    warnings.push(`At ${area} ft², this is a large space. Use the result as a starting point and let the design team lay it out.`);
  }

  const options = [];
  for (const p of cfg.products.filter((x) => matches(x, input))) {
    const cov = val(p.coverage_ft2);
    const f = { ...factors, height: p.style === 'built-in' ? hf : 1 };
    const opt = { id: p.id, family: p.family, name: p.name, fuel: p.fuel, style: p.style, status: p.status };
    if (p.status === 'unverified' || cov == null) {
      opt.count = null;
      opt.note = 'Coverage not yet confirmed. The Bromic design team sizes this model.';
    } else if (Array.isArray(cov)) {
      const lo = heaterCount(area, effectiveCoverage(cov[1], f));
      const hi = heaterCount(area, effectiveCoverage(cov[0], f));
      opt.count = null; opt.count_range = [lo, hi]; opt.coverage_nominal = cov;
      opt.note = 'Coming soon. Count depends on model and size.';
    } else {
      opt.coverage_nominal = cov;
      opt.coverage_effective = Math.round(effectiveCoverage(cov, f) * 10) / 10;
      opt.count = heaterCount(area, effectiveCoverage(cov, f));
      // A freestanding heater warms four seats at most (guests block its heat); seats = area ÷ ft² a seat.
      if (p.style === 'freestanding' && cfg.seating) {
        const bySeats = Math.ceil(area / val(cfg.seating.ft2_per_seat) / val(cfg.seating.freestanding_max_seats) - 1e-9);
        if (bySeats > opt.count) { opt.count = bySeats; opt.sized_by = 'seats'; }
      }
      const w = val(p.watts);
      opt.load_kw = w ? Math.round(opt.count * w / 100) / 10 : null;
      opt.btu_each = val(p.btu) ?? null;
    }
    const n = opt.count ?? (opt.count_range ? opt.count_range[1] : 1);
    opt.controls = controlsBundle(p.controls, n, input.zones, cfg, val(p.watts) ?? null);
    options.push(opt);
  }

  const rank = { current: 0, 'coming-soon': 1, unverified: 2 };
  options.sort((a, b) => rank[a.status] - rank[b.status]
    || (a.count ?? 1e9) - (b.count ?? 1e9)
    || (a.coverage_effective ?? 0) - (b.coverage_effective ?? 0));
  // Same count: the smaller heater first, so the lead option is the closest fit (e.g. the lowest Platinum wattage
  // that still needs no extra heater).
  const recommended = options.find((o) => o.status === 'current' && o.count != null) || null;

  return {
    ok: true, input, area, geom, outdoor: true, factors: { ...factors, height: hf }, options, recommended, warnings,
    placement: recommended ? placeHeaters(geom, recommended.count) : [],
    radius_ft: recommended && recommended.coverage_effective ? Math.round(Math.sqrt(recommended.coverage_effective / Math.PI) * 10) / 10 : null,
    message: recommended ? null : 'No current model with confirmed coverage matches this preference yet. The Bromic design team will size it for you.',
  };
}
