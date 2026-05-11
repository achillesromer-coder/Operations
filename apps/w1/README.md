# W1 Incoming Deposit Analysis

This folder is the non-destructive modular extraction of the legacy Operations file `W1; IDA`.

## Source

- Legacy source: `W1; IDA`
- New entrypoint: `apps/w1/index.js`
- LightSpeed mount contract: `export async function mount(ctx) {}`

## Extraction map

| Legacy concern | New file |
|---|---|
| Editable labels, routes, storage keys, task tracker content | `config.js` |
| Material constants, station presets, atmosphere layers, validation ranges | `presets.js` |
| Pure capture and sweep calculations | `calculations.js` |
| HTML rendering and CSS | `view.js` |
| Button/form bindings, chart rendering, local persistence, audit events | `events.js` |
| Public loader entrypoint | `index.js` |

## Operating boundary

Browser-side W1 is a screening workspace. It can create draft records, run local calculations, render charts, and stage data for dataspace or sheet commit. It does not execute GMAT. GMAT work is routed through W5 / GMAT queue / local bridge.

## Validation status

- Legacy file preserved.
- Module is dependency-light.
- Chart.js is lazy-loaded only when W1 mounts.
- State is local/session storage compatible.
- Audit events are emitted through `ctx.emitAudit`, `ctx.emit`, or fallback browser event.

## Next integration

Wire this module through LightSpeed manifest:

```json
{
  "pageId": "operations-w1",
  "route": "/operations/w1",
  "repo": "Operations",
  "modulePath": "apps/w1/index.js",
  "exportName": "mount"
}
```
