const SOLAR_DERATE = 0.76;

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizePlatformAssetInput(input = {}, defaults = {}) {
  const merged = { ...defaults, ...input };
  return {
    ...merged,
    dryMassKg: asNumber(merged.dryMassKg, defaults.dryMassKg),
    payloadCapacityKg: asNumber(merged.payloadCapacityKg, defaults.payloadCapacityKg),
    solarHullAreaM2: asNumber(merged.solarHullAreaM2, defaults.solarHullAreaM2),
    solarEfficiencyPct: asNumber(merged.solarEfficiencyPct, defaults.solarEfficiencyPct),
    averageSolarFluxWm2: asNumber(merged.averageSolarFluxWm2, defaults.averageSolarFluxWm2),
    batteryCapacityKWh: asNumber(merged.batteryCapacityKWh, defaults.batteryCapacityKWh),
    dischargePowerKW: asNumber(merged.dischargePowerKW, defaults.dischargePowerKW),
    rfsPowerKW: asNumber(merged.rfsPowerKW, defaults.rfsPowerKW),
    emffPowerKW: asNumber(merged.emffPowerKW, defaults.emffPowerKW),
    avionicsPowerKW: asNumber(merged.avionicsPowerKW, defaults.avionicsPowerKW),
    thermalPowerKW: asNumber(merged.thermalPowerKW, defaults.thermalPowerKW),
    redundancyFactor: asNumber(merged.redundancyFactor, defaults.redundancyFactor),
    sparesMassKg: asNumber(merged.sparesMassKg, defaults.sparesMassKg),
    commsReliabilityPct: asNumber(merged.commsReliabilityPct, defaults.commsReliabilityPct),
    propulsionReliabilityPct: asNumber(merged.propulsionReliabilityPct, defaults.propulsionReliabilityPct),
    extractionReliabilityPct: asNumber(merged.extractionReliabilityPct, defaults.extractionReliabilityPct),
    dataReadinessPct: asNumber(merged.dataReadinessPct, defaults.dataReadinessPct),
    gmatContractReadinessPct: asNumber(merged.gmatContractReadinessPct, defaults.gmatContractReadinessPct),
    mplPublishReadinessPct: asNumber(merged.mplPublishReadinessPct, defaults.mplPublishReadinessPct)
  };
}

export function simulatePlatformAsset(input = {}, defaults = {}) {
  const asset = normalizePlatformAssetInput(input, defaults);
  const generatedSolarKW = (asset.solarHullAreaM2 * asset.averageSolarFluxWm2 * (asset.solarEfficiencyPct / 100) * SOLAR_DERATE) / 1000;
  const requiredPowerKW = (asset.rfsPowerKW + asset.emffPowerKW + asset.avionicsPowerKW + asset.thermalPowerKW) * asset.redundancyFactor;
  const totalAvailablePowerKW = asset.dischargePowerKW + generatedSolarKW;
  const powerMarginKW = totalAvailablePowerKW - requiredPowerKW;
  const enduranceHours = requiredPowerKW > 0 ? asset.batteryCapacityKWh / requiredPowerKW : 0;
  const massWithSparesKg = asset.dryMassKg + asset.payloadCapacityKg + asset.sparesMassKg;

  const reliabilityScore = (asset.commsReliabilityPct + asset.propulsionReliabilityPct + asset.extractionReliabilityPct) / 3;
  const dataScore = (asset.dataReadinessPct + asset.gmatContractReadinessPct + asset.mplPublishReadinessPct) / 3;
  const powerScore = clamp((powerMarginKW + 25) / 50, 0, 1) * 100;
  const enduranceScore = clamp(enduranceHours / 8, 0, 1) * 100;
  const readinessScore = (reliabilityScore * 0.34) + (dataScore * 0.24) + (powerScore * 0.24) + (enduranceScore * 0.18);
  const dts = clamp((readinessScore / 100) * 0.68 + clamp(powerMarginKW / 80, 0, 0.18) + clamp(enduranceHours / 24, 0, 0.14), 0, 1);

  const status = readinessScore >= 80 && dts >= 0.74
    ? 'mission-ready'
    : readinessScore >= 65
      ? 'integration-watch'
      : 'engineering-hold';

  return {
    asset,
    generatedSolarKW,
    requiredPowerKW,
    totalAvailablePowerKW,
    powerMarginKW,
    enduranceHours,
    massWithSparesKg,
    reliabilityScore,
    dataScore,
    readinessScore,
    dts,
    status,
    timestamp: new Date().toISOString()
  };
}

export function createPlatformLibraryRows(input = {}, defaults = {}) {
  const base = normalizePlatformAssetInput(input, defaults);
  const variants = [
    { platformClass: 'Mark IP', assetId: 'mark-ip-poc', dryMassKg: 48, payloadCapacityKg: 8, rfsPowerKW: 4, emffPowerKW: 2, dischargePowerKW: 12, batteryCapacityKWh: 18, solarHullAreaM2: 3.5 },
    { platformClass: 'Mark III', assetId: 'mark-iii-alpha', dryMassKg: 850, payloadCapacityKg: 120, rfsPowerKW: 34, emffPowerKW: 26, dischargePowerKW: 95, batteryCapacityKWh: 240, solarHullAreaM2: 42 },
    { platformClass: 'Mark V', assetId: 'mark-v-capture-node', dryMassKg: 1240, payloadCapacityKg: 210, rfsPowerKW: 44, emffPowerKW: 38, dischargePowerKW: 140, batteryCapacityKWh: 360, solarHullAreaM2: 64 },
    { platformClass: 'Luke II', assetId: 'luke-ii-orbital-node', dryMassKg: 5400, payloadCapacityKg: 900, rfsPowerKW: 80, emffPowerKW: 115, dischargePowerKW: 260, batteryCapacityKWh: 1100, solarHullAreaM2: 220 },
    { platformClass: 'Luke IV', assetId: 'luke-iv-terrestrial-hub', dryMassKg: 18500, payloadCapacityKg: 4400, rfsPowerKW: 180, emffPowerKW: 220, dischargePowerKW: 620, batteryCapacityKWh: 4100, solarHullAreaM2: 860 }
  ];

  return variants.map((variant) => {
    const result = simulatePlatformAsset({ ...base, ...variant }, defaults);
    return {
      assetId: result.asset.assetId,
      platformClass: result.asset.platformClass,
      missionRole: result.asset.missionRole,
      powerMarginKW: result.powerMarginKW,
      enduranceHours: result.enduranceHours,
      massWithSparesKg: result.massWithSparesKg,
      readinessScore: result.readinessScore,
      dts: result.dts,
      status: result.status
    };
  });
}

export function buildAssetRecord(result) {
  return {
    id: `asset-${result.asset.assetId}-${Date.now()}`,
    type: 'platform-asset-record',
    protocol: 'ACHILLES_PROTOCOL_v1.1',
    workspaceId: 'W6',
    assetId: result.asset.assetId,
    platformClass: result.asset.platformClass,
    missionRole: result.asset.missionRole,
    metrics: {
      generatedSolarKW: result.generatedSolarKW,
      requiredPowerKW: result.requiredPowerKW,
      powerMarginKW: result.powerMarginKW,
      enduranceHours: result.enduranceHours,
      massWithSparesKg: result.massWithSparesKg,
      readinessScore: result.readinessScore,
      dts: result.dts,
      status: result.status
    },
    integrations: {
      gmatContractReadinessPct: result.asset.gmatContractReadinessPct,
      mplPublishReadinessPct: result.asset.mplPublishReadinessPct,
      dataReadinessPct: result.asset.dataReadinessPct
    },
    createdAt: new Date().toISOString()
  };
}
