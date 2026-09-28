import { materials } from '../data/materials';
import { featureLabels, fmtNum } from './format';
import type {
  CandidateResult,
  CandidateStatus,
  CheckResult,
  Commodity,
  EvidenceStatus,
  FoodInputs,
  Level,
  MapPoint,
  MapSimulation,
  Material,
  Priorities,
  Requirement,
  RequirementProfile,
  ShelfFit } from
'../types/analysis';

export const RULE_VERSION = 'Rules v1.4.2';
export const MODEL_VERSION = 'Ranker v0.9.3';
export const DB_VERSION = 'Materials DB 2026.09';
export const DEFAULT_PRIORITIES: Priorities = { protection: 50, cost: 30, sustainability: 20 };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function levelOf(score: number): Level {
  if (score < 30) return 'Low';
  if (score < 55) return 'Moderate';
  if (score < 78) return 'High';
  return 'Critical';
}

export const levelRank: Record<Level, number> = { Low: 0, Moderate: 1, High: 2, Critical: 3 };
const OTR_LIMIT: Record<Level, number | null> = { Low: null, Moderate: 50, High: 10, Critical: 2 };
const WVTR_LIMIT: Record<Level, number> = { Low: 20, Moderate: 8, High: 3, Critical: 1 };
export const SCALE = ['Basic', 'Standard', 'High', 'Maximum'];
const LIGHT_TARGET = ['Transparent acceptable', 'Tinted or printed', 'Opaque recommended', 'Full light barrier'];
const MECH_TARGET = ['Basic handling', 'Standard puncture resistance', 'Crush & puncture resistant', 'Heavy-duty'];
const SEAL_TARGET = ['Basic closure', 'Standard heat seal', 'Hermetic heat seal', 'Hermetic, contamination-tolerant'];
const TRANSPORT_LOAD = { local: 5, regional: 15, 'long-haul': 30 } as const;
const CONFIDENCE: Record<EvidenceStatus, number> = { Measured: 0.94, Manufacturer: 0.88, Literature: 0.85, Reference: 0.72 };

export function respirationAt(c: Commodity, temperature: number, r10?: number | null): number {
  if (!c.respiration) return 0;
  const r = c.respiration;
  return (r10 ?? r.r10) * Math.pow(r.q10, (temperature - 10) / 10);
}

export function computeProfile(c: Commodity, i: FoodInputs): RequirementProfile {
  const produce = c.cls === 'fresh-produce';
  const tf = Math.pow(2, (i.temperature - 25) / 10);
  const warnings: string[] = [];

  // Oxygen
  let oxygen: number;
  const oxyDrivers: string[] = [];
  if (produce) {
    oxygen = 18;
    oxyDrivers.push('Living tissue consumes O₂ — pack must allow controlled O₂ ingress');
    oxyDrivers.push('A full oxygen barrier would trigger anaerobic respiration');
  } else {
    oxygen =
    i.fat * 1.8 +
    i.shelfLifeDays / 365 * 30 +
    (tf - 1) * 15 + (
    i.aw > 0.9 ? 15 : 0) + (
    i.retailLight && i.fat > 10 ? 5 : 0) + (
    c.cls === 'dry-cereal' ? 10 : 0);
    oxygen = clamp(oxygen, 5, 100);
    oxyDrivers.push(
      i.fat >= 10 ?
      `Fat/oil ${i.fat}% → lipid oxidation and rancidity risk` :
      `Low fat (${i.fat}%) → limited oxidation risk`
    );
    oxyDrivers.push(`Shelf-life target of ${i.shelfLifeDays} days`);
    oxyDrivers.push(`Storage at ${i.temperature}°C ${tf > 1 ? 'accelerates' : 'slows'} oxidation (Q₁₀ ≈ 2)`);
    if (i.aw > 0.9) oxyDrivers.push(`High water activity (aw ${i.aw}) supports aerobic moulds and yeasts`);
    if (c.cls === 'dry-cereal') oxyDrivers.push('Flavour volatiles and grain lipids are oxygen-sensitive');
  }

  // Moisture
  let moisture: number;
  const moistDrivers: string[] = [];
  if (produce) {
    moisture = 55;
    moistDrivers.push('High-moisture produce loses water and firmness if the film is too open');
    moistDrivers.push(`RH ${i.rh}% — condensation risk inside a pack that is too tight`);
  } else if (i.moisture < 15) {
    moisture = (15 - i.moisture) * 4 + (i.rh - 50) * 0.8 + i.shelfLifeDays / 365 * 20 + (tf - 1) * 10;
    moistDrivers.push(`Dry product (${i.moisture}% moisture) absorbs vapour and loses crispness/flow`);
    moistDrivers.push(`Ambient RH ${i.rh}% creates a strong vapour drive into the pack`);
    moistDrivers.push(`Longer shelf life (${i.shelfLifeDays} d) compounds cumulative moisture gain`);
  } else {
    moisture = 45 + (i.storage !== 'ambient' ? 5 : 0);
    moistDrivers.push(`High-moisture product (${i.moisture}%) — barrier prevents drying and weight loss`);
    moistDrivers.push('Surface drying causes cracking and yield loss');
  }
  moisture = clamp(moisture, 5, 100);

  // Gas exchange
  let gas: number;
  const gasDrivers: string[] = [];
  let gasTarget = 'Not required';
  if (produce && c.respiration) {
    const R = respirationAt(c, i.temperature, i.respirationRate);
    gas = clamp(R * 8, 20, 100);
    gasDrivers.push(`Respiration ≈ ${R.toFixed(1)} mL O₂/kg·h at ${i.temperature}°C`);
    gasDrivers.push('Film permeance must be matched to respiration (modified atmosphere)');
    const r = c.respiration;
    gasTarget = `O₂ ${r.targetO2[0]}–${r.targetO2[1]}% · CO₂ ${r.targetCO2[0]}–${r.targetCO2[1]}%`;
  } else {
    gas = 8;
    gasDrivers.push('Non-respiring product — gas exchange not needed');
    if (oxygen >= 78) gasDrivers.push('Nitrogen flushing recommended to lower residual oxygen');
  }

  // Light
  const light = clamp(
    (i.fat > 10 ? i.fat * 1.2 : 0) + (i.retailLight ? 25 : 0) + (c.cls === 'dry-cereal' ? 10 : 0) + (produce ? 5 : 0),
    5,
    100
  );
  const lightDrivers: string[] = [];
  if (i.fat > 10) lightDrivers.push(`Photo-oxidation of fats (${i.fat}%)`);
  lightDrivers.push(i.retailLight ? 'Displayed under retail lighting' : 'Limited light exposure in the chain');

  // Mechanical
  const mechanical = clamp(c.fragility * 50 + TRANSPORT_LOAD[i.transport] + (c.bulk ? 20 : 0), 5, 100);
  const mechDrivers = [
  `Product fragility ${Math.round(c.fragility * 100)}/100`,
  `${i.transport === 'long-haul' ? 'Long-haul' : i.transport === 'regional' ? 'Regional' : 'Local'} transport and handling`];

  if (c.bulk) mechDrivers.push('Bulk fill weight stresses seams and seals');

  // Seal
  const seal = produce ? 40 : clamp(30 + Math.max(oxygen, moisture) * 0.5, 5, 100);
  const sealDrivers = produce ?
  ['Seal must hold while the film breathes'] :
  ['Barrier is only as good as the seal — seal must match barrier need'];

  // Temperature
  const temperature =
  i.storage === 'frozen' ? 85 : i.storage === 'chilled' ? 55 : i.temperature > 35 ? 50 : i.temperature > 28 ? 32 : 20;
  const tempDrivers = [`${i.storage[0].toUpperCase()}${i.storage.slice(1)} storage at ${i.temperature}°C, ${i.rh}% RH`];
  if (i.storage === 'chilled') tempDrivers.push('Cold-chain condensation and low-temperature flexibility');

  const oxyLevel = levelOf(oxygen);
  const moistLevel = levelOf(moisture);
  const maxOTR = produce ? null : OTR_LIMIT[oxyLevel];
  const maxWVTR = produce ? null : WVTR_LIMIT[moistLevel];

  const requirements: Requirement[] = [
  {
    key: 'oxygen',
    label: 'Oxygen barrier',
    short: 'Oxygen',
    score: Math.round(oxygen),
    level: oxyLevel,
    target: produce ? 'Permeable — matched to respiration' : maxOTR === null ? 'Not limiting' : `OTR ≤ ${maxOTR} cc/m²·day`,
    drivers: oxyDrivers
  },
  {
    key: 'moisture',
    label: 'Moisture barrier',
    short: 'Moisture',
    score: Math.round(moisture),
    level: moistLevel,
    target: produce ? 'Moderate — avoid drying & condensation' : `WVTR ≤ ${maxWVTR} g/m²·day`,
    drivers: moistDrivers
  },
  { key: 'gas', label: 'Gas exchange', short: 'Gas exch.', score: Math.round(gas), level: levelOf(gas), target: gasTarget, drivers: gasDrivers },
  { key: 'light', label: 'Light protection', short: 'Light', score: Math.round(light), level: levelOf(light), target: LIGHT_TARGET[levelRank[levelOf(light)]], drivers: lightDrivers },
  { key: 'mechanical', label: 'Mechanical strength', short: 'Strength', score: Math.round(mechanical), level: levelOf(mechanical), target: MECH_TARGET[levelRank[levelOf(mechanical)]], drivers: mechDrivers },
  { key: 'seal', label: 'Sealability', short: 'Seal', score: Math.round(seal), level: levelOf(seal), target: SEAL_TARGET[levelRank[levelOf(seal)]], drivers: sealDrivers },
  { key: 'temperature', label: 'Temperature suitability', short: 'Temp.', score: Math.round(temperature), level: levelOf(temperature), target: `Rated for ${i.temperature}°C`, drivers: tempDrivers }];


  // Out-of-domain warnings
  if (produce && c.respiration && i.temperature < c.respiration.optimalTemp - 2)
  warnings.push(`Below ${c.respiration.optimalTemp - 2}°C, ${c.name.toLowerCase()} risk chilling injury — packaging cannot compensate.`);
  if (i.temperature > 40) warnings.push('Storage temperature above 40°C is outside the validated range — treat results as indicative.');
  if (i.shelfLifeDays > c.defaults.shelfLifeDays * 2)
  warnings.push('Shelf-life target is more than twice the reference range — estimates carry higher uncertainty.');
  if (!produce && i.moisture >= 15 && c.cls !== 'chilled-dairy')
  warnings.push('Moisture entered is atypical for this commodity class — check the input.');

  const primary = [...requirements].sort((a, b) => b.score - a.score)[0];
  let riskClass: string;
  if (produce) riskClass = 'Respiring fresh produce';else
  {
    const parts: string[] = [];
    if (levelRank[oxyLevel] >= 2) parts.push('oxidation');
    if (levelRank[moistLevel] >= 2) parts.push('moisture');
    if (i.aw > 0.9) parts.push('microbial');
    if (!parts.length) {
      const words: Record<string, string> = { oxygen: 'oxidation', moisture: 'moisture', mechanical: 'handling', light: 'light', seal: 'seal', temperature: 'temperature', gas: 'gas' };
      parts.push(words[primary.key]);
    }
    riskClass = `${parts.join(' & ').replace(/^./, (s) => s.toUpperCase())}-sensitive ${c.category.toLowerCase()}`;
  }

  return {
    requirements,
    maxOTR,
    maxWVTR,
    minLight: levelRank[levelOf(light)],
    minMechanical: levelRank[levelOf(mechanical)],
    minSeal: levelRank[levelOf(seal)],
    isProduce: produce,
    riskClass,
    primaryRisk: primary.label,
    warnings
  };
}

function barrierCheck(label: string, value: number | null, max: number | null, unit: string, cond: string): CheckResult {
  if (max === null) return { label, ok: true, detail: 'Not limiting for this product' };
  if (value === null) return { label, ok: null, detail: `Data unavailable at comparable conditions — validation required (${cond})` };
  const ok = value <= max;
  return { label, ok, detail: `${fmtNum(value)} ${unit} vs required ≤ ${fmtNum(max)} · ${cond}` };
}

function levelCheck(label: string, have: number, need: number): CheckResult {
  const ok = have >= need;
  return { label, ok, detail: `Provides ${SCALE[have]} · requires ${SCALE[need]}` };
}

export function steadyStateO2(c: Commodity, temperature: number, otr: number, r10?: number | null): {eqO2: number;eqCO2: number;} {
  if (!c.respiration) return { eqO2: 21, eqCO2: 0 };
  const r = c.respiration;
  const cons = respirationAt(c, temperature, r10) * r.fillWeightKg;
  const raw = 21 - cons * 2400 / (otr * r.filmAreaM2);
  const eqO2 = Math.max(0, raw);
  const eqCO2 = r.rq * cons * 2400 / (otr * 4 * r.filmAreaM2);
  return { eqO2, eqCO2 };
}

export function simulateMAP(c: Commodity, temperature: number, otr: number, r10?: number | null): MapSimulation {
  const r = c.respiration!;
  const R = respirationAt(c, temperature, r10);
  const A = r.filmAreaM2;
  const V = r.headspaceMl;
  let o2 = 21;
  let co2 = 0.03;
  const dt = 0.1;
  const points: MapPoint[] = [{ hour: 0, o2, co2 }];
  for (let step = 1; step <= 960; step++) {
    const cons = R * r.fillWeightKg * Math.min(1, o2 / 2);
    const inflow = otr / 24 * A * ((21 - o2) / 100);
    const outflow = otr * 4 / 24 * A * (co2 / 100);
    o2 = clamp(o2 + (inflow - cons) / V * 100 * dt, 0, 21);
    co2 = clamp(co2 + (r.rq * cons - outflow) / V * 100 * dt, 0, 40);
    if (step % 30 === 0) points.push({ hour: Math.round(step * dt), o2: +o2.toFixed(2), co2: +co2.toFixed(2) });
  }
  const eq = steadyStateO2(c, temperature, otr, r10);
  const status: MapSimulation['status'] = eq.eqO2 < 1.5 ? 'anaerobic' : eq.eqO2 > r.targetO2[1] + 1 ? 'above-target' : 'in-target';
  return { points, eqO2: eq.eqO2, eqCO2: Math.min(eq.eqCO2, 40), status };
}

function marginSub(value: number | null, max: number | null): number {
  if (max === null) return 85;
  if (value === null) return 55;
  return 60 + clamp(Math.log10(max / value) * 15, -60, 25);
}

function estimateShelfLife(c: Commodity, i: FoodInputs, m: Material, profile: RequirementProfile, protection: number) {
  if (profile.isProduce && c.respiration) {
    const r = c.respiration;
    let penalty = 1;
    if (i.temperature > r.optimalTemp) penalty = Math.pow(r.q10, -(i.temperature - r.optimalTemp) / 10);
    if (i.temperature < r.optimalTemp - 2) penalty = 0.75;
    const base = m.breathable ? r.optimalDays * (0.5 + 0.5 * protection / 100) : r.optimalDays * 0.3;
    const est = base * penalty;
    return { low: Math.round(est * 0.85), high: Math.round(est * 1.15) };
  }
  if (profile.maxOTR !== null && m.otr === null || profile.maxWVTR !== null && m.wvtr === null) return null;
  const rO = profile.maxOTR === null || m.otr === null ? 4 : profile.maxOTR / m.otr;
  const rW = profile.maxWVTR === null || m.wvtr === null ? 4 : profile.maxWVTR / m.wvtr;
  const r = Math.min(4, rO, rW);
  const factor = clamp(Math.pow(r, 0.35) * 1.08, 0.3, 2);
  const est = i.shelfLifeDays * factor;
  return { low: Math.round(est * 0.9), high: Math.round(est * 1.12) };
}

export function evaluateCandidates(c: Commodity, i: FoodInputs, p: Priorities, profile: RequirementProfile): CandidateResult[] {
  const produce = profile.isProduce;
  const results: CandidateResult[] = materials.map((m) => {
    const checks: CheckResult[] = [];
    checks.push({
      label: 'Food-contact status',
      ok: m.foodContact,
      detail: m.foodContact ? 'Food-grade per FSSAI Packaging Regulations, 2018' : 'Not approved for direct food contact'
    });
    checks.push({
      label: 'Temperature range',
      ok: i.temperature >= m.tempRange[0] && i.temperature <= m.tempRange[1],
      detail: `Rated ${m.tempRange[0]}°C to ${m.tempRange[1]}°C · storage at ${i.temperature}°C`
    });
    if (c.requiredFeature) {
      const ok = m.features.includes(c.requiredFeature);
      const name = featureLabels[c.requiredFeature].toLowerCase();
      checks.push({ label: 'Format compatibility', ok, detail: ok ? `Supports ${name} packing` : `${c.name} requires ${name} packing` });
    }
    let eqO2: number | null = null;
    if (produce) {
      if (!m.breathable || m.otr === null) {
        checks.push({ label: 'Gas exchange', ok: false, detail: 'Barrier structure — O₂ would deplete, causing anaerobic respiration' });
      } else {
        eqO2 = steadyStateO2(c, i.temperature, m.otr, i.respirationRate).eqO2;
        const ok = eqO2 >= 1.5;
        checks.push({
          label: 'Gas exchange',
          ok,
          detail: ok ?
          `Equilibrium O₂ ≈ ${eqO2.toFixed(1)}% at ${i.temperature}°C` :
          `Equilibrium O₂ falls to ${eqO2.toFixed(1)}% at ${i.temperature}°C — anaerobic risk`
        });
      }
    } else {
      if (m.breathable) checks.push({ label: 'Barrier integrity', ok: false, detail: 'Perforated/breathable structure cannot hold a barrier' });
      checks.push(barrierCheck('Oxygen barrier (OTR)', m.otr, profile.maxOTR, 'cc/m²·day', m.otrCond));
      checks.push(barrierCheck('Moisture barrier (WVTR)', m.wvtr, profile.maxWVTR, 'g/m²·day', m.wvtrCond));
    }
    checks.push(levelCheck('Light protection', m.light, profile.minLight));
    checks.push(levelCheck('Mechanical strength', m.mechanical, profile.minMechanical));
    checks.push(levelCheck('Sealability', m.seal, profile.minSeal));
    if (m.paperBased && i.storage !== 'ambient' && i.rh > 80)
    checks.push({ label: 'Humidity tolerance', ok: false, detail: 'Paperboard loses strength in chilled, high-RH storage' });

    const status: CandidateStatus = checks.some((ch) => ch.ok === false) ?
    'rejected' :
    checks.some((ch) => ch.ok === null) ?
    'conditional' :
    'feasible';

    const surplus = (have: number, need: number) => 70 + clamp(have - need, -3, 1) * 10;
    let protection: number;
    if (produce && c.respiration) {
      const mid = (c.respiration.targetO2[0] + c.respiration.targetO2[1]) / 2;
      protection = eqO2 === null ? 15 : clamp(100 - Math.abs(eqO2 - mid) * 7, 15, 99);
    } else {
      protection =
      0.3 * marginSub(m.otr, profile.maxOTR) +
      0.3 * marginSub(m.wvtr, profile.maxWVTR) +
      0.4 / 3 * (surplus(m.light, profile.minLight) + surplus(m.mechanical, profile.minMechanical) + surplus(m.seal, profile.minSeal));
    }
    protection = Math.round(clamp(protection, 5, 99));
    const costScore = Math.round(clamp(100 - (m.costPerM2 - 5) / 21 * 80, 10, 100));
    const sustainScore = m.sustainScore;
    const featureMatch = c.preferred.filter((f) => m.features.includes(f));
    const wSum = p.protection + p.cost + p.sustainability || 1;
    const weighted = (protection * p.protection + costScore * p.cost + sustainScore * p.sustainability) / wSum;
    const overall = Math.round(clamp(weighted + Math.min(16, featureMatch.length * 8) - (status === 'conditional' ? 8 : 0), 1, 99));
    const confidence = +(CONFIDENCE[m.evidence] - (status === 'conditional' ? 0.12 : 0)).toFixed(2);
    const shelfLife = estimateShelfLife(c, i, m, profile, protection);
    const shelfFit: ShelfFit = !shelfLife ?
    'Validation required' :
    shelfLife.low >= i.shelfLifeDays ?
    'Meets target' :
    shelfLife.high >= i.shelfLifeDays ?
    'Marginal' :
    'Below target';

    return { material: m, status, checks, protection, costScore, sustainScore, overall, confidence, shelfLife, shelfFit, rank: null, eqO2, featureMatch };
  });

  const ranked = results.filter((r) => r.status !== 'rejected').sort((a, b) => b.overall - a.overall);
  ranked.forEach((r, idx) => r.rank = idx + 1);
  const rejected = results.filter((r) => r.status === 'rejected');
  return [...ranked, ...rejected];
}

export function explainRecommendation(
c: Commodity,
i: FoodInputs,
profile: RequirementProfile,
top: CandidateResult,
results: CandidateResult[])
: string[] {
  const m = top.material;
  const out: string[] = [];
  out.push(`${profile.primaryRisk} is the dominant requirement for ${c.name.toLowerCase()} under these conditions.`);
  if (profile.isProduce && c.respiration && top.eqO2 !== null) {
    out.push(
      `Equilibrium O₂ of ${top.eqO2.toFixed(1)}% at ${i.temperature}°C sits ${
      top.eqO2 <= c.respiration.targetO2[1] + 1 ? 'inside' : 'above'} the ${
      c.respiration.targetO2[0]}–${c.respiration.targetO2[1]}% target band, slowing respiration without anaerobic risk.`
    );
  } else {
    if (profile.maxOTR !== null && m.otr !== null) out.push(`OTR of ${fmtNum(m.otr)} cc/m²·day meets the ≤ ${fmtNum(profile.maxOTR)} target derived from fat content and shelf life.`);
    if (profile.maxWVTR !== null && m.wvtr !== null) out.push(`WVTR of ${fmtNum(m.wvtr)} g/m²·day meets the ≤ ${fmtNum(profile.maxWVTR)} target at ${i.rh}% RH.`);
  }
  if (top.featureMatch.length) out.push(`Supports ${top.featureMatch.map((f) => featureLabels[f].toLowerCase()).join(' and ')}, preferred for this product.`);
  const feasible = results.filter((r) => r.status === 'feasible' && r.material.id !== m.id);
  const pricier = feasible.filter((r) => r.material.costPerM2 > m.costPerM2).sort((a, b) => b.protection - a.protection)[0];
  if (pricier) {
    const pct = Math.round((pricier.material.costPerM2 - m.costPerM2) / pricier.material.costPerM2 * 100);
    out.push(`${pct}% lower material cost than ${pricier.material.name}, which adds protection beyond what the product needs.`);
  }
  const rejectedCount = results.filter((r) => r.status === 'rejected').length;
  out.push(`${rejectedCount} structures were excluded on hard constraints — no ranking score can override these.`);
  return out;
}