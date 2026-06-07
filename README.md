# @sjgant80-hub/groundlevel-shim

> One `<script>` tag adds 6 cited UK legal letter templates + a floating widget to any website.
> Zero dependencies · works offline · MIT.

```
the law is public · the templates are simple · the jargon is the paywall
groundlevel-shim removes the paywall · for the 99% of sites that should
just hand visitors the right letter and stop pretending they can't
```

---

## Install · one line

```html
<script src="https://sjgant80-hub.github.io/groundlevel-shim/cdn/v1/groundlevel.js"
        data-widget="bottom-right"
        defer></script>
```

That's it. A floating "⚖ Need a letter?" button appears bottom-right.

### Or use the API only (no widget)

```html
<script src="https://sjgant80-hub.github.io/groundlevel-shim/cdn/v1/groundlevel.js" defer></script>
<script>
  const { body } = GroundLevel.lba({
    creditor: 'Jane Smith',
    debtor:   'Acme Corp Ltd',
    amount:   '$4,250',
    dueDate:  '2026-04-30',
    invoiceRef: 'INV-2026-031',
  });
  document.getElementById('letter').textContent = body;
</script>
```

---

## What's included

6 letter generators, each citing real UK statute + leading case authority:

| Function | Generates | Cites |
|---|---|---|
| `GroundLevel.lba(opts)` | Letter Before Action · PAP-Debt compliant | Mellor v Carfin · Denton v TH White |
| `GroundLevel.dsar(opts)` | Data Subject Access Request · UK GDPR Art 15 | Lloyd v Google · Vidal-Hall v Google |
| `GroundLevel.disrepair(opts)` | Section 11 LTA 1985 disrepair notice | Caridon v Shooltz · Spencer v Taylor |
| `GroundLevel.grievance(opts)` | ACAS-Code-compliant formal grievance | Polkey · Burchell · Sayers |
| `GroundLevel.cancelSubscription(opts)` | CCRs 2013 cancellation notice | OFT v Abbey National · Plevin |
| `GroundLevel.consumerRefund(opts)` | CRA 2015 ss.20-24 refund request | OFT v Abbey · ParkingEye v Beavis |

Each returns `{ title, body, authority }` where `body` is plain text ready to print or paste.

### Bonus

- `GroundLevel.search(query)` · offline search against the 20 bundled cited authorities
- `GroundLevel.citedAuthorities()` · returns the bundled cite set
- `GroundLevel.open(type)` · opens the modal widget at a specific template
- `GroundLevel.close()` · close the modal

### Widget options

Set on the `<script>` tag:
- `data-widget="bottom-right"` (default if set) · or `bottom-left` · `top-right` · `off`
- `data-worker="https://groundlevel-worker.example.workers.dev"` · (future) call the Worker for full SDK power

---

## Try it

Open the demo locally:
```bash
git clone https://github.com/sjgant80-hub/groundlevel-shim
cd groundlevel-shim
python3 -m http.server 8080
# → http://localhost:8080/demo/
```

Or live (once Pages catches up):
- https://sjgant80-hub.github.io/groundlevel-shim/demo/

---

## Test

```bash
node --test test/shim.test.js
```

12 assertions covering every template, the search, and the public API surface.

---

## CDN URLs

| Version | URL |
|---|---|
| v1 (current) | `https://sjgant80-hub.github.io/groundlevel-shim/cdn/v1/groundlevel.js` |
| latest (rolls forward, no SLA) | `https://sjgant80-hub.github.io/groundlevel-shim/cdn/latest/groundlevel.js` |

Pin to `v1` for production. The `v1/` URL is the long-term-stable contract.

---

## Sister packages

- [`@sjgant80-hub/groundlevel-sdk`](https://github.com/sjgant80-hub/groundlevel-sdk) · the full engines (Node + browser)
- [`@sjgant80-hub/groundlevel-worker`](https://github.com/sjgant80-hub/groundlevel-worker) · Cloudflare Worker REST API
- [`@sjgant80-hub/groundlevel-mcp`](https://github.com/sjgant80-hub/groundlevel-mcp) (next) · MCP server for Claude Code / Cursor
- [GroundLevel Pro](https://github.com/sjgant80-hub/groundlevel) · the full single-file PWA

---

## Caveats

- **Not legal advice.** Information and cited templates only. A solicitor reviews any letter before sending if your case is at all complex.
- **UK-focused.** Statutes cited are England & Wales. Letters are written in that frame. Adapt for Scotland / NI / other jurisdictions before sending.
- **Verify before sending.** Statutes drift. Open an issue if you spot a stale citation; PRs welcome.

---

## Licence

MIT · the law is public.

**◊·κ=φ⁴**
