import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CheckIcon, DownloadIcon, Link2Icon, SaveIcon } from 'lucide-react';
import { Logo } from '../Logo';
import { LayerStack } from '../LayerStack';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { ValidationChecklist } from './ValidationChecklist';
import { DB_VERSION, MODEL_VERSION, RULE_VERSION, SCALE, explainRecommendation } from '../../utils/engine';
import { fmtNum, shelfFitStyles } from '../../utils/format';
import type { CandidateResult, Commodity, FoodInputs, RequirementProfile, SavedAnalysis } from '../../types/analysis';

interface ReportStepProps {
  commodity: Commodity;
  inputs: FoodInputs;
  profile: RequirementProfile;
  results: CandidateResult[];
  candidate: CandidateResult;
  onChangeCandidate: (id: string) => void;
  onSave: (a: SavedAnalysis) => void;
}

export function ReportStep({ commodity, inputs, profile, results, candidate, onChangeCandidate, onSave }: ReportStepProps) {
  const [saved, setSaved] = useState(false);
  const reportId = useMemo(() => `SA-2026-${String(Math.floor(1000 + Math.random() * 8999))}`, []);
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const m = candidate.material;
  const ranked = results.filter((r) => r.status !== 'rejected');
  const alternatives = ranked.filter((r) => r.material.id !== m.id).slice(0, 2);
  const reasons = explainRecommendation(commodity, inputs, profile, candidate, results);

  const specRows = [
  ...(profile.isProduce ?
  [
  {
    label: 'Equilibrium O₂',
    required: `${commodity.respiration?.targetO2[0]}–${commodity.respiration?.targetO2[1]}%`,
    provided: candidate.eqO2 !== null ? `${candidate.eqO2.toFixed(1)}%` : '—',
    cond: `Pack model at ${inputs.temperature}°C`
  }] :

  [
  {
    label: 'OTR',
    required: profile.maxOTR === null ? 'Not limiting' : `≤ ${profile.maxOTR}`,
    provided: m.otr === null ? 'Data unavailable' : fmtNum(m.otr),
    cond: m.otrCond
  },
  {
    label: 'WVTR',
    required: `≤ ${profile.maxWVTR}`,
    provided: m.wvtr === null ? 'Data unavailable' : fmtNum(m.wvtr),
    cond: m.wvtrCond
  }]),

  { label: 'Light protection', required: SCALE[profile.minLight], provided: SCALE[m.light], cond: 'Qualitative class' },
  { label: 'Seal integrity', required: SCALE[profile.minSeal], provided: SCALE[m.seal], cond: 'Qualitative class' },
  { label: 'Mechanical strength', required: SCALE[profile.minMechanical], provided: SCALE[m.mechanical], cond: 'Qualitative class' },
  { label: 'Temperature', required: `${inputs.temperature}°C`, provided: `${m.tempRange[0]} to ${m.tempRange[1]}°C`, cond: 'Rated service range' }];


  const handleSave = () => {
    onSave({
      id: reportId,
      commodityId: commodity.id,
      commodityName: commodity.name,
      date: new Date().toISOString(),
      recommendation: m.name,
      feasibleCount: ranked.length,
      screened: results.length,
      shelfFit: candidate.shelfFit,
      inputs,
      ruleVersion: RULE_VERSION,
      modelVersion: MODEL_VERSION,
      dbVersion: DB_VERSION,
      owner: 'Ananya Rao'
    });
    setSaved(true);
    toast.success('Analysis saved', { description: `${reportId} · ${commodity.name}` });
  };

  return (
    <section aria-labelledby="report-heading">
      <div className="no-print mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="report-candidate" className="text-ink-muted">
            Report on
          </label>
          <select
            id="report-candidate"
            value={m.id}
            onChange={(e) => onChangeCandidate(e.target.value)}
            className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm font-medium text-ink focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100">
            
            {ranked.map((r) =>
            <option key={r.material.id} value={r.material.id}>
                #{r.rank} {r.material.name}
              </option>
            )}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(`https://app.shelfassure.in/r/${reportId}`);
              toast('Share link copied');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink-soft hover:bg-canvas">
            
            <Link2Icon className="h-4 w-4" aria-hidden="true" /> Copy link
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink-soft hover:bg-canvas">
            
            <DownloadIcon className="h-4 w-4" aria-hidden="true" /> Download PDF
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:bg-brand-400">
            
            {saved ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : <SaveIcon className="h-4 w-4" aria-hidden="true" />}
            {saved ? 'Saved' : 'Save analysis'}
          </button>
        </div>
      </div>

      <article className="overflow-hidden rounded-2xl bg-surface shadow-card ring-1 ring-line">
        <header className="flex flex-col gap-4 border-b border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <Logo />
          <div className="text-left text-xs text-ink-muted sm:text-right">
            <p className="font-mono text-ink-soft">{reportId}</p>
            <p>{today} · Prepared by Ananya Rao</p>
          </div>
        </header>

        <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex gap-4">
            <img src={commodity.image} alt={commodity.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
            <div>
              <p className="text-xs text-ink-muted">Product</p>
              <p className="text-lg font-semibold text-ink">{commodity.name}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {inputs.moisture}% moisture · {inputs.fat}% fat · aw {inputs.aw} · {inputs.temperature}°C / {inputs.rh}% RH ·{' '}
                {inputs.shelfLifeDays}-day target
              </p>
              <p className="mt-1 text-xs text-ink-muted">{profile.riskClass}</p>
            </div>
          </div>
          <div className="rounded-xl bg-brand-50 p-5 ring-1 ring-inset ring-brand-100">
            <p className="text-xs font-medium text-brand-700">Recommended packaging structure</p>
            <h1 id="report-heading" className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              {m.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span>
                <span className="text-ink-muted">Fit </span>
                <span className="tabular font-mono font-semibold text-ink">{candidate.overall}/100</span>
              </span>
              <span>
                <span className="text-ink-muted">Est. shelf life </span>
                <span className="tabular font-mono font-semibold text-ink">
                  {candidate.shelfLife ? `${candidate.shelfLife.low}–${candidate.shelfLife.high} d` : 'Validation required'}
                </span>
              </span>
              <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${shelfFitStyles[candidate.shelfFit]}`}>{candidate.shelfFit}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-t border-line px-6 py-8 sm:px-10 lg:grid-cols-2">
          <div>
            <h2 className="font-semibold text-ink">Specification</h2>
            <p className="mt-0.5 text-xs text-ink-muted">Outside → product contact · {m.thicknessRange[0]}–{m.thicknessRange[1]} µm total</p>
            <div className="mt-4">
              <LayerStack layers={m.layers} variant="stack" />
            </div>
            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-ink-muted">
                  <th className="py-2 font-medium">Property</th>
                  <th className="py-2 font-medium">Required</th>
                  <th className="py-2 font-medium">Provided</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {specRows.map((row) =>
                <tr key={row.label} className="align-top">
                    <td className="py-2.5 pr-3">
                      <span className="text-ink">{row.label}</span>
                      <span className="block text-[11px] text-ink-muted">{row.cond}</span>
                    </td>
                    <td className="tabular py-2.5 pr-3 font-mono text-ink-soft">{row.required}</td>
                    <td className="tabular py-2.5 font-mono font-medium text-ink">{row.provided}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="font-semibold text-ink">Why this structure</h2>
            <ol className="mt-4 space-y-3">
              {reasons.map((r, i) =>
              <li key={r} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                  <span className="tabular mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-canvas font-mono text-[11px] font-semibold text-ink">
                    {i + 1}
                  </span>
                  {r}
                </li>
              )}
            </ol>

            {alternatives.length > 0 &&
            <div className="mt-8">
                <h3 className="text-sm font-semibold text-ink">Alternatives</h3>
                <ul className="mt-2 divide-y divide-line">
                  {alternatives.map((alt) =>
                <li key={alt.material.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">{alt.material.name}</span>
                        <span className="text-xs text-ink-muted">
                          ₹{alt.material.costPerM2}/m² · {alt.material.recyclability}
                        </span>
                      </span>
                      <span className="tabular shrink-0 font-mono text-ink-soft">{alt.overall}</span>
                    </li>
                )}
                </ul>
              </div>
            }
          </div>
        </div>

        <div className="grid gap-10 border-t border-line px-6 py-8 sm:px-10 lg:grid-cols-2">
          <div>
            <h2 className="font-semibold text-ink">Evidence & assumptions</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-muted">Property data status</dt>
                <dd><EvidenceBadge status={m.evidence} /></dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Source</dt>
                <dd className="text-right text-ink">{m.source}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Ranking confidence</dt>
                <dd className="tabular font-mono text-ink">{Math.round(candidate.confidence * 100)}%</dd>
              </div>
            </dl>
            <ul className="mt-5 space-y-1.5 text-sm text-ink-soft">
              <li>· Barrier values compared only at matching test conditions.</li>
              <li>· Shelf-life figures are comparative estimates, not validated claims.</li>
              <li>· Cost reflects indicative converter pricing, Sept 2026, India.</li>
              {profile.isProduce && <li>· MAP result assumes {commodity.respiration?.fillWeightKg} kg fill and steady cold chain.</li>}
            </ul>
          </div>
          <ValidationChecklist material={m} isProduce={profile.isProduce} />
        </div>

        <footer className="flex flex-col gap-2 border-t border-line bg-canvas px-6 py-4 text-[11px] text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="font-mono">
            {RULE_VERSION} · {MODEL_VERSION} · {DB_VERSION}
          </p>
          <p>Decision aid only. Not a substitute for laboratory, migration or regulatory testing.</p>
        </footer>
      </article>
    </section>);

}