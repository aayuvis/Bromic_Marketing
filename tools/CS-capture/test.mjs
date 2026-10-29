import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { blank, missing, status, progress, tags, toMarkdown, APPROVALS } from './logic.js';
const TAX = JSON.parse(readFileSync(new URL('../../data/case-study-taxonomy.json', import.meta.url)));

const full = () => {
  const c = blank();
  Object.assign(c.project, { name: 'Harbour Terrace', segment: ['restaurant'], market: 'AU', city: 'Sydney, NSW', completed: 'May 2026' });
  Object.assign(c.people, { owner: 'Harbour Group', contact_name: 'A. Manager', architect: 'Studio X' });
  Object.assign(c.space, { types: ['terrace'], area: '600', exposure: ['coastal', 'wind'] });
  c.before.problem = 'Too cold after 6 pm from May to September'; c.before.previous = 'propane towers';
  c.solution.products = [{ product: 'platinum-electric', model: '4500W', finish: 'Black', qty: '4', mounting: 'recessed' }];
  c.solution.controls = 'Affinity Smart-Heat Dimmer, 2-channel'; c.solution.zones = '2'; c.solution.heat_plan = 'yes';
  return c;
};

test('1. A blank capture is capturing, with every required field listed', () => {
  const c = blank();
  assert.equal(status(c).id, 'capturing');
  assert.ok(missing(c).includes('Controls'), 'controls are required, never optional');
  assert.equal(progress(c), 0);
});

test('2. Facts in but no consent: awaiting consent; residential adds the privacy check', () => {
  const c = full();
  assert.deepEqual(missing(c), []);
  assert.equal(status(c).id, 'awaiting-consent');
  assert.ok(!status(c).todo.some((t) => /Residential/.test(t)), 'commercial skips the privacy check');
  c.project.segment = ['single-family'];
  assert.ok(status(c).todo.some((t) => /Residential/.test(t)));
});

test('3. Draft consents give "ready to draft"; every sign-off gives "ready to publish"', () => {
  const c = full();
  for (const a of APPROVALS.filter((x) => x.gate === 'draft')) c.approvals[a.id] = { done: true };
  assert.equal(status(c).id, 'ready-to-draft');
  for (const a of APPROVALS) c.approvals[a.id] = { done: true, by: 'Reviewer', date: '2026-10-29' };
  assert.equal(status(c).id, 'ready-to-publish');
});

test('4. Tags come from the inputs and are taxonomy ids', () => {
  const c = full(); c.quotes = [{ text: 'Guests stay longer.', name: 'A. Manager', role: 'GM', approved: true }];
  const t = tags(c, TAX);
  assert.deepEqual(t.segment, ['restaurant']); assert.deepEqual(t.market, ['AU']); assert.deepEqual(t.product, ['platinum-electric']);
  assert.deepEqual(t.install, ['recessed']); assert.deepEqual(t.controls, ['affinity']);
  assert.ok(t.theme.includes('coastal') && t.theme.includes('replace-gas'));
  assert.ok(t.proof.includes('quote') && t.proof.includes('heat-plan') && t.proof.includes('credits'));
  for (const [g, ids] of Object.entries(t)) for (const id of ids) assert.ok(TAX.groups[g].tags.some((x) => x.id === id), `${g}:${id}`);
});

test('5. Markdown uses only what was entered and marks anything unapproved', () => {
  const c = full(); c.results = [{ metric: 'Months the terrace is open', before: '7', after: '12', period: '2025', measured: 'POS', approved: false }];
  const md = toMarkdown(c, TAX);
  assert.match(md, /^---\nid: CS-HARBOUR-TERRACE/);
  assert.match(md, /4 × Platinum Electric 4500W Black/);
  assert.match(md, /Affinity Smart-Heat Dimmer/);
  assert.match(md, /sold separately/);
  assert.match(md, /not yet approved for publication/);
  assert.match(md, /local building authority/);
  assert.doesNotMatch(md, /undefined|null/);
  const b = toMarkdown(blank(), TAX);
  assert.match(b, /\[\[VERIFY: controls — never blank\]\]/);
});
