// test/shim.test.js · node-side validation of the shim's public API
// uses a minimal jsdom-free shim of `document` to load the IIFE
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SRC = readFileSync(new URL('../cdn/v1/groundlevel.js', import.meta.url), 'utf8');

// stub the DOM the shim's bottom-of-file expects · just enough for it not to throw
const fakeDoc = { currentScript: { dataset: {} }, addEventListener() {}, body: null, head: { appendChild() {} } };
const sandbox = { document: fakeDoc, GroundLevel: undefined };

// evaluate the shim into the sandbox
new Function('globalThis', 'document', SRC)(sandbox, fakeDoc);
const GL = sandbox.GroundLevel;

test('GroundLevel object is exported', () => {
  assert.ok(GL);
  assert.equal(GL.version, '1.0.0');
});

test('6 template functions exist', () => {
  ['lba', 'dsar', 'disrepair', 'grievance', 'cancelSubscription', 'consumerRefund'].forEach(fn => {
    assert.equal(typeof GL[fn], 'function', `missing fn: ${fn}`);
  });
});

test('lba() produces PAP-Debt compliant letter', () => {
  const { title, body, authority } = GL.lba({ creditor: 'Jane Smith', debtor: 'Acme Ltd', amount: '$1000', dueDate: '2026-05-01', invoiceRef: 'INV-1' });
  assert.match(title, /Letter Before Action/);
  assert.match(body, /Pre-Action Protocol for Debt Claims/);
  assert.match(body, /Jane Smith/);
  assert.match(body, /Acme Ltd/);
  assert.match(body, /\$1000/);
  assert.match(body, /30 days/);
  assert.ok(authority.length >= 1);
});

test('dsar() cites Lloyd v Google + Vidal-Hall', () => {
  const { body, authority } = GL.dsar({ controller: 'Acme Ltd', dataSubject: 'Jane Smith' });
  assert.match(body, /Article 15/);
  assert.match(body, /UK GDPR/);
  assert.match(body, /Information Commissioner/);
  const cites = authority.map(c => c.cite);
  assert.ok(cites.some(c => c.includes('Lloyd')));
  assert.ok(cites.some(c => c.includes('Vidal-Hall')));
});

test('disrepair() invokes s.11 LTA 1985', () => {
  const { body } = GL.disrepair({ tenant: 'Jane', landlord: 'L', address: '1 St', issues: 'mould\nbroken boiler' });
  assert.match(body, /section 11 of the Landlord and Tenant Act 1985/);
  assert.match(body, /Homes \(Fitness for Human Habitation\)/);
});

test('grievance() invokes ACAS Code + s.207A', () => {
  const { body } = GL.grievance({ employee: 'Jane', employer: 'Acme', complaint: 'bullying' });
  assert.match(body, /ACAS Code/);
  assert.match(body, /s\.207A/);
});

test('cancelSubscription() invokes CCRs 2013', () => {
  const { body } = GL.cancelSubscription({ consumer: 'Jane', provider: 'Acme', account: 'A1' });
  assert.match(body, /Consumer Contracts \(Information, Cancellation and Additional Charges\) Regulations 2013/i);
});

test('consumerRefund() invokes CRA 2015 ss.20-24', () => {
  const { body } = GL.consumerRefund({ consumer: 'Jane', seller: 'Acme', item: 'phone', faultDescription: 'broken' });
  assert.match(body, /Consumer Rights Act 2015/);
  assert.match(body, /ss?\.9/);
  assert.match(body, /s\.20/);
});

test('search() returns ranked hits from 20 bundled authorities', () => {
  const hits = GL.search('deposit landlord');
  assert.ok(hits.length > 0);
  assert.ok(hits[0].cite.includes('Tiensia'));
  // empty query
  assert.deepEqual(GL.search(''), []);
});

test('citedAuthorities() returns the bundled set', () => {
  const cs = GL.citedAuthorities();
  assert.equal(cs.length, 20);
  assert.ok(cs.some(c => c.id === 'polkey'));
});

test('templates list is exposed', () => {
  assert.deepEqual(GL.templates, ['lba','dsar','disrepair','grievance','cancelSubscription','consumerRefund']);
});

test('all defaults produce body > 600 chars', () => {
  ['lba','dsar','disrepair','grievance','cancelSubscription','consumerRefund'].forEach(fn => {
    const { body } = GL[fn]();
    assert.ok(body.length > 600, `${fn} body too short: ${body.length}`);
  });
});
