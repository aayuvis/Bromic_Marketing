// Case-study capture: the rules, no DOM. index.html inlines this; test.mjs imports it.
// A capture is a plain object (see blank()). Nothing here invents content: the Markdown is built only from what was entered.

export const APPROVALS = [
  { id: 'consent_name', label: 'Customer agrees to be named (venue or home), with the exact wording', gate: 'draft' },
  { id: 'consent_numbers', label: 'Every number approved in writing, with how it was measured', gate: 'draft' },
  { id: 'consent_quote', label: 'Every quote approved word for word by the person quoted', gate: 'draft' },
  { id: 'photo_licence', label: 'Photo licence covers web, print, social and paid use; credit line agreed', gate: 'draft' },
  { id: 'consent_credits', label: 'Architect, designer, builder and installer agree to be credited (names and spelling)', gate: 'draft' },
  { id: 'privacy', label: 'Residential: nothing locates the home without the owner’s consent (not needed for commercial)', gate: 'draft' },
  { id: 'regional_lead', label: 'Regional lead checked the facts', gate: 'publish' },
  { id: 'product_controls', label: 'Mike Clifford checked products, mounting and controls', gate: 'publish' },
  { id: 'brand', label: 'Megan Spies approved brand and consent file', gate: 'publish' },
  { id: 'final_customer', label: 'Customer approved the final draft (saved with the source files)', gate: 'publish' },
];

export const SHOTS = [
  { id: 'hero', label: 'Hero: the space in use at dusk, heaters on, correctly installed' },
  { id: 'wide', label: 'Wide: the whole space, people using it (with consent)' },
  { id: 'detail', label: 'Detail: a heater and its mounting (bracket, pole, recess)' },
  { id: 'controls', label: 'Controls: the wall controller or the app in use' },
  { id: 'heatplan', label: 'Heat plan or layout drawing' },
  { id: 'before', label: 'Before: the space without heating (if one exists)' },
];

export const REQUIRED = [
  ['project.name', 'Project name'], ['project.segment', 'Property type'], ['project.market', 'Market'], ['project.city', 'City or region'],
  ['people.owner', 'Owner or operator'], ['people.contact_name', 'Contact name'],
  ['space.types', 'Space'], ['space.area', 'Heated area'],
  ['before.problem', 'What did not work before'],
  ['solution.products', 'Products and quantities'], ['solution.controls', 'Controls'],
];

const get = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
const filled = (v) => Array.isArray(v) ? v.some((x) => (typeof x === 'object' ? Object.values(x).some(filled) : String(x).trim())) : v != null && String(v).trim() !== '';

export function blank() {
  return {
    project: { name: '', segment: [], market: '', city: '', completed: '', status: 'completed' },
    people: { owner: '', contact_name: '', contact_role: '', contact_email: '', architect: '', designer: '', builder: '', installer: '', dealer: '', bromic_rep: '' },
    space: { types: [], area: '', area_unit: 'ft2', open_30: '', mount_height: '', structure: '', exposure: [], power: '', gas: '' },
    before: { use: '', problem: '', previous: '' },
    solution: { products: [{ product: '', model: '', finish: '', qty: '', mounting: '' }], controls: '', zones: '', bms: '', design_service: '', heat_plan: '' },
    results: [{ metric: '', before: '', after: '', period: '', measured: '', approved: false }],
    quotes: [{ text: '', name: '', role: '', approved: false }],
    photos: { shots: {}, photographer: '', licence: '', files: '', count: '' },
    approvals: {},
    notes: '',
  };
}

export function missing(c) { return REQUIRED.filter(([p]) => !filled(get(c, p))).map(([, l]) => l); }

export function approvalsOpen(c, gate) {
  const residential = (c.project.segment || []).includes('single-family');
  return APPROVALS.filter((a) => (gate === 'publish' || a.gate === 'draft') && !(a.id === 'privacy' && !residential) && !(c.approvals[a.id] && c.approvals[a.id].done));
}

// Status: capturing → ready to draft (facts in, consents given) → ready to publish (every sign-off) .
export function status(c) {
  const m = missing(c);
  if (m.length) return { id: 'capturing', label: 'Capturing', todo: m };
  const d = approvalsOpen(c, 'draft');
  if (d.length) return { id: 'awaiting-consent', label: 'Awaiting consent', todo: d.map((a) => a.label) };
  const p = approvalsOpen(c, 'publish');
  if (p.length) return { id: 'ready-to-draft', label: 'Ready to draft', todo: p.map((a) => a.label) };
  return { id: 'ready-to-publish', label: 'Ready to publish', todo: [] };
}

export function progress(c) {
  const residential = (c.project.segment || []).includes('single-family');
  const apps = APPROVALS.filter((a) => residential || a.id !== 'privacy');  // the privacy check applies to homes only
  const parts = REQUIRED.length + apps.length + SHOTS.length;
  const done = REQUIRED.length - missing(c).length + apps.filter((a) => c.approvals[a.id] && c.approvals[a.id].done).length + SHOTS.filter((s) => c.photos.shots[s.id]).length;
  return Math.round(done / parts * 100);
}

// Tags for the case-study library, from what was entered (data/case-study-taxonomy.json ids).
export function tags(c, tax) {
  const has = (g, id) => tax && tax.groups[g].tags.some((t) => t.id === id);
  const prod = [...new Set(c.solution.products.map((p) => p.product).filter((p) => has('product', p)))];
  const inst = [...new Set(c.solution.products.map((p) => p.mounting).filter((m) => has('install', m)))];
  const ctl = /affinity/i.test(c.solution.controls) ? ['affinity'] : /eclipse/i.test(c.solution.controls) ? ['eclipse-dimmer'] : /switch/i.test(c.solution.controls) ? ['switch'] : [];
  const theme = [...(c.space.exposure || []).filter((e) => has('theme', e)), ...(c.solution.design_service === 'yes' ? ['design-service'] : []),
    ...(/propane|gas|mushroom/i.test(c.before.previous) ? ['replace-gas'] : [])];
  const proof = [...(c.quotes.some((q) => q.text && q.approved) ? ['quote'] : []), ...(c.solution.heat_plan === 'yes' ? ['heat-plan'] : []),
    ...(c.results.some((r) => r.metric && r.approved) ? ['numbers'] : []), ...([c.people.architect, c.people.designer].some(filled) ? ['credits'] : []),
    ...(Number(c.photos.count) >= 5 ? ['photo-set'] : [])];
  return { segment: c.project.segment || [], space: c.space.types || [], install: inst, product: prod, controls: ctl, theme: [...new Set(theme)],
    market: c.project.market ? [c.project.market] : [], proof };
}

const line = (k, v) => (filled(v) ? `| ${k} | ${String(v).replace(/\|/g, '/').replace(/\n/g, ' ')} |\n` : '');
const slug = (s) => String(s || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);

// Markdown in the shape of content/case-studies/case-study-template.md, ready for a writer. Only what was entered.
export function toMarkdown(c, tax) {
  const t = tags(c, tax), st = status(c);
  const name = (g, id) => (tax && tax.groups[g].tags.find((x) => x.id === id)?.label) || id;
  const prods = c.solution.products.filter((p) => filled(Object.values(p)));
  const res = c.results.filter((r) => r.metric);
  const qs = c.quotes.filter((q) => q.text);
  const aud = [...new Set(t.segment.flatMap((s) => (tax?.groups.segment.tags.find((x) => x.id === s)?.audience) || []))];
  let md = `---\nid: CS-${slug(c.project.name).toUpperCase().slice(0, 24)}\ntype: case-study\ntitle: "${(c.project.name || '').replace(/"/g, "'")}${c.project.city ? ', ' + c.project.city.replace(/"/g, "'") : ''}"\n`;
  md += `slug: ${slug(c.project.name)}\naudience: [${aud.join(', ') || 'COM'}]\nstage: [IN, PP]\nasset: A10\ncta: {label: "Book a design consult", asset: A07}\n`;
  md += `owner_review: Megan Spies\nstatus: draft\ncapture_status: ${st.id}\ntags: ${JSON.stringify(t)}\n---\n\n`;
  md += `> Capture status: **${st.label}**.${st.todo.length ? ' Still open: ' + st.todo.join('; ') + '.' : ''} Draft only from approved facts.\n\n`;
  md += `## At a glance\n\n| | |\n|---|---|\n`;
  md += line('Project', c.project.name) + line('Location', [c.project.city, c.project.market].filter(Boolean).join(', ')) + line('Segment', t.segment.map((s) => name('segment', s)).join(', '));
  md += line('Owner / operator', c.people.owner) + line('Architect', c.people.architect) + line('Designer', c.people.designer) + line('Builder', c.people.builder) + line('Installer', c.people.installer) + line('Dealer', c.people.dealer);
  md += line('Products', prods.map((p) => [p.qty && p.qty + ' ×', name('product', p.product), p.model, p.finish, p.mounting && '(' + name('install', p.mounting) + ')'].filter(Boolean).join(' ')).join('; '));
  md += line('Controls', [c.solution.controls, c.solution.zones && c.solution.zones + ' zones', c.solution.bms && 'BMS: ' + c.solution.bms].filter(Boolean).join(' · '));
  md += line('Heated area', c.space.area && `${c.space.area} ${c.space.area_unit === 'm2' ? 'm²' : 'ft²'}`) + line('Completed', c.project.completed);
  md += line('Photography', [c.photos.photographer, c.photos.licence].filter(Boolean).join(' · '));
  md += `\n## Situation\n\n${c.before.use || '[[VERIFY: how the space was used before — capture]]'}\n\n${c.before.problem || ''}${c.before.previous ? `\n\nPreviously heated with: ${c.before.previous}.` : ''}\n`;
  md += `\n## The brief\n\n${[c.space.types.length && 'Space: ' + c.space.types.map((s) => name('space', s)).join(', '), c.space.open_30 && 'At least 30% of the perimeter open: ' + c.space.open_30, c.space.mount_height && 'Mount height: ' + c.space.mount_height, c.space.structure && 'Structure: ' + c.space.structure, c.space.exposure.length && 'Exposure: ' + c.space.exposure.map((s) => name('theme', s)).join(', '), c.space.power && 'Power: ' + c.space.power, c.space.gas && 'Gas: ' + c.space.gas].filter(Boolean).map((x) => '- ' + x).join('\n')}\n`;
  md += `\n## The solution\n\n${prods.map((p) => `- ${[p.qty && p.qty + ' ×', name('product', p.product), p.model, p.finish].filter(Boolean).join(' ')}${p.mounting ? ', ' + name('install', p.mounting).toLowerCase() : ''}`).join('\n')}\n- Controls: ${c.solution.controls || '[[VERIFY: controls — never blank]]'}${c.solution.zones ? `, ${c.solution.zones} zones` : ''}. Wi-Fi and app features need compatible Affinity Smart-Heat controls, sold separately.\n${c.solution.design_service === 'yes' ? '- Laid out with the Bromic design service.\n' : ''}`;
  md += `\n## The result\n\n${res.length ? res.map((r) => `- ${r.metric}: ${[r.before && 'before ' + r.before, r.after && 'after ' + r.after].filter(Boolean).join(', ')}${r.period ? ` (${r.period})` : ''}${r.measured ? `; measured by ${r.measured}` : ''}${r.approved ? '' : ' **[not yet approved for publication]**'}`).join('\n') : 'No numbers captured. Publish no figure without written approval.'}\n`;
  if (qs.length) md += `\n${qs.map((q) => `> "${q.text}"\n> — ${[q.name, q.role].filter(Boolean).join(', ')}${q.approved ? '' : ' **[quote not yet approved]**'}`).join('\n\n')}\n`;
  md += `\n## Photos\n\n${SHOTS.map((s) => `- [${c.photos.shots[s.id] ? 'x' : ' '}] ${s.label}`).join('\n')}\n${c.photos.files ? `\nFiles: ${c.photos.files}\n` : ''}`;
  md += `\n## Approvals\n\n${APPROVALS.map((a) => { const v = c.approvals[a.id] || {}; return `- [${v.done ? 'x' : ' '}] ${a.label}${v.by ? ` — ${v.by}` : ''}${v.date ? `, ${v.date}` : ''}`; }).join('\n')}\n`;
  if (c.notes) md += `\n## Notes\n\n${c.notes}\n`;
  md += `\nThis is a first record, not a design. Confirm every installation with your local building authority and a licensed electrician or gas fitter.\n`;
  return md;
}
