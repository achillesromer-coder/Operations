# W2 GOS Luke II Catch/Hold

This folder is the modular extraction of the legacy Operations file `W2; GOS`.

## Source

- Legacy source: `W2; GOS`
- New entrypoint: `apps/w2/index.js`
- LightSpeed mount contract: `export async function mount(ctx) {}`

## Extraction map

| Legacy concern | New file |
|---|---|
| Workspace identity, routes, tracker content, storage keys | `config.js` |
| Catch/hold force envelope and current sweep calculations | `calculations.js` |
| DOM rendering and embedded module CSS | `view.js` |
| Event bindings, local persistence, export, audit events | `events.js` |
| Public loader entrypoint | `index.js` |

## Operating boundary

W2 remains a browser-side electromagnetic catch/hold screening workspace. It receives deposit and target context from W1, EMFF field constraints from W3, and trajectory/rendezvous constraints from W5. It emits hold-force and station-keep data to W4 and W6.

## Validation status

- Legacy `W2; GOS` preserved.
- Inline script responsibilities moved into module lifecycle.
- Browser-global state avoided.
- Audit events emitted via `ctx.emitAudit`, `ctx.emit`, or fallback `ri:audit` event.

## Next integration

Wire this module through the LightSpeed page manifest:

```json
{
  "pageId": "operations-w2",
  "route": "/operations/w2",
  "repo": "Operations",
  "modulePath": "apps/w2/index.js",
  "exportName": "mount"
}
```
