import { W6_CONFIG } from './config.js';

const STYLE_ID = 'operations-w6-styles';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .ri-w6 { color: #e9e9e4; background: #090d12; border: 1px solid rgba(183,251,97,.18); border-radius: 18px; padding: 18px; font-family: Inter, system-ui, sans-serif; }
    .ri-w6 h2 { margin: 0 0 4px; color: ${W6_CONFIG.accent}; letter-spacing: .02em; }
    .ri-w6 p { color: #789096; margin: 0; }
    .ri-w6-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 16px; }
    .ri-w6-card, .ri-w6-panel { background: rgba(20,62,94,.35); border: 1px solid rgba(232,223,220,.1); border-radius: 14px; padding: 14px; }
    .ri-w6-card strong { display: block; font-size: 1.35rem; color: #ffdc57; }
    .ri-w6-card span, .ri-w6 label { color: #789096; font-size: .83rem; }
    .ri-w6-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; margin-top: 16px; }
    .ri-w6 input, .ri-w6 select { width: 100%; box-sizing: border-box; margin-top: 4px; padding: 9px 10px; border-radius: 10px; border: 1px solid rgba(120,144,150,.28); background: #0b0f14; color: #e9e9e4; }
    .ri-w6-actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
    .ri-w6 button { border: 0; border-radius: 10px; padding: 10px 12px; background: ${W6_CONFIG.accent}; color: #030706; font-weight: 700; cursor: pointer; }
    .ri-w6 button.secondary { background: #275a66; color: #e9e9e4; }
    .ri-w6 table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: .88rem; }
    .ri-w6 th, .ri-w6 td { border-bottom: 1px solid rgba(232,223,220,.09); padding: 8px; text-align: left; }
    .ri-w6 pre { white-space: pre-wrap; overflow: auto; background: #030706; border-radius: 12px; padding: 12px; color: #b7fb61; }
  `;
  document.head.appendChild(style);
}

function formatNumber(value, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '0.00';
}

function inputField([key, value]) {
  const type = typeof value === 'number' ? 'number' : 'text';
  const step = type === 'number' ? 'step="any"' : '';
  return `<label>${key}<input name="${key}" type="${type}" ${step} value="${value}"></label>`;
}

export function renderPlatformAssetWorkspace(target, state, handlers = {}) {
  ensureStyles();
  const result = state.result;
  const cards = result ? [
    ['Power margin', `${formatNumber(result.powerMarginKW)} kW`],
    ['Battery endurance', `${formatNumber(result.enduranceHours)} h`],
    ['Readiness', `${formatNumber(result.readinessScore, 1)}%`],
    ['DTS proxy', formatNumber(result.dts, 3)]
  ] : W6_CONFIG.statusCards.map((card) => [card.label, `-- ${card.unit}`]);

  target.innerHTML = `
    <section class="ri-w6" data-module="${W6_CONFIG.moduleId}">
      <header>
        <h2>${W6_CONFIG.title}</h2>
        <p>${W6_CONFIG.subtitle}</p>
      </header>
      <div class="ri-w6-grid">
        ${cards.map(([label, value]) => `<article class="ri-w6-card"><span>${label}</span><strong>${value}</strong></article>`).join('')}
      </div>
      <form class="ri-w6-form" data-role="w6-form">
        ${Object.entries(state.inputs).map(inputField).join('')}
      </form>
      <div class="ri-w6-actions">
        <button data-action="run">Run W6 screen</button>
        <button data-action="asset-record" class="secondary">Build asset record</button>
        <button data-action="export" class="secondary">Export JSON</button>
        <button data-action="reset" class="secondary">Reset</button>
      </div>
      <div class="ri-w6-panel">
        <h3>Platform library readiness</h3>
        ${renderAssetRows(state.assetRows)}
      </div>
      <div class="ri-w6-panel">
        <h3>Asset record</h3>
        <pre>${state.assetRecord ? JSON.stringify(state.assetRecord, null, 2) : 'Run screen, then build an asset record.'}</pre>
      </div>
    </section>
  `;

  target.querySelector('[data-action="run"]')?.addEventListener('click', handlers.onRun);
  target.querySelector('[data-action="asset-record"]')?.addEventListener('click', handlers.onBuildAssetRecord);
  target.querySelector('[data-action="export"]')?.addEventListener('click', handlers.onExport);
  target.querySelector('[data-action="reset"]')?.addEventListener('click', handlers.onReset);
}

export function renderAssetRows(rows = []) {
  if (!rows.length) return '<p>No platform library rows generated.</p>';
  return `
    <table>
      <thead><tr><th>Asset</th><th>Class</th><th>Power margin</th><th>Endurance</th><th>Readiness</th><th>DTS</th><th>Status</th></tr></thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td>${row.assetId}</td>
            <td>${row.platformClass}</td>
            <td>${formatNumber(row.powerMarginKW)} kW</td>
            <td>${formatNumber(row.enduranceHours)} h</td>
            <td>${formatNumber(row.readinessScore, 1)}%</td>
            <td>${formatNumber(row.dts, 3)}</td>
            <td>${row.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
