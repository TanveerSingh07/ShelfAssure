import React from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { AlertTriangleIcon, ChevronDownIcon } from 'lucide-react';
import { levelRank } from '../../utils/engine';
import { levelStyles } from '../../utils/format';
import type { Commodity, FoodInputs, RequirementProfile } from '../../types/analysis';

interface RequirementsStepProps {
  commodity: Commodity;
  inputs: FoodInputs;
  profile: RequirementProfile;
}

export function RequirementsStep({ commodity, inputs, profile }: RequirementsStepProps) {
  const chartData = profile.requirements.map((r) => ({ subject: r.short, score: r.score }));
  const r = commodity.respiration;

  const headline = profile.isProduce && r ?
  [
  { label: 'Target equilibrium O₂', value: `${r.targetO2[0]}–${r.targetO2[1]}%`, cond: `in-pack at ${inputs.temperature}°C` },
  { label: 'Target equilibrium CO₂', value: `${r.targetCO2[0]}–${r.targetCO2[1]}%`, cond: 'avoid > 8% injury threshold' }] :

  [
  { label: 'Maximum OTR', value: profile.maxOTR === null ? 'Not limiting' : `≤ ${profile.maxOTR}`, unit: profile.maxOTR === null ? '' : 'cc/m²·day', cond: 'at 23°C, 0% RH' },
  { label: 'Maximum WVTR', value: `≤ ${profile.maxWVTR}`, unit: 'g/m²·day', cond: 'at 38°C, 90% RH' }];


  return (
    <section aria-labelledby="req-heading">
      <p className="text-sm font-medium text-brand-700">Packaging requirement profile</p>
      <h1 id="req-heading" className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {profile.riskClass}
      </h1>
      <p className="mt-2 max-w-3xl text-ink-soft">
        Before looking at any material, ShelfAssure works out what the pack must do. {profile.primaryRisk} is the dominant requirement
        for {commodity.name.toLowerCase()} at {inputs.temperature}°C and {inputs.rh}% RH over {inputs.shelfLifeDays} days.
      </p>

      {profile.warnings.length > 0 &&
      <div className="mt-5 flex gap-3 rounded-xl bg-warn-50 p-4 text-sm text-ink-soft ring-1 ring-inset ring-warn-100" role="alert">
          <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-warn-700" aria-hidden="true" />
          <div className="space-y-1">{profile.warnings.map((w) => <p key={w}>{w}</p>)}</div>
        </div>
      }

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="rounded-xl bg-surface p-6 shadow-card ring-1 ring-line lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            {headline.map((h) =>
            <div key={h.label}>
                <p className="text-xs text-ink-muted">{h.label}</p>
                <p className="tabular mt-1 font-mono text-2xl font-semibold tracking-tight text-ink">{h.value}</p>
                {'unit' in h && h.unit && <p className="text-xs text-ink-soft">{h.unit}</p>}
                <p className="mt-0.5 text-[11px] text-ink-muted">{h.cond}</p>
              </div>
            )}
          </div>
          <div className="mt-6 h-72 border-t border-line pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} outerRadius="72%">
                <PolarGrid stroke="#E4E2DA" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#3A4A46', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="#166A53" fill="#1F7F64" fillOpacity={0.22} strokeWidth={2} isAnimationActive={false} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-ink-muted">Requirement intensity, 0–100</p>
        </div>

        <div className="rounded-xl bg-surface shadow-card ring-1 ring-line lg:col-span-3">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-line px-6 py-3 text-xs text-ink-muted sm:grid-cols-[180px_1fr_auto]">
            <span>Requirement</span>
            <span className="hidden sm:block">Target</span>
            <span>Level</span>
          </div>
          <ul className="divide-y divide-line">
            {profile.requirements.map((req) => {
              const s = levelStyles[req.level];
              return (
                <li key={req.key}>
                  <details className="group">
                    <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-4 px-6 py-4 transition-colors duration-150 hover:bg-canvas/60 sm:grid-cols-[180px_1fr_auto] [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        <ChevronDownIcon className="h-4 w-4 text-ink-muted transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                        {req.label}
                      </span>
                      <span className="hidden text-sm text-ink-soft sm:block">{req.target}</span>
                      <span className="flex items-center gap-3">
                        <span className="hidden gap-0.5 md:flex" aria-hidden="true">
                          {[0, 1, 2, 3].map((i) =>
                          <span key={i} className={`h-3 w-1.5 rounded-sm ${i <= levelRank[req.level] ? s.bar : 'bg-line'}`} />
                          )}
                        </span>
                        <span className={`w-[68px] rounded-md px-2 py-0.5 text-center text-xs font-semibold ${s.bg} ${s.text}`}>{req.level}</span>
                      </span>
                    </summary>
                    <div className="px-6 pb-4 pl-12">
                      <p className="text-sm text-ink-soft sm:hidden">{req.target}</p>
                      <p className="mt-1 text-xs text-ink-muted">Driven by</p>
                      <ul className="mt-1.5 space-y-1">
                        {req.drivers.map((d) =>
                        <li key={d} className="flex gap-2 text-sm text-ink-soft">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-muted" aria-hidden="true" />
                            {d}
                          </li>
                        )}
                      </ul>
                    </div>
                  </details>
                </li>);

            })}
          </ul>
        </div>
      </div>
    </section>);

}