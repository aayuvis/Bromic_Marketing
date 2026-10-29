// A03 "How many heaters?" — pure sizing logic. No DOM, no I/O: every number comes from `cfg` (config.json).
// Tested by test.mjs; inlined into index.html by tools/build-config.mjs.

const val = (a) => (a && typeof a === 'object' && 'value' in a ? a.value : a);

export const ENCLOSURES = ['open', 'partial', 'covered'];
export const CLIMATES = ['mild', 'cool', 'cold'];
export const FUELS = ['electric', 'gas', 'any'];
export const STYLES = ['built-in', 'freestanding', 'any'];

export function defaults(cfg) {
  return {
    length_ft: 20, width_ft: 12, enclosure: 'partial', open_30: true, climate: 'cool',
    mount_height_ft: val(cfg.mounting.default_height_ft), fuel: 'any', style: 'any', zones: 1,
  };
}

// Clean and range-check raw form values. Returns {input, errors}.
export function normalise(raw, cfg) {
  const errors = {};
  const num = (k) => Number(String(raw[k] ?? '').replace(',', '.'));
  const min = val(cfg.limits.min_side_ft), max = val(cfg.limits.max_side_ft);
  const input = {
    length_ft: num('length_ft'),
    width_ft: num('width_ft'),
    enclosure: ENCLOSURES.includes(raw.enclosure) ? raw.enclosure : 'partial',
    open_30: raw.open_30 === true || raw.open_30 === 'yes',
    climate: CLIMATES.includes(raw.climate) ? raw.climate : 'cool',
    mount_height_ft: num('mount_height_ft'),
    fuel: FUELS.includes(raw.fuel) ? raw.fuel : 'any',
    style: STYLES.includes(raw.style) ? raw.style : 'any',
    zones: Math.max(1, Math.min(20, Math.round(num('zones')) || 1)),
  };
  for (const k of ['length_ft', 'width_ft']) {
    if (!Number.isFinite(input[k]) || input[k] < min || input[k] > max) errors[k] = `Enter a number from ${min} to ${max} ft.`;
  }
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
export function controlsBundle(controlsKey, count, zonesWanted, cfg) {
  const spec = cfg.controls[controlsKey];
  const perController = val(spec.max_heaters_per_controller);
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
  return (input.fuel === 'any' || p.fuel === input.fuel) && (input.style === 'any' || p.style === input.style);
}

export function size(rawInput, cfg) {
  const { input, errors } = normalise(rawInput, cfg);
  if (Object.keys(errors).length) return { ok: false, errors, input };

  const area = Math.round(input.length_ft * input.width_ft * 10) / 10;
  const warnings = [];
  const outdoor = !(input.enclosure === 'covered' && !input.open_30);
  if (!outdoor) {
    return {
      ok: true, input, area, outdoor: false, options: [], recommended: null, warnings: [],
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
      const w = val(p.watts);
      opt.load_kw = w ? Math.round(opt.count * w / 100) / 10 : null;
      opt.btu_each = val(p.btu) ?? null;
    }
    const n = opt.count ?? (opt.count_range ? opt.count_range[1] : 1);
    opt.controls = controlsBundle(p.controls, n, input.zones, cfg);
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
    ok: true, input, area, outdoor: true, factors: { ...factors, height: hf }, options, recommended, warnings,
    message: recommended ? null : 'No current model with confirmed coverage matches this preference yet. The Bromic design team will size it for you.',
  };
}
