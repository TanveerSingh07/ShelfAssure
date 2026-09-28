import React, { useMemo, useState } from 'react';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, MinusIcon, RotateCcwIcon, SparklesIcon } from 'lucide-react';
import { Slider } from '../ui/Slider';
import { computeProfile, evaluateCandidates } from '../../utils/engine';
import type { CandidateResult, Commodity, FoodInputs, Priorities } from '../../types/analysis';

interface WhatIfPanelProps {
  commodity: Commodity;
  inputs: FoodInputs;
  priorities: Priorities;
  baseResults: CandidateResult[];
  onApply: (i: FoodInputs) => void;
}

export function WhatIfPanel({ commodity, inputs, priorities, baseResults, onApply }: WhatIfPanelProps) {
  const [scenario, setScenario] = useState({ temperature: inputs.temperature, rh: inputs.rh, shelfLifeDays: inputs.shelfLifeDays });
  const scenarioInputs = { ...inputs, ...scenario };
  const changed = scenario.temperature !== inputs.temperature || scenario.rh !== inputs.rh || scenario.shelfLifeDays !== inputs.shelfLifeDays;

  const { profile, results } = useMemo(() => {
    const p = computeProfile(commodity, scenarioInputs);
    return { profile: p, results: evaluateCandidates(commodity, scenarioInputs, priorities, p) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commodity, scenario.temperature, scenario.rh, scenario.shelfLifeDays, inputs, priorities]);

  const baseProfile = useMemo(() => computeProfile(commodity, inputs), [commodity, inputs]);
  const baseTop = baseResults.find((r) => r.rank === 1);
  const scenTop = results.find((r) => r.rank === 1);
  const baseFeasible = baseResults.filter((r) => r.status !== 'rejected').length;
  const scenFeasible = results.filter((r) => r.status !== 'rejected').length;

  const movers = results.filter((r) => r.status !== 'rejected').slice(0, 5).map((r) => {
    const before = baseResults.find((b) => b.material.id === r.material.id);
    return { r, beforeRank: before?.rank ?? null };
  });
  const dropped = baseResults.filter((b) => b.status !== 'rejected' && results.find((r) => r.material.id === b.material.id)?.status === 'rejected');

  const metric = (label: string, before: string, after: string) =>
  <div className="py-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-ink-soft">{before}</span>
        <ArrowRightIcon className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
        <span className={`font-semibold ${before !== after ? 'text-accent-700' : 'text-ink'}`}>{after}</span>
      </div>
    </div>;


  return (
    <div className="rounded-xl bg-ink p-6 text-white shadow-lift sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <SparklesIcon className="h-4 w-4 text-accent-100" aria-hidden="true" /> What-if simulation
          </h2>
          <p className="mt-1 max-w-xl text-sm text-white/60">
            Change the conditions and the whole pipeline re-runs: requirements, hard filters and ranking. No new manual study needed.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!changed}
            onClick={() => setScenario({ temperature: inputs.temperature, rh: inputs.rh, shelfLifeDays: inputs.shelfLifeDays })}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/70 hover:bg-white/10 disabled:opacity-30">
            
            <RotateCcwIcon className="h-3.5 w-3.5" aria-hidden="true" /> Reset
          </button>
          <button
            type="button"
            disabled={!changed}
            onClick={() => onApply(scenarioInputs)}
            className="rounded-lg bg-accent-100 px-3 py-1.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-white disabled:opacity-30">
            
            Apply as baseline
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[320px_1fr_1fr]">
        <div className="space-y-5 rounded-lg bg-white p-5 text-ink">
          <Slider label="Temperature" value={scenario.temperature} min={-18} max={45} unit="°C" onChange={(v) => setScenario((s) => ({ ...s, temperature: v }))} />
          <Slider label="Relative humidity" value={scenario.rh} min={20} max={98} unit="% RH" onChange={(v) => setScenario((s) => ({ ...s, rh: v }))} />
          <Slider label="Shelf-life target" value={scenario.shelfLifeDays} min={3} max={540} unit="days" onChange={(v) => setScenario((s) => ({ ...s, shelfLifeDays: v }))} />
        </div>

        <div className="divide-y divide-white/10">
          {metric('Top recommendation', baseTop?.material.name ?? 'None feasible', scenTop?.material.name ?? 'None feasible')}
          {metric('Feasible structures', String(baseFeasible), String(scenFeasible))}
          {profile.isProduce ?
          metric('Gas-exchange demand', baseProfile.requirements[2].level, profile.requirements[2].level) :
          metric(
            'Barrier targets (OTR · WVTR)',
            `${baseProfile.maxOTR ?? '—'} · ${baseProfile.maxWVTR}`,
            `${profile.maxOTR ?? '—'} · ${profile.maxWVTR}`
          )}
          {metric('Recommended pack vs shelf-life target', baseTop?.shelfFit ?? '—', scenTop?.shelfFit ?? '—')}
        </div>

        <div>
          <p className="text-xs text-white/50">Scenario ranking</p>
          {movers.length === 0 ?
          <p className="mt-3 rounded-lg bg-danger-500/20 p-3 text-sm text-white">
              No structure in the library meets these conditions. Consider a different storage regime or a custom structure.
            </p> :

          <ol className="mt-2 space-y-1.5">
              {movers.map(({ r, beforeRank }) => {
              const delta = beforeRank === null ? null : beforeRank - (r.rank ?? 0);
              return (
                <li key={r.material.id} className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-2 text-sm">
                    <span className="tabular w-4 font-mono text-white/50">{r.rank}</span>
                    <span className="min-w-0 flex-1 truncate">{r.material.name}</span>
                    {delta === null ?
                  <span className="text-[11px] font-medium text-accent-100">New</span> :
                  delta > 0 ?
                  <span className="flex items-center text-xs text-brand-200"><ArrowUpIcon className="h-3 w-3" />{delta}</span> :
                  delta < 0 ?
                  <span className="flex items-center text-xs text-danger-100"><ArrowDownIcon className="h-3 w-3" />{-delta}</span> :

                  <MinusIcon className="h-3 w-3 text-white/40" aria-label="No change" />
                  }
                  </li>);

            })}
            </ol>
          }
          {dropped.length > 0 &&
          <p className="mt-3 text-xs text-danger-100">
              Now rejected: {dropped.map((d) => d.material.name).join(', ')}
            </p>
          }
        </div>
      </div>
    </div>);

}