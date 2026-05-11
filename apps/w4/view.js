import { W4_CONFIG } from './config.js';

const fmt = new Intl.NumberFormat('en-AU', { maximumFractionDigits: 3 });

function metric(label, value, unit = '') {
  return `<div class="ri-metric"><span>${label}</span><strong>${fmt.format(value)}${unit ? ` ${unit}` : ''}</strong></div>`;
}

function renderInput(name, label, unit, value, step = '1') {
  return `<label><span>${label}<small>${unit}</small></span><input name="${name}" type="number" step="${step}" value="${value}"></label>`;
}

export function renderW4Shell(target, state) {
  const cfg = state.config || W4_CONFIG;
  target.innerHTML = `
    <section class="ri-w4">
      <header class="ri-w4__header">
        <div>
          <p class="ri-kicker">${cfg.workspaceId} · ${cfg.protocol}</p>
          <h2>${cfg.title}</h2>
          <p>${cfg.subtitle}</p>
        </div>
        <nav>${['W1','W2','W3','W4','W5','W6'].map(w => `<a class="${w === 'W4' ? 'active' : ''}" href="/operations/${w.toLowerCase()}">${w}</a>`).join('')}</nav>
      </header>
      <div class="ri-w4__grid">
        <form class="ri-panel" data-role="w4-form">
          <h3>Supply-Chain Inputs</h3>
          ${renderInput('transferDeltaVkmS', 'Transfer Δv', 'km/s', state.inputs.transferDeltaVkmS, '0.01')}
          ${renderInput('transitDays', 'Transit duration', 'days', state.inputs.transitDays)}
          ${renderInput('payloadTonnes', 'Outbound payload', 't', state.inputs.payloadTonnes, '0.1')}
          ${renderInput('dryMassTonnes', 'Dry mass', 't', state.inputs.dryMassTonnes, '0.1')}
          ${renderInput('propellantTonnes', 'Propellant mass', 't', state.inputs.propellantTonnes, '0.1')}
          ${renderInput('nodeCount', 'Corridor node count', 'nodes', state.inputs.nodeCount)}
          ${renderInput('nodeReliability', 'Node reliability', '0-1', state.inputs.nodeReliability, '0.01')}
          ${renderInput('launchCadenceDays', 'Launch cadence', 'days', state.inputs.launchCadenceDays)}
          ${renderInput('supplyBufferPercent', 'Supply buffer', '%', state.inputs.supplyBufferPercent)}
          ${renderInput('returnMassTonnes', 'Return mass', 't', state.inputs.returnMassTonnes, '0.1')}
          ${renderInput('riskMultiplier', 'Risk multiplier', 'x', state.inputs.riskMultiplier, '0.01')}
          ${renderInput('carbonCostTonnes', 'Carbon cost', 'tCO2e', state.inputs.carbonCostTonnes, '0.1')}
          <div class="ri-actions">
            <button type="submit">Run Corridor Screen</button>
            <button type="button" data-action="w4-reset">Reset</button>
            <button type="button" data-action="w4-export">Export JSON</button>
          </div>
        </form>
        <article class="ri-panel" data-role="w4-results"></article>
        <article class="ri-panel" data-role="w4-sweep"></article>
      </div>
    </section>`;
}

export function renderW4Results(target, result) {
  if (!target) return;
  const o = result.outputs;
  target.innerHTML = `
    <h3>Corridor Output</h3>
    ${metric('Wet mass', o.wetMassTonnes, 't')}
    ${metric('Propellant fraction', o.propellantFraction * 100, '%')}
    ${metric('Annual launches', o.annualLaunches)}
    ${metric('Annual payload', o.annualPayloadTonnes, 't')}
    ${metric('Round-trip cycle', o.roundTripDays, 'days')}
    ${metric('Node network reliability', o.nodeNetworkReliability * 100, '%')}
    ${metric('Throughput', o.throughputTonnesPerDay, 't/day')}
    ${metric('Return ratio', o.returnRatio)}
    ${metric('Carbon intensity', o.carbonPerPayloadTonne, 'tCO2e/t')}
    ${metric('Logistics risk index', o.logisticsRiskIndex)}
    ${metric('DTS readiness', o.dts)}
    <p class="ri-note">${result.validation.assumptions.join(' ')}</p>`;
}

export function renderW4Sweep(target, rows = []) {
  if (!target) return;
  target.innerHTML = `
    <h3>Cadence Sweep</h3>
    <table>
      <thead><tr><th>Cadence</th><th>Annual Payload</th><th>Risk</th><th>DTS</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${fmt.format(r.launchCadenceDays)} d</td><td>${fmt.format(r.annualPayloadTonnes)} t</td><td>${fmt.format(r.logisticsRiskIndex)}</td><td>${fmt.format(r.dts)}</td></tr>`).join('')}</tbody>
    </table>`;
}

export function injectW4Styles(root = document) {
  if (root.getElementById('ri-w4-styles')) return;
  const style = root.createElement('style');
  style.id = 'ri-w4-styles';
  style.textContent = `
    .ri-w4{font-family:Inter,system-ui,sans-serif;background:#0b0f14;color:#e8dfdc;border-bottom:3px solid #ffaa00}.ri-w4__header{display:flex;gap:1rem;align-items:center;justify-content:space-between;padding:1rem;background:#172334;border-bottom:1px solid #275a66;flex-wrap:wrap}.ri-kicker{color:#ffdc57;text-transform:uppercase;letter-spacing:.08em;font-size:.72rem;margin:0}.ri-w4 h2,.ri-w4 h3{margin:.15rem 0;color:#ffdc57}.ri-w4 p{color:#c9a84a}.ri-w4 nav{display:flex;gap:.35rem;flex-wrap:wrap}.ri-w4 nav a{padding:.25rem .55rem;border:1px solid #275a66;border-radius:5px;color:#aea38e;text-decoration:none}.ri-w4 nav a.active{border-color:#ffdc57;color:#ffdc57;background:#ffdc571a}.ri-w4__grid{display:grid;grid-template-columns:minmax(270px,.9fr) 1fr 1fr;gap:.75rem;padding:.75rem}@media(max-width:900px){.ri-w4__grid{grid-template-columns:1fr}}.ri-panel{background:#11161d;border:1px solid #275a66;border-radius:8px;padding:.85rem}.ri-panel label{display:grid;grid-template-columns:1fr 125px;align-items:center;gap:.75rem;margin:.45rem 0}.ri-panel label span{font-size:.78rem;color:#e8dfdc}.ri-panel label small{display:block;color:#789096}.ri-panel input{background:#090d12;border:1px solid #275a66;border-radius:5px;color:#e8dfdc;padding:.42rem}.ri-actions{display:flex;gap:.45rem;flex-wrap:wrap;margin-top:.7rem}.ri-actions button{background:#bb74321a;border:1px solid #bb7432;color:#ffdc57;border-radius:5px;padding:.45rem .7rem;font-weight:700}.ri-metric{display:flex;justify-content:space-between;border-bottom:1px solid rgba(39,90,102,.55);padding:.38rem 0;font-size:.82rem}.ri-metric span{color:#789096}.ri-metric strong{color:#ffdc57}.ri-note{font-size:.75rem;line-height:1.5}.ri-panel table{width:100%;border-collapse:collapse;font-size:.78rem}.ri-panel th,.ri-panel td{border-bottom:1px solid #275a66;padding:.42rem;text-align:right}.ri-panel th:first-child,.ri-panel td:first-child{text-align:left}`;
  root.head.appendChild(style);
}

export default { renderW4Shell, renderW4Results, renderW4Sweep, injectW4Styles };
