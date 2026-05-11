import { W3_CONFIG } from './config.js';

const fmt = new Intl.NumberFormat('en-AU', { maximumFractionDigits: 3 });

function metric(label, value, unit = '') {
  return `<div class="ri-metric"><span>${label}</span><strong>${fmt.format(value)}${unit ? ` ${unit}` : ''}</strong></div>`;
}

export function renderW3Shell(target, state) {
  const cfg = state.config || W3_CONFIG;
  target.innerHTML = `
    <section class="ri-w3">
      <header class="ri-w3__header">
        <div>
          <p class="ri-kicker">${cfg.workspaceId} · ${cfg.protocol}</p>
          <h2>${cfg.title}</h2>
          <p>${cfg.subtitle}</p>
        </div>
        <nav>${['W1','W2','W3','W4','W5','W6'].map(w => `<a class="${w === 'W3' ? 'active' : ''}" href="/operations/${w.toLowerCase()}">${w}</a>`).join('')}</nav>
      </header>
      <div class="ri-w3__grid">
        <form class="ri-panel" data-role="w3-form">
          <h3>Formation Inputs</h3>
          ${renderInput('spinRateRpm', 'Spin rate', 'rpm', state.inputs.spinRateRpm)}
          ${renderInput('magneticFieldT', 'Magnetic field', 'T', state.inputs.magneticFieldT, '0.01')}
          ${renderInput('formationSeparationM', 'Formation separation', 'm', state.inputs.formationSeparationM)}
          ${renderInput('phaseOffsetDeg', 'Phase offset', 'deg', state.inputs.phaseOffsetDeg)}
          ${renderInput('nodeCount', 'Node count', 'nodes', state.inputs.nodeCount)}
          ${renderInput('powerKw', 'Power', 'kW', state.inputs.powerKw)}
          ${renderInput('dutyCycle', 'Duty cycle', '0-1', state.inputs.dutyCycle, '0.01')}
          ${renderInput('targetMassKg', 'Target mass', 'kg', state.inputs.targetMassKg)}
          ${renderInput('resonanceEfficiency', 'Resonance efficiency', '0-1', state.inputs.resonanceEfficiency, '0.01')}
          ${renderInput('fieldCoupling', 'Field coupling', '0-1', state.inputs.fieldCoupling, '0.01')}
          ${renderInput('runHours', 'Run duration', 'h', state.inputs.runHours, '0.1')}
          <div class="ri-actions">
            <button type="submit">Run RMS Screen</button>
            <button type="button" data-action="w3-reset">Reset</button>
            <button type="button" data-action="w3-export">Export JSON</button>
          </div>
        </form>
        <article class="ri-panel" data-role="w3-results"></article>
        <article class="ri-panel" data-role="w3-sweep"></article>
      </div>
    </section>`;
}

function renderInput(name, label, unit, value, step = '1') {
  return `<label><span>${label}<small>${unit}</small></span><input name="${name}" type="number" step="${step}" value="${value}"></label>`;
}

export function renderW3Results(target, result) {
  if (!target) return;
  const o = result.outputs;
  target.innerHTML = `
    <h3>RMS Output</h3>
    ${metric('Usable power', o.usablePowerKw, 'kW')}
    ${metric('Energy draw', o.energyKwh, 'kWh')}
    ${metric('Resonance yield proxy', o.resonanceYieldKg, 'kg')}
    ${metric('Mass processed', o.massFractionProcessed * 100, '%')}
    ${metric('Formation gain', o.formationGain)}
    ${metric('Thermal load index', o.thermalLoadIndex)}
    ${metric('Stability index', o.stabilityIndex)}
    ${metric('Readiness score', o.readinessScore)}
    <p class="ri-note">${result.validation.assumptions.join(' ')}</p>`;
}

export function renderW3Sweep(target, rows = []) {
  if (!target) return;
  target.innerHTML = `
    <h3>Power Sweep</h3>
    <table><thead><tr><th>kW</th><th>Yield kg</th><th>Stability</th><th>DTS</th></tr></thead><tbody>
      ${rows.map(r => `<tr><td>${fmt.format(r.powerKw)}</td><td>${fmt.format(r.resonanceYieldKg)}</td><td>${fmt.format(r.stabilityIndex)}</td><td>${fmt.format(r.readinessScore)}</td></tr>`).join('')}
    </tbody></table>`;
}

export function injectW3Styles(root = document) {
  if (root.getElementById('ri-w3-styles')) return;
  const style = root.createElement('style');
  style.id = 'ri-w3-styles';
  style.textContent = `
    .ri-w3{font-family:Inter,system-ui,sans-serif;background:#0a0e1a;color:#e8eaf0;border-bottom:3px solid #ff3366}.ri-w3__header{display:flex;gap:1rem;align-items:center;justify-content:space-between;padding:1rem;background:#1a1f2e;border-bottom:1px solid #3a4059;flex-wrap:wrap}.ri-kicker{color:#ff3366;text-transform:uppercase;letter-spacing:.08em;font-size:.72rem;margin:0}.ri-w3 h2,.ri-w3 h3{margin:.15rem 0;color:#ff3366}.ri-w3 p{color:#8b92a8}.ri-w3 nav{display:flex;gap:.35rem;flex-wrap:wrap}.ri-w3 nav a{padding:.25rem .55rem;border:1px solid #3a4059;border-radius:5px;color:#8b92a8;text-decoration:none}.ri-w3 nav a.active{border-color:#ff3366;color:#ff3366;background:#ff33661a}.ri-w3__grid{display:grid;grid-template-columns:minmax(260px,.9fr) 1fr 1fr;gap:.75rem;padding:.75rem}@media(max-width:900px){.ri-w3__grid{grid-template-columns:1fr}}.ri-panel{background:#1a1f2e;border:1px solid #3a4059;border-radius:8px;padding:.85rem}.ri-panel label{display:grid;grid-template-columns:1fr 120px;align-items:center;gap:.75rem;margin:.45rem 0}.ri-panel label span{font-size:.78rem;color:#e8eaf0}.ri-panel label small{display:block;color:#8b92a8}.ri-panel input{background:#0a0e1a;border:1px solid #3a4059;border-radius:5px;color:#e8eaf0;padding:.42rem}.ri-actions{display:flex;gap:.45rem;flex-wrap:wrap;margin-top:.7rem}.ri-actions button{background:#ff33661a;border:1px solid #ff3366;color:#ff6b9d;border-radius:5px;padding:.45rem .7rem;font-weight:700}.ri-metric{display:flex;justify-content:space-between;border-bottom:1px solid rgba(58,64,89,.55);padding:.38rem 0;font-size:.82rem}.ri-metric span{color:#8b92a8}.ri-metric strong{color:#ff6b9d}.ri-note{font-size:.75rem;line-height:1.5}.ri-panel table{width:100%;border-collapse:collapse;font-size:.78rem}.ri-panel th,.ri-panel td{border-bottom:1px solid #3a4059;padding:.42rem;text-align:right}.ri-panel th:first-child,.ri-panel td:first-child{text-align:left}`;
  root.head.appendChild(style);
}

export default { renderW3Shell, renderW3Results, renderW3Sweep, injectW3Styles };
