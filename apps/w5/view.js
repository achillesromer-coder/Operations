import { W5_CONFIG } from './config.js';

const STYLE_ID = 'operations-w5-styles';

function formatNumber(value, decimals = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(decimals) : '—';
}

function fieldLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .replace('Utc', 'UTC')
    .replace('Dts', 'DTS')
    .replace('Dv', 'dV')
    .replace('Gmat', 'GMAT');
}

export function injectW5Styles(documentRef = document) {
  if (documentRef.getElementById(STYLE_ID)) return;
  const style = documentRef.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .ri-w5{font-family:Inter,system-ui,sans-serif;background:#090d12;color:#e9e9e4;border:1px solid rgba(0,255,136,.35);border-radius:18px;overflow:hidden;box-shadow:0 20px 70px rgba(0,0,0,.35)}
    .ri-w5__header{padding:20px 22px;background:linear-gradient(135deg,rgba(0,255,136,.12),rgba(23,35,52,.8));border-bottom:1px solid rgba(0,255,136,.25);display:flex;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap}
    .ri-w5__eyebrow{font:700 11px/1.2 JetBrains Mono,monospace;letter-spacing:.18em;color:${W5_CONFIG.accent};text-transform:uppercase;margin-bottom:6px}
    .ri-w5__title{font-size:24px;font-weight:760;margin:0;color:#fff}.ri-w5__subtitle{font-size:13px;color:#c7d0d9;max-width:760px;margin-top:6px}
    .ri-w5__grid{display:grid;grid-template-columns:minmax(260px,390px) 1fr;gap:0}.ri-w5__panel{padding:18px;border-right:1px solid rgba(255,255,255,.08)}.ri-w5__output{padding:18px}
    .ri-w5__form{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ri-w5__field{display:flex;flex-direction:column;gap:5px}.ri-w5__field--wide{grid-column:1/-1}.ri-w5__field label{font:700 10px/1.2 JetBrains Mono,monospace;color:#8a96a3;text-transform:uppercase;letter-spacing:.08em}.ri-w5__field input,.ri-w5__field select{background:#0f1621;border:1px solid #263348;color:#fff;border-radius:10px;padding:9px 10px;font-size:12px;min-width:0}
    .ri-w5__actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.ri-w5__btn{border:1px solid rgba(0,255,136,.45);background:rgba(0,255,136,.12);color:#e9e9e4;border-radius:999px;padding:9px 13px;font-size:12px;font-weight:700;cursor:pointer}.ri-w5__btn--primary{background:${W5_CONFIG.accent};color:#030706}.ri-w5__btn:disabled{opacity:.5;cursor:not-allowed}
    .ri-w5__cards{display:grid;grid-template-columns:repeat(4,minmax(120px,1fr));gap:10px;margin-bottom:14px}.ri-w5__card{background:#11161d;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:13px}.ri-w5__card-label{font:700 10px/1.2 JetBrains Mono,monospace;color:#8a96a3;text-transform:uppercase;letter-spacing:.08em}.ri-w5__card-value{font-size:22px;font-weight:760;margin-top:7px;color:#fff}.ri-w5__card-unit{font-size:11px;color:#8a96a3;margin-left:3px}
    .ri-w5__split{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ri-w5__box{background:#0f1621;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:13px;overflow:auto}.ri-w5__box h4{margin:0 0 9px 0;color:#fff;font-size:13px}.ri-w5__kv{display:flex;justify-content:space-between;gap:14px;border-bottom:1px solid rgba(255,255,255,.06);padding:6px 0;font-size:12px}.ri-w5__kv span:first-child{color:#8a96a3}.ri-w5__kv span:last-child{font-family:JetBrains Mono,monospace;color:#e9e9e4;text-align:right}.ri-w5__pre{white-space:pre-wrap;font:11px/1.45 JetBrains Mono,monospace;color:#c7d0d9;margin:0;max-height:360px;overflow:auto}.ri-w5__table{width:100%;border-collapse:collapse;font-size:12px}.ri-w5__table th,.ri-w5__table td{border-bottom:1px solid rgba(255,255,255,.07);padding:7px;text-align:right}.ri-w5__table th:first-child,.ri-w5__table td:first-child{text-align:left}.ri-w5__table th{color:#8a96a3;font-size:10px;text-transform:uppercase;letter-spacing:.06em}.ri-w5__status{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:6px 10px;background:rgba(0,255,136,.12);border:1px solid rgba(0,255,136,.28);font:700 11px/1 JetBrains Mono,monospace;color:${W5_CONFIG.accent}}
    @media(max-width:900px){.ri-w5__grid,.ri-w5__split{grid-template-columns:1fr}.ri-w5__panel{border-right:0;border-bottom:1px solid rgba(255,255,255,.08)}.ri-w5__cards{grid-template-columns:1fr 1fr}.ri-w5__form{grid-template-columns:1fr}}
  `;
  documentRef.head.appendChild(style);
}

export function renderW5(target, state, handlers = {}) {
  injectW5Styles(target.ownerDocument || document);
  const inputs = state.inputs || W5_CONFIG.defaultInputs;
  const result = state.result || {};
  const jobRequest = state.jobRequest || null;
  const sweep = state.sweep || [];

  target.innerHTML = `
    <section class="ri-w5" data-module="${W5_CONFIG.moduleId}">
      <header class="ri-w5__header">
        <div>
          <div class="ri-w5__eyebrow">${W5_CONFIG.workspaceId} · ${W5_CONFIG.protocol}</div>
          <h2 class="ri-w5__title">${W5_CONFIG.title}</h2>
          <div class="ri-w5__subtitle">${W5_CONFIG.subtitle}</div>
        </div>
        <div class="ri-w5__status">● GMAT CONTRACT STAGING</div>
      </header>
      <div class="ri-w5__grid">
        <aside class="ri-w5__panel">
          <form class="ri-w5__form" data-role="w5-form">
            ${Object.entries(W5_CONFIG.defaultInputs).map(([key, defaultValue]) => {
              const value = inputs[key] ?? defaultValue;
              const wide = ['missionId', 'missionType', 'targetBody', 'epochUtc', 'coordinateSystem', 'forceModel', 'propagator'].includes(key);
              const type = typeof defaultValue === 'number' ? 'number' : 'text';
              const step = Number.isInteger(defaultValue) ? '1' : '0.001';
              return `<div class="ri-w5__field ${wide ? 'ri-w5__field--wide' : ''}">
                <label for="w5-${key}">${fieldLabel(key)}</label>
                <input id="w5-${key}" name="${key}" type="${type}" step="${step}" value="${String(value).replace(/"/g, '&quot;')}" />
              </div>`;
            }).join('')}
          </form>
          <div class="ri-w5__actions">
            <button class="ri-w5__btn ri-w5__btn--primary" data-action="run">Run W5 screen</button>
            <button class="ri-w5__btn" data-action="build-job">Build GMAT job</button>
            <button class="ri-w5__btn" data-action="export" ${jobRequest ? '' : 'disabled'}>Export JSON</button>
            <button class="ri-w5__btn" data-action="reset">Reset</button>
          </div>
        </aside>
        <main class="ri-w5__output">
          <div class="ri-w5__cards">
            <div class="ri-w5__card"><div class="ri-w5__card-label">Total dV</div><div class="ri-w5__card-value">${formatNumber(result.requiredDeltaVkmS)}<span class="ri-w5__card-unit">km/s</span></div></div>
            <div class="ri-w5__card"><div class="ri-w5__card-label">dV margin</div><div class="ri-w5__card-value">${formatNumber(result.deltaVMarginKmS)}<span class="ri-w5__card-unit">km/s</span></div></div>
            <div class="ri-w5__card"><div class="ri-w5__card-label">Steps</div><div class="ri-w5__card-value">${formatNumber(result.propagationSteps, 0)}</div></div>
            <div class="ri-w5__card"><div class="ri-w5__card-label">DTS</div><div class="ri-w5__card-value">${formatNumber(result.dts, 3)}</div></div>
          </div>
          <div class="ri-w5__split">
            <div class="ri-w5__box">
              <h4>Mission closure</h4>
              <div class="ri-w5__kv"><span>Target</span><span>${result.targetBody || '—'}</span></div>
              <div class="ri-w5__kv"><span>Arrival UTC</span><span>${result.arrivalUtc || '—'}</span></div>
              <div class="ri-w5__kv"><span>Wet mass</span><span>${formatNumber(result.wetMassKg, 1)} kg</span></div>
              <div class="ri-w5__kv"><span>Propellant fraction</span><span>${formatNumber((result.propellantFraction || 0) * 100, 1)}%</span></div>
              <div class="ri-w5__kv"><span>Available dV</span><span>${formatNumber(result.availableDeltaVkmS)} km/s</span></div>
              <div class="ri-w5__kv"><span>DTS gate</span><span>${result.passDtsFloor ? 'PASS' : 'REVIEW'}</span></div>
            </div>
            <div class="ri-w5__box">
              <h4>GMAT job request</h4>
              <pre class="ri-w5__pre">${jobRequest ? JSON.stringify(jobRequest, null, 2) : 'Run screen, then build GMAT job request.'}</pre>
            </div>
          </div>
          <div class="ri-w5__box" style="margin-top:12px">
            <h4>Departure-window sweep</h4>
            <table class="ri-w5__table">
              <thead><tr><th>Epoch</th><th>Required dV</th><th>dV margin</th><th>DTS</th><th>Gate</th></tr></thead>
              <tbody>${sweep.map((row) => `<tr><td>${row.epochUtc}</td><td>${formatNumber(row.requiredDeltaVkmS)}</td><td>${formatNumber(row.deltaVMarginKmS)}</td><td>${formatNumber(row.dts, 3)}</td><td>${row.passDtsFloor ? 'PASS' : 'REVIEW'}</td></tr>`).join('') || '<tr><td colspan="5">No sweep generated.</td></tr>'}</tbody>
            </table>
          </div>
        </main>
      </div>
    </section>
  `;

  target.querySelector('[data-action="run"]')?.addEventListener('click', handlers.onRun);
  target.querySelector('[data-action="build-job"]')?.addEventListener('click', handlers.onBuildJob);
  target.querySelector('[data-action="export"]')?.addEventListener('click', handlers.onExport);
  target.querySelector('[data-action="reset"]')?.addEventListener('click', handlers.onReset);
}

export default { renderW5, injectW5Styles };
