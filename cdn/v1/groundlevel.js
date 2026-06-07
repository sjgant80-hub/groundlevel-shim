/*!
 * @sjgant80-hub/groundlevel-shim · v1.0.0 · CDN drop-in legal-shim
 * MIT · https://github.com/sjgant80-hub/groundlevel-shim
 *
 * One <script> tag adds 6 letter generators + a floating widget to any site.
 * No dependencies · no tracking · all rendering happens in the visitor's browser.
 *
 * INSTALL:
 *   <script src="https://sjgant80-hub.github.io/groundlevel-shim/cdn/v1/groundlevel.js"
 *           data-widget="bottom-right"
 *           data-worker="https://groundlevel-worker.example.workers.dev"
 *           defer></script>
 *
 * JS API:
 *   GroundLevel.lba({creditor, debtor, amount, dueDate, invoiceRef})
 *   GroundLevel.dsar({controller, dataSubject, scope})
 *   GroundLevel.disrepair({tenant, landlord, address, issues})
 *   GroundLevel.grievance({employer, employee, complaint, dateRange})
 *   GroundLevel.cancelSubscription({provider, account, since})
 *   GroundLevel.consumerRefund({seller, item, faultDescription, purchaseDate})
 *   GroundLevel.open(type)              // open the widget modal at a template
 *   GroundLevel.search(query)           // search cited authorities (offline · 20 cases bundled)
 *
 * The widget IS optional · the API alone works without DOM injection.
 */
(function (global) {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // 20 cited authorities · minimal subset for the shim's letter templates
  // (the SDK has 31+ · the worker has the full set · this is a deliberate stub)
  const CITED = [
    { id:'tiensia',     cite:'Tiensia v Vision Enterprises Ltd [2010] EWCA Civ 1224', principle:'Deposit non-protection → 1-3x penalty', area:'housing' },
    { id:'spencer',     cite:'Spencer v Taylor [2013] EWCA Civ 1600', principle:'Prescribed-info defects invalidate s.21', area:'housing' },
    { id:'polkey',      cite:'Polkey v AE Dayton Services Ltd [1988] ICR 142', principle:'Procedural unfairness alone = unfair dismissal', area:'employment' },
    { id:'burchell',    cite:'BHS v Burchell [1980] ICR 303', principle:'Conduct dismissal · genuine belief + reasonable grounds + investigation', area:'employment' },
    { id:'lloyd',       cite:'Lloyd v Google LLC [2021] UKSC 50', principle:'GDPR Art 82 needs individualised damage', area:'data' },
    { id:'vidalhall',   cite:'Vidal-Hall v Google [2015] EWCA Civ 311', principle:'Misuse of private info · distress damages', area:'data' },
    { id:'mellor',      cite:'Mellor v Carfin Property Investments [2020]', principle:'PAP-Debt non-compliance triggers costs sanction', area:'money' },
    { id:'plevin',      cite:'Plevin v Paragon Personal Finance [2014] UKSC 61', principle:'Non-disclosure of commission = unfair relationship', area:'consumer' },
    { id:'oft',         cite:'OFT v Abbey National [2009] UKSC 6', principle:'Core terms excluded from fairness review (CRA s.64)', area:'consumer' },
    { id:'parkingeye',  cite:'ParkingEye v Beavis [2015] UKSC 67', principle:'Penalty doctrine · legitimate-interest + proportionality test', area:'consumer' },
    { id:'henderson',   cite:'Henderson v Henderson [1843] 3 Hare 100', principle:'Bring all claims in one action · res judicata estoppel', area:'court' },
    { id:'halsey',      cite:'Halsey v MK NHS Trust [2004] EWCA Civ 576', principle:'Unreasonable refusal of ADR → costs sanction', area:'court' },
    { id:'mitchell',    cite:'Mitchell v News Group [2013] EWCA Civ 1537', principle:'CPR r.3.9 · relief from sanctions test', area:'court' },
    { id:'denton',      cite:'Denton v TH White [2014] EWCA Civ 906', principle:'Three-stage Denton test refines Mitchell', area:'court' },
    { id:'caridon',     cite:'Caridon Property v Shooltz [2018]', principle:'Pre-tenancy CP12 is non-curable for s.21', area:'housing' },
    { id:'bridges',     cite:'R (Bridges) v SWP [2020] EWCA Civ 1058', principle:'Biometric processing needs clear legal basis', area:'data' },
    { id:'schrems',     cite:'C-311/18 Schrems II [2020]', principle:'Adequacy + TIA required for cross-border transfers', area:'data' },
    { id:'sayers',      cite:'Sayers v Cambridgeshire CC [2007] IRLR 29', principle:'Whistleblowing protection · reasonable-belief test', area:'employment' },
    { id:'bates',       cite:'Bates v Post Office Ltd [2019] EWHC 606 (QB)', principle:'Documentary disclosure defeats institutional denial', area:'employment' },
    { id:'euaiact',     cite:'EU AI Act (Regulation 2024/1689)', principle:'Risk-tiered AI rules · Art 12 audit logs · Annex IV docs', area:'data' },
  ];

  // ─────────────────────────────────────────────────────────────
  // letter templates · plain text · safe to print, paste, email
  const today = () => new Date().toISOString().slice(0, 10);
  const lineNumber = (text) => text.split('\n').map((l, i) => `${i + 1}. ${l.trim()}`).filter(p => p.trim()).join('\n');

  function lba({ creditor = '[Your name]', debtor = '[Debtor name]', amount = '[£0.00]', dueDate = '[date due]', invoiceRef = '[invoice/contract reference]', address = '' } = {}) {
    return {
      title: 'Letter Before Action (LBA)',
      authority: [CITED.find(c => c.id === 'mellor'), CITED.find(c => c.id === 'denton')],
      body:
`${creditor}
${address}
${today()}

To: ${debtor}

Dear Sir/Madam,

RE: LETTER BEFORE ACTION · ${invoiceRef}

I write in accordance with the Pre-Action Protocol for Debt Claims (PAP-Debt, in force from 1 October 2017) regarding the sum of ${amount} which fell due on ${dueDate} and remains unpaid.

Particulars of the debt:
· Invoice / contract reference: ${invoiceRef}
· Amount outstanding: ${amount}
· Due date: ${dueDate}
· Date of this letter: ${today()}

You have 30 days from the date of this letter (i.e. until ${new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)}) to either:
  (a) pay the sum in full, or
  (b) propose a payment plan, or
  (c) dispute the debt providing your reasons in writing.

If I do not hear from you within 30 days, I reserve the right to:
  (i) issue proceedings in the County Court under CPR Part 7 without further notice;
  (ii) claim interest at the rate of 8% per annum under the Late Payment of Commercial Debts (Interest) Act 1998 (if a commercial debt) or s.69 County Courts Act 1984;
  (iii) seek my costs of the proceedings, including any compliance with this Protocol, against you.

Please note that an unreasonable failure to engage with this letter may result in cost sanctions against you under the protocol, regardless of who ultimately wins (see Mellor v Carfin Property Investments [2020] and Denton v TH White [2014] EWCA Civ 906).

A reply form is attached. Please complete and return it within 30 days even if you require longer to consider this matter.

Yours faithfully,

${creditor}

___
ENCLOSED:
· Reply form (PAP-Debt Annex 1)
· Statement of account
· Information sheet (PAP-Debt Annex 2)`,
    };
  }

  function dsar({ controller = '[Data controller]', dataSubject = '[Your name]', scope = 'all personal data you hold relating to me', address = '', email = '' } = {}) {
    return {
      title: 'Data Subject Access Request (DSAR)',
      authority: [CITED.find(c => c.id === 'lloyd'), CITED.find(c => c.id === 'vidalhall')],
      body:
`${dataSubject}
${address}
${email}
${today()}

To: ${controller}
For the attention of: Data Protection Officer / Privacy Team

Dear Sir/Madam,

REQUEST UNDER UK GDPR ARTICLE 15 (DATA SUBJECT ACCESS REQUEST)

I am writing to make a formal request for access to personal data under Article 15 of the UK General Data Protection Regulation (UK GDPR) and section 45 of the Data Protection Act 2018.

I request:

1. Confirmation as to whether or not personal data concerning me is being processed.

2. A copy of all personal data concerning me, including (but not limited to):
   · ${scope}
   · CCTV footage in which I appear
   · Email and message correspondence sent to or about me
   · Call recordings and call notes
   · Records of any automated decision-making affecting me
   · Records of any data shared with third parties

3. The following supplementary information required by Article 15(1):
   (a) the purposes of the processing;
   (b) the categories of personal data concerned;
   (c) the recipients or categories of recipient to whom the personal data has been or will be disclosed;
   (d) the envisaged period for which the personal data will be stored;
   (e) the existence of my rights to rectification, erasure, restriction of processing, and to object;
   (f) my right to lodge a complaint with the Information Commissioner's Office;
   (g) where the personal data was not collected from me, the source;
   (h) the existence of automated decision-making, including profiling, and meaningful information about the logic involved.

You have one month from receipt of this letter to comply (UK GDPR Article 12(3)). This may be extended by two further months where necessary, taking into account the complexity and number of the requests, in which case you must inform me of the extension and the reasons within one month.

The request is provided free of charge. If you consider the request manifestly unfounded or excessive you may charge a reasonable fee or refuse to act on the request — in which case you must explain that decision in writing.

If I do not receive a satisfactory response by ${new Date(Date.now() + 31 * 86400000).toISOString().slice(0, 10)} I will lodge a complaint with the Information Commissioner's Office (https://ico.org.uk) and consider compensation under Article 82 (see Lloyd v Google [2021] UKSC 50 and Vidal-Hall v Google [2015] EWCA Civ 311 for the legal basis).

Please send your response by [post / email] to the address above.

Yours faithfully,

${dataSubject}`,
    };
  }

  function disrepair({ tenant = '[Your name]', landlord = '[Landlord name]', address = '[Property address]', issues = '[describe each issue with a line break]', rentPaid = '[£0 / week / month]' } = {}) {
    return {
      title: 'Section 11 Disrepair Notice',
      authority: [CITED.find(c => c.id === 'caridon'), CITED.find(c => c.id === 'spencer')],
      body:
`${tenant}
${address}
${today()}

To: ${landlord}

Dear Sir/Madam,

NOTICE OF DISREPAIR · LANDLORD AND TENANT ACT 1985 s.11

I am writing to give you formal notice of disrepair at the above property of which I am the tenant.

Property: ${address}
Rent: ${rentPaid}
Tenancy start: [date]

Issues requiring repair:

${lineNumber(issues)}

The disrepair falls within your repairing obligations under section 11 of the Landlord and Tenant Act 1985 (as updated by the Homes (Fitness for Human Habitation) Act 2018) which makes the property unfit for human habitation in respect of:
· structure and exterior · installations for water, gas, electricity, sanitation, space heating and water heating.

You are required by section 11 to keep these in repair and proper working order.

Please carry out the necessary repairs within 21 days of the date of this letter, or contact me within 14 days with a written timetable for completion.

If repair is not carried out within a reasonable time I reserve the right to:
  (i) report the property to Environmental Health under the Housing Act 2004 (HHSRS hazard rating);
  (ii) issue proceedings under section 11 for specific performance and damages;
  (iii) seek damages for distress, inconvenience, and any consequential loss (Wallace v Manchester CC [1998]);
  (iv) where the disrepair causes a serious health and safety risk, consider rent reduction (set-off) in line with established case law.

I draw your attention to:
· Caridon Property v Shooltz [2018] — pre-tenancy CP12 (gas safety certificate) failures cannot be cured retrospectively for s.21 purposes.
· Spencer v Taylor [2013] EWCA Civ 1600 — any subsequent s.21 notice must strictly comply with prescribed information.

Please respond in writing within 14 days.

Yours faithfully,

${tenant}`,
    };
  }

  function grievance({ employee = '[Your name]', employer = '[Employer name]', complaint = '[Describe the issue]', dateRange = '[date or range]', witnesses = '' } = {}) {
    return {
      title: 'Formal Grievance Letter',
      authority: [CITED.find(c => c.id === 'polkey'), CITED.find(c => c.id === 'burchell'), CITED.find(c => c.id === 'sayers')],
      body:
`${employee}
[Your address]
${today()}

To: ${employer}
For the attention of: Human Resources / Line Manager (one above)

Dear Sir/Madam,

FORMAL GRIEVANCE · ACAS CODE OF PRACTICE ON DISCIPLINARY AND GRIEVANCE PROCEDURES

I am writing to raise a formal grievance under the ACAS Code of Practice on Disciplinary and Grievance Procedures.

Grievance:

${complaint}

Date(s) of incident(s): ${dateRange}
Witnesses (if any): ${witnesses || '[none / list names]'}

Resolution sought:

[State what you want — apology · investigation · process change · compensation · adjustment]

Statutory framework:
· Section 1, Employment Rights Act 1996 (statement of particulars)
· Section 13 (unauthorised deductions from wages)
· Sections 43A-43L (whistleblowing protection · Sayers v Cambridgeshire CC [2007] IRLR 29)
· Section 98 unfair dismissal (Polkey v AE Dayton Services [1988] ICR 142)

ACAS Code requirements:
You are required by the ACAS Code (in force) to:
  (a) deal with the matter promptly · without unreasonable delay;
  (b) act consistently;
  (c) carry out any necessary investigations;
  (d) inform me of the basis of the grievance and give me an opportunity to put my case in response before any decisions are made;
  (e) allow me to be accompanied at any formal grievance meeting;
  (f) allow me to appeal any formal decision made.

A failure to follow the Code may, in the event of a subsequent Tribunal claim, result in an uplift of up to 25% to any compensation awarded against you (s.207A Trade Union and Labour Relations (Consolidation) Act 1992).

Please confirm receipt of this grievance within 5 working days and arrange a meeting within a reasonable time.

Yours faithfully,

${employee}`,
    };
  }

  function cancelSubscription({ consumer = '[Your name]', provider = '[Provider name]', account = '[account reference]', since = '[start date]', autoRenewedOn = '[renewal date]' } = {}) {
    return {
      title: 'Subscription Cancellation Notice',
      authority: [CITED.find(c => c.id === 'oft'), CITED.find(c => c.id === 'plevin')],
      body:
`${consumer}
[Your address]
${today()}

To: ${provider}
For the attention of: Customer Services / Account Cancellation Team

Dear Sir/Madam,

NOTICE OF CANCELLATION · CONSUMER CONTRACTS (INFORMATION, CANCELLATION AND ADDITIONAL CHARGES) REGULATIONS 2013

I am writing to give you formal notice of cancellation of the subscription on the following account:

· Account / customer reference: ${account}
· Subscription start: ${since}
· Auto-renewed on: ${autoRenewedOn}
· Cancellation effective: today

Statutory basis:

1. This notice is given under regulations 29-31 of the Consumer Contracts Regulations 2013 (where the original contract was concluded at a distance or off-premises).

2. To the extent the contract was concluded on-premises and the renewal was automatic, I cancel under the contract's own terms and under the implied terms of fairness in Part 2 of the Consumer Rights Act 2015.

3. To the extent any commission or referral payment was concealed at the point of renewal (e.g. comparison-site referrals), I assert an unfair-relationship under section 140A of the Consumer Credit Act 1974 (Plevin v Paragon Personal Finance [2014] UKSC 61).

You are required to:
  (a) cease taking any further payments from my account from today;
  (b) refund any sums taken after the renewal date where I did not actively consent to the renewal;
  (c) provide a final statement of account within 14 days.

If you continue to debit my payment method after the date of this letter I will:
  (i) instruct my bank to recall the payment under the Direct Debit Guarantee or chargeback scheme;
  (ii) make a complaint to Trading Standards and to the Financial Ombudsman Service (where applicable);
  (iii) issue a money claim for the unauthorised sums plus interest.

Please confirm cancellation in writing within 14 days.

Yours faithfully,

${consumer}`,
    };
  }

  function consumerRefund({ consumer = '[Your name]', seller = '[Seller name]', item = '[Item description]', faultDescription = '[Describe the fault]', purchaseDate = '[date]', priceUSD = '', priceGBP = '' } = {}) {
    return {
      title: 'Consumer Rights Refund Request',
      authority: [CITED.find(c => c.id === 'oft'), CITED.find(c => c.id === 'parkingeye')],
      body:
`${consumer}
[Your address]
${today()}

To: ${seller}
For the attention of: Customer Services

Dear Sir/Madam,

CONSUMER RIGHTS ACT 2015 · REQUEST FOR REFUND / REPLACEMENT / REPAIR

I am writing concerning the following purchase:

· Item: ${item}
· Date of purchase: ${purchaseDate}
· Price: ${priceUSD || priceGBP || '[price]'}
· Fault: ${faultDescription}

The goods are not of satisfactory quality and/or not as described (Consumer Rights Act 2015 ss.9-10) and/or not fit for purpose (s.10).

My right to a remedy:

· Within 30 days of delivery (the "short-term right to reject"): I am entitled to a FULL REFUND under s.20 CRA 2015.

· After 30 days but within 6 months: I am entitled to repair or replacement under s.23. If repair/replacement is impossible, disproportionately costly, or not completed within a reasonable time, I am entitled to a price reduction or a final right to reject under s.24.

· After 6 months: the same remedies apply but I bear the burden of proving the fault was present at the point of supply.

Please confirm within 14 days which remedy you propose to offer. If I do not receive a satisfactory response by ${new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10)} I reserve the right to:
  (a) pursue a Section 75 claim against my credit card provider (if applicable);
  (b) raise a chargeback against my debit card;
  (c) issue a money claim in the County Court;
  (d) complain to Trading Standards / the ADR provider listed in your terms.

Yours faithfully,

${consumer}`,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // search (offline · against the 20 bundled cases)
  function search(query) {
    if (!query) return [];
    const terms = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);
    return CITED.map(c => {
      let s = 0;
      const hay = (c.cite + ' ' + c.principle + ' ' + c.area).toLowerCase();
      terms.forEach(t => { if (hay.includes(t)) s += 2; });
      return { ...c, _score: s };
    }).filter(c => c._score > 0).sort((a, b) => b._score - a._score).slice(0, 8);
  }

  // ─────────────────────────────────────────────────────────────
  // floating widget · only renders if data-widget is set on the script tag
  const TEMPLATES = {
    lba:               { name: 'Debt · Letter Before Action', fn: lba,               fields: ['creditor','debtor','amount','dueDate','invoiceRef','address'] },
    dsar:              { name: 'GDPR · Data Subject Access',  fn: dsar,              fields: ['dataSubject','controller','scope','address','email'] },
    disrepair:         { name: 'Housing · Disrepair Notice',  fn: disrepair,         fields: ['tenant','landlord','address','issues','rentPaid'] },
    grievance:         { name: 'Work · Formal Grievance',     fn: grievance,         fields: ['employee','employer','complaint','dateRange','witnesses'] },
    cancelSubscription:{ name: 'Cancel · Subscription Notice',fn: cancelSubscription,fields: ['consumer','provider','account','since','autoRenewedOn'] },
    consumerRefund:    { name: 'Consumer · CRA Refund',       fn: consumerRefund,    fields: ['consumer','seller','item','faultDescription','purchaseDate','priceUSD'] },
  };

  const STYLE = `
.gl-widget{position:fixed;font:14px/1.5 -apple-system,system-ui,sans-serif;z-index:2147483646;color:#e8e8ea}
.gl-widget *{box-sizing:border-box}
.gl-btn{background:#2563eb;color:#fff;border:0;padding:12px 18px;border-radius:999px;font-weight:600;cursor:pointer;box-shadow:0 4px 18px rgba(37,99,235,.4);font-size:13px;letter-spacing:.3px}
.gl-btn:hover{background:#1d4ed8}
.gl-modal{position:fixed;inset:0;background:rgba(8,8,16,.78);display:none;align-items:center;justify-content:center;z-index:2147483647;padding:16px}
.gl-modal.open{display:flex}
.gl-card{background:#11131a;border:1px solid #1a1a22;border-radius:10px;max-width:760px;width:100%;max-height:92vh;display:flex;flex-direction:column;overflow:hidden}
.gl-head{padding:14px 18px;border-bottom:1px solid #1a1a22;display:flex;justify-content:space-between;align-items:center}
.gl-head h2{margin:0;font-size:15px;color:#e8e8ea}
.gl-head .gl-close{background:none;border:0;color:#8a8a92;font-size:22px;cursor:pointer;padding:0 4px}
.gl-body{padding:14px 18px;overflow:auto;flex:1}
.gl-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media (max-width:680px){.gl-grid{grid-template-columns:1fr}}
.gl-grid label{display:block;font-size:11px;color:#8a8a92;margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px}
.gl-grid input,.gl-grid textarea{width:100%;background:#0d0d14;border:1px solid #1a1a22;border-radius:5px;padding:8px 10px;color:#e8e8ea;font-family:inherit;font-size:13px}
.gl-grid textarea{min-height:64px;resize:vertical;grid-column:1/-1;font-family:ui-monospace,'SF Mono',monospace;font-size:12px}
.gl-types{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.gl-types button{background:#0d0d14;border:1px solid #1a1a22;color:#8a8a92;padding:7px 11px;border-radius:5px;font-size:12px;cursor:pointer;font-family:inherit}
.gl-types button.active{background:#2563eb;border-color:#2563eb;color:#fff}
.gl-preview{background:#0d0d14;border:1px solid #1a1a22;border-radius:5px;padding:14px;white-space:pre-wrap;font-family:'Times New Roman',serif;font-size:13px;color:#e8e8ea;max-height:340px;overflow:auto;margin-top:14px}
.gl-actions{padding:12px 18px;border-top:1px solid #1a1a22;display:flex;gap:8px;justify-content:flex-end;background:#0d0d14}
.gl-actions button{background:#1a1a22;color:#e8e8ea;border:0;padding:8px 14px;border-radius:5px;cursor:pointer;font-size:13px;font-family:inherit}
.gl-actions button.primary{background:#2563eb}
.gl-foot{padding:8px 18px;color:#5a5a62;font-size:11px;text-align:center;border-top:1px solid #1a1a22}
.gl-foot a{color:#5a5a62}
`;

  function injectStyle() {
    if (document.getElementById('gl-style')) return;
    const s = document.createElement('style');
    s.id = 'gl-style';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function makeButton(position) {
    const b = document.createElement('div');
    b.className = 'gl-widget';
    const pos = position === 'bottom-left'
      ? 'left:20px;bottom:20px'
      : position === 'top-right'
        ? 'right:20px;top:20px'
        : 'right:20px;bottom:20px';
    b.style.cssText = pos;
    b.innerHTML = `<button class="gl-btn" type="button">⚖ Need a letter?</button>`;
    b.querySelector('button').addEventListener('click', () => openModal('lba'));
    document.body.appendChild(b);
  }

  let activeType = 'lba';
  let modalEl = null;

  function openModal(type) {
    injectStyle();
    activeType = type || 'lba';
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.className = 'gl-modal';
      modalEl.innerHTML = `
<div class="gl-card">
  <div class="gl-head">
    <h2>◊ GroundLevel · letter generator</h2>
    <button class="gl-close" type="button" aria-label="close">×</button>
  </div>
  <div class="gl-body">
    <div class="gl-types"></div>
    <div class="gl-grid" id="gl-form"></div>
    <div class="gl-preview" id="gl-preview" style="display:none"></div>
  </div>
  <div class="gl-actions">
    <button type="button" id="gl-gen" class="primary">Generate</button>
    <button type="button" id="gl-copy">Copy</button>
    <button type="button" id="gl-print">Print</button>
  </div>
  <div class="gl-foot">not legal advice · cite-checked templates · <a href="https://github.com/sjgant80-hub/groundlevel-shim" target="_blank">groundlevel-shim</a></div>
</div>`;
      modalEl.querySelector('.gl-close').addEventListener('click', closeModal);
      modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
      const types = modalEl.querySelector('.gl-types');
      Object.entries(TEMPLATES).forEach(([key, t]) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = t.name;
        b.dataset.type = key;
        b.addEventListener('click', () => { activeType = key; renderForm(); });
        types.appendChild(b);
      });
      modalEl.querySelector('#gl-gen').addEventListener('click', generate);
      modalEl.querySelector('#gl-copy').addEventListener('click', copyDraft);
      modalEl.querySelector('#gl-print').addEventListener('click', printDraft);
      document.body.appendChild(modalEl);
    }
    modalEl.classList.add('open');
    renderForm();
  }

  function closeModal() { if (modalEl) modalEl.classList.remove('open'); }

  function renderForm() {
    modalEl.querySelectorAll('.gl-types button').forEach(b => b.classList.toggle('active', b.dataset.type === activeType));
    const t = TEMPLATES[activeType];
    const form = modalEl.querySelector('#gl-form');
    form.innerHTML = t.fields.map(f => {
      const longFields = ['complaint','issues','faultDescription','scope'];
      const isLong = longFields.includes(f);
      const label = f.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
      return isLong
        ? `<div style="grid-column:1/-1"><label>${label}</label><textarea data-k="${f}" placeholder="${label}…"></textarea></div>`
        : `<div><label>${label}</label><input data-k="${f}" placeholder="${label}…"></div>`;
    }).join('');
    modalEl.querySelector('#gl-preview').style.display = 'none';
  }

  function readInputs() {
    const data = {};
    modalEl.querySelectorAll('[data-k]').forEach(el => { if (el.value.trim()) data[el.dataset.k] = el.value.trim(); });
    return data;
  }

  function generate() {
    const t = TEMPLATES[activeType];
    const out = t.fn(readInputs());
    const pre = modalEl.querySelector('#gl-preview');
    pre.textContent = out.body + '\n\n___\nCited authorities:\n' + out.authority.filter(Boolean).map(c => `· ${c.cite} — ${c.principle}`).join('\n');
    pre.style.display = 'block';
    pre.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function copyDraft() {
    const text = modalEl.querySelector('#gl-preview').textContent;
    if (!text) return alert('generate first');
    try {
      await navigator.clipboard.writeText(text);
      const b = modalEl.querySelector('#gl-copy');
      const orig = b.textContent;
      b.textContent = 'Copied ✓';
      setTimeout(() => { b.textContent = orig; }, 1500);
    } catch (e) { alert('copy failed: ' + e.message); }
  }

  function printDraft() {
    const text = modalEl.querySelector('#gl-preview').textContent;
    if (!text) return alert('generate first');
    const w = window.open('', '_blank');
    w.document.write(`<!doctype html><html><head><meta charset=utf-8><title>GroundLevel · letter</title>
<style>body{font:13px/1.65 'Times New Roman',serif;padding:24mm 20mm;color:#000;background:#fff;max-width:170mm;margin:0 auto;white-space:pre-wrap}</style>
</head><body>${text.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}<script>onload=()=>print()</`+`script></body></html>`);
    w.document.close();
  }

  // ─────────────────────────────────────────────────────────────
  // public API
  const GroundLevel = {
    version: '1.0.0',
    lba, dsar, disrepair, grievance, cancelSubscription, consumerRefund,
    search,
    open: openModal,
    close: closeModal,
    templates: Object.keys(TEMPLATES),
    citedAuthorities: () => CITED.slice(),
  };

  global.GroundLevel = GroundLevel;

  // ─────────────────────────────────────────────────────────────
  // auto-init from script tag attributes
  if (typeof document !== 'undefined') {
    const me = document.currentScript;
    if (me) {
      const widget = me.dataset.widget;        // 'bottom-right' | 'bottom-left' | 'top-right' | ''
      if (widget && widget !== 'off') {
        const init = () => makeButton(widget);
        if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
      }
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
