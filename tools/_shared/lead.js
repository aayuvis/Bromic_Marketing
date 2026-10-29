// Shared lead gate for the Bromic tools (HANDOVER §9; spec in forms/hubspot-form-spec.md).
// Inlined into each tool's index.html by tools/build-config.mjs. The pure functions at the top are
// tested by tools/_shared/test.mjs; mountLeadGate() is the only part that touches the DOM.

export const ROLES = [
  { value: 'homeowner', label: 'Homeowner', professional: false },
  { value: 'architect_designer', label: 'Architect / designer', professional: true },
  { value: 'builder_installer', label: 'Builder / installer', professional: true },
  { value: 'commercial_operator', label: 'Commercial operator', professional: true },
  { value: 'dealer', label: 'Dealer', professional: true },
];
export const TIMINGS = [
  { value: '0_3_months', label: '0–3 months' },
  { value: '3_6_months', label: '3–6 months' },
  { value: '6_12_months', label: '6–12 months' },
  { value: 'researching', label: 'Researching' },
];
export const SIZE_UNITS = [
  { value: 'homes', label: 'No. of homes' },
  { value: 'seats', label: 'Seats' },
  { value: 'ft2', label: 'ft²' },
];
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
export const MATRIX_CELL = /^(RES|ARC|BLD|COM)-(AW|CO|IN|PP|BY)$/;

export function isProfessional(role) {
  const r = ROLES.find((x) => x.value === role);
  return !!(r && r.professional);
}

// UTM values and an optional matrix_cell override, read from the page URL's query string.
export function readTracking(search, defaultCell) {
  const q = new URLSearchParams(search || '');
  const out = {};
  for (const k of UTM_KEYS) out[k] = (q.get(k) || '').slice(0, 200);
  const cell = (q.get('matrix_cell') || '').toUpperCase();
  out.matrix_cell = MATRIX_CELL.test(cell) ? cell : defaultCell;
  return out;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL = /^[A-Za-z0-9][A-Za-z0-9 \-]{1,9}$/; // US ZIP, CA, UK, AU, EU postcodes

// Returns {field: message} for every invalid field; {} when the form can be sent.
export function validateLead(v) {
  const e = {};
  if (!String(v.firstname || '').trim()) e.firstname = 'Enter your first name.';
  if (!String(v.lastname || '').trim()) e.lastname = 'Enter your last name.';
  if (!EMAIL.test(String(v.email || '').trim())) e.email = 'Enter a valid email address.';
  if (!ROLES.some((r) => r.value === v.i_am_a)) e.i_am_a = 'Choose the option that describes you.';
  if (!POSTAL.test(String(v.zip || '').trim())) e.zip = 'Enter a ZIP or postal code.';
  if (!TIMINGS.some((t) => t.value === v.project_timing)) e.project_timing = 'Choose your project timing.';
  if (isProfessional(v.i_am_a) && !String(v.company || '').trim()) e.company = 'Enter your company.';
  if (v.project_size_value !== '' && v.project_size_value != null) {
    const n = Number(v.project_size_value);
    if (!Number.isFinite(n) || n <= 0) e.project_size_value = 'Enter a number, or leave it blank.';
  }
  return e;
}

// The object HubSpot would receive. Field names are the internal names in forms/hubspot-form-spec.md.
export function buildPayload(values, hidden) {
  const pro = isProfessional(values.i_am_a);
  return {
    firstname: String(values.firstname || '').trim(),
    lastname: String(values.lastname || '').trim(),
    email: String(values.email || '').trim().toLowerCase(),
    i_am_a: values.i_am_a,
    zip: String(values.zip || '').trim().toUpperCase(),
    project_timing: values.project_timing,
    company: pro ? String(values.company || '').trim() : '',
    project_size_value: values.project_size_value === '' || values.project_size_value == null ? '' : Number(values.project_size_value),
    project_size_unit: values.project_size_value === '' || values.project_size_value == null ? '' : values.project_size_unit,
    asset_id: hidden.asset_id,
    matrix_cell: hidden.matrix_cell,
    utm_source: hidden.utm_source || '',
    utm_medium: hidden.utm_medium || '',
    utm_campaign: hidden.utm_campaign || '',
    utm_term: hidden.utm_term || '',
    utm_content: hidden.utm_content || '',
    tool_inputs: JSON.stringify(hidden.tool_inputs || {}),
  };
}

// ---- DOM ---------------------------------------------------------------------------------------

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function formHtml(id, defaultSizeUnit) {
  const opt = (list, sel) => list.map((o) => `<option value="${o.value}"${o.value === sel ? ' selected' : ''}>${esc(o.label)}</option>`).join('');
  const f = (name, label, input, extra = '') => `
    <div class="field" data-field="${name}"${extra}>
      <label class="k" for="${id}-${name}">${label}</label>${input}
      <span class="err" id="${id}-${name}-err" aria-live="polite"></span>
    </div>`;
  const txt = (name, type, auto, req = true) =>
    `<input id="${id}-${name}" name="${name}" type="${type}" autocomplete="${auto}"${req ? ' required aria-required="true"' : ''} aria-describedby="${id}-${name}-err">`;
  return `
  <form class="lead-form" novalidate>
    <div class="grid">
      ${f('firstname', 'First name', txt('firstname', 'text', 'given-name'))}
      ${f('lastname', 'Last name', txt('lastname', 'text', 'family-name'))}
      ${f('email', 'Email', txt('email', 'email', 'email'))}
      ${f('i_am_a', 'I am a…', `<select id="${id}-i_am_a" name="i_am_a" required aria-required="true" aria-describedby="${id}-i_am_a-err"><option value="">Choose one</option>${opt(ROLES)}</select>`)}
      ${f('company', 'Company', txt('company', 'text', 'organization'), ' hidden')}
      ${f('zip', 'ZIP / postal code', txt('zip', 'text', 'postal-code'))}
      ${f('project_timing', 'Project timing', `<select id="${id}-project_timing" name="project_timing" required aria-required="true" aria-describedby="${id}-project_timing-err"><option value="">Choose one</option>${opt(TIMINGS)}</select>`)}
      <div class="field" data-field="project_size_value">
        <label class="k" for="${id}-project_size_value">Project size (optional)</label>
        <div style="display:flex;gap:8px">
          <input id="${id}-project_size_value" name="project_size_value" type="number" min="0" step="1" inputmode="numeric" aria-describedby="${id}-project_size_value-err">
          <select name="project_size_unit" aria-label="Project size unit">${opt(SIZE_UNITS, defaultSizeUnit)}</select>
        </div>
        <span class="err" id="${id}-project_size_value-err" aria-live="polite"></span>
      </div>
    </div>
    <!-- Hidden fields (HANDOVER §9). Filled at submit time. -->
    <input type="hidden" name="asset_id"><input type="hidden" name="matrix_cell">
    <input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign">
    <input type="hidden" name="utm_term"><input type="hidden" name="utm_content"><input type="hidden" name="tool_inputs">
    <p class="errors" role="alert"></p>
    <div class="actions">
      <button class="btn primary" type="submit">See the full report</button>
      <span class="note">We use these details to send your report and, if you ask, to follow up. No spam.
      [[VERIFY: privacy line and policy link — Brian Kim]]</span>
    </div>
  </form>`;
}

// el: container; getInputs(): the tool's current inputs (becomes tool_inputs); onUnlock(payload): show the report.
export function mountLeadGate({ el, assetId, matrixCell, getInputs, onUnlock, defaultSizeUnit = 'ft2' }) {
  const id = `lead-${assetId}`;
  el.innerHTML = formHtml(id, defaultSizeUnit);
  const form = el.querySelector('form');
  const tracking = readTracking(location.search, matrixCell);
  const companyField = form.querySelector('[data-field="company"]');
  const role = form.elements.i_am_a;
  const syncCompany = () => {
    const show = isProfessional(role.value);
    companyField.hidden = !show;
    form.elements.company.required = show;
  };
  role.addEventListener('change', syncCompany);
  syncCompany();

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    const errors = validateLead(values);
    form.querySelectorAll('.field').forEach((f) => {
      const name = f.dataset.field;
      f.classList.toggle('invalid', !!errors[name]);
      const msg = f.querySelector('.err');
      if (msg) msg.textContent = errors[name] || '';
      const input = f.querySelector('input,select');
      if (input) input.setAttribute('aria-invalid', errors[name] ? 'true' : 'false');
    });
    const first = Object.keys(errors)[0];
    form.querySelector('.errors').textContent = first ? 'Please check the highlighted fields.' : '';
    if (first) { form.elements[first].focus(); return; }

    const hidden = { asset_id: assetId, ...tracking, tool_inputs: getInputs() };
    for (const k of ['asset_id', 'matrix_cell', ...UTM_KEYS]) form.elements[k].value = hidden[k] || '';
    form.elements.tool_inputs.value = JSON.stringify(hidden.tool_inputs);
    const payload = buildPayload(values, hidden);

    // HubSpot form embed replaces this: the embed posts the payload to HubSpot and fires onFormSubmitted,
    // which then calls onUnlock(). Until then nothing leaves the page; the payload is only logged.
    console.log('[Bromic lead payload]', payload);
    onUnlock(payload);
  });
}
