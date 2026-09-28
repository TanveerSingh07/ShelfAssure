import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { XIcon } from 'lucide-react';
import { WhatIfPanel } from './WhatIfPanel';
import { MapSimulator } from './MapSimulator';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { SCALE } from '../../utils/engine';
import { fmtNum } from '../../utils/format';
import type { CandidateResult, Commodity, FoodInputs, Priorities } from '../../types/analysis';

interface CompareStepProps {
  commodity: Commodity;
  inputs: FoodInputs;
  priorities: Priorities;
  results: CandidateResult[];
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onApplyScenario: (i: FoodInputs) => void;
}

type Row = {label: string;render: (r: CandidateResult) => React.ReactNode;best?: (rs: CandidateResult[]) => string | null;};

const bestBy = (rs: CandidateResult[], fn: (r: CandidateResult) => number | null, lower = false) => {
  const vals = rs.map((r) => ({ id: r.material.id, v: fn(r) })).filter((x): x is {id: string;v: number;} => x.v !== null);
  if (vals.length < 2) return null;
  const sorted = [...vals].sort((a, b) => lower ? a.v - b.v : b.v - a.v);
  return sorted[0].v === sorted[1].v ? null : sorted[0].id;
};

const rows: Row[] = [
{ label: 'Fit score', render: (r) => r.overall, best: (rs) => bestBy(rs, (r) => r.overall) },
{ label: 'Protection score', render: (r) => r.protection, best: (rs) => bestBy(rs, (r) => r.protection) },
{ label: 'Material cost', render: (r) => `₹${r.material.costPerM2} / m²`, best: (rs) => bestBy(rs, (r) => r.material.costPerM2, true) },
{
  label: 'Est. shelf life',
  render: (r) => r.shelfLife ? `${r.shelfLife.low}–${r.shelfLife.high} days` : 'Data unavailable',
  best: (rs) => bestBy(rs, (r) => r.shelfLife?.low ?? null)
},
{ label: 'OTR', render: (r) => r.material.otr === null ? 'Data unavailable' : `${fmtNum(r.material.otr)} cc/m²·day`, best: (rs) => bestBy(rs, (r) => r.material.otr, true) },
{ label: 'WVTR', render: (r) => r.material.wvtr === null ? 'Data unavailable' : `${fmtNum(r.material.wvtr)} g/m²·day`, best: (rs) => bestBy(rs, (r) => r.material.wvtr, true) },
{ label: 'Thickness range', render: (r) => `${r.material.thicknessRange[0]}–${r.material.thicknessRange[1]} µm` },
{ label: 'Light · Seal · Strength', render: (r) => `${SCALE[r.material.light]} · ${SCALE[r.material.seal]} · ${SCALE[r.material.mechanical]}` },
{ label: 'End of life', render: (r) => r.material.recyclability },
{ label: 'Carbon footprint', render: (r) => `${r.material.carbon} kg CO₂e / kg`, best: (rs) => bestBy(rs, (r) => r.material.carbon, true) },
{ label: 'Evidence', render: (r) => <EvidenceBadge status={r.material.evidence} /> },
{ label: 'Model confidence', render: (r) => `${Math.round(r.confidence * 100)}%` }];


export function CompareStep({ commodity, inputs, priorities, results, compareIds, onToggleCompare, onApplyScenario }: CompareStepProps) {
  const selected = compareIds.map((id) => results.find((r) => r.material.id === id)).filter((r): r is CandidateResult => !!r && r.status !== 'rejected');
  const chartData = selected.map((r) => ({
    name: r.material.name.length > 22 ? `${r.material.name.slice(0, 20)}…` : r.material.name,
    Protection: r.protection,
    Cost: r.costScore,
    Sustainability: r.sustainScore
  }));
  const breathable = results.filter((r) => r.material.breathable && r.material.otr !== null).map((r) => r.material);

  return (
    <section aria-labelledby="compare-heading" className="space-y-10">
      <div>
        <p className="text-sm font-medium text-brand-700">Trade-off analysis</p>
        <h1 id="compare-heading" className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Compare feasible options side by side
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Every option here already meets the technical requirements. What remains is a business choice between protection margin, cost and
          end-of-life impact.
        </p>

        {selected.length === 0 ?
        <p className="mt-6 rounded-xl bg-surface p-6 text-sm text-ink-soft ring-1 ring-line">
            Select candidates to compare in the previous step.
          </p> :

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
            <div className="overflow-x-auto rounded-xl bg-surface shadow-card ring-1 ring-line">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="w-44 px-5 py-4 text-left text-xs font-medium text-ink-muted">Property</th>
                    {selected.map((r) =>
                  <th key={r.material.id} className="px-5 py-4 text-left align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="tabular font-mono text-xs text-ink-muted">#{r.rank}</span>
                            <p className="font-semibold text-ink">{r.material.name}</p>
                          </div>
                          <button
                        type="button"
                        onClick={() => onToggleCompare(r.material.id)}
                        className="rounded p-0.5 text-ink-muted hover:bg-canvas hover:text-ink"
                        aria-label={`Remove ${r.material.name} from comparison`}>
                        
                            <XIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </th>
                  )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((row) => {
                  const bestId = row.best ? row.best(selected) : null;
                  return (
                    <tr key={row.label}>
                        <th scope="row" className="px-5 py-3 text-left text-xs font-medium text-ink-muted">
                          {row.label}
                        </th>
                        {selected.map((r) =>
                      <td
                        key={r.material.id}
                        className={`tabular px-5 py-3 ${bestId === r.material.id ? 'font-semibold text-brand-700' : 'text-ink'}`}>
                        
                            {row.render(r)}
                          </td>
                      )}
                      </tr>);

                })}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl bg-surface p-5 shadow-card ring-1 ring-line">
              <h2 className="text-sm font-semibold text-ink">Score profile</h2>
              <p className="text-xs text-ink-muted">Higher is better on every axis</p>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#E4E2DA" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#66756F' }} interval={0} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#66756F' }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: '#F5F4EF' }} contentStyle={{ borderRadius: 8, border: '1px solid #E4E2DA', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
                    <Bar dataKey="Protection" fill="#1F7F64" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="Cost" fill="#D9912B" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="Sustainability" fill="#9FD1BF" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        }
      </div>

      <WhatIfPanel commodity={commodity} inputs={inputs} priorities={priorities} baseResults={results} onApply={onApplyScenario} />

      {commodity.respiration && breathable.length > 0 &&
      <MapSimulator commodity={commodity} temperature={inputs.temperature} respirationRate={inputs.respirationRate} films={breathable} />
      }
    </section>);

}