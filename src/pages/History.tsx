import React from 'react';
import { RotateCwIcon } from 'lucide-react';
import { getCommodity } from '../data/commodities';
import { formatDate, shelfFitStyles } from '../utils/format';
import type { FoodInputs, SavedAnalysis } from '../types/analysis';

interface HistoryProps {
  saved: SavedAnalysis[];
  onReopen: (commodityId: string, inputs: FoodInputs) => void;
}

export function History({ saved, onReopen }: HistoryProps) {
  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-12">
      <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Saved analyses</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Each analysis keeps its inputs and the rule, model and database versions used, so any decision can be reproduced or audited later.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl bg-surface shadow-card ring-1 ring-line">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-muted">
              <th className="px-5 py-3 font-medium">Analysis</th>
              <th className="px-4 py-3 font-medium">Recommendation</th>
              <th className="px-4 py-3 font-medium">Conditions</th>
              <th className="px-4 py-3 font-medium">Shelf life</th>
              <th className="px-4 py-3 font-medium">Versions</th>
              <th className="px-5 py-3" aria-label="Actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {saved.map((a) => {
              const c = getCommodity(a.commodityId);
              return (
                <tr key={a.id} className="align-middle">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {c && <img src={c.image} alt="" className="h-9 w-9 rounded-md object-cover" />}
                      <div>
                        <p className="font-medium text-ink">{a.commodityName}</p>
                        <p className="font-mono text-[11px] text-ink-muted">
                          {a.id} · {formatDate(a.date)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-ink">{a.recommendation}</p>
                    <p className="text-xs text-ink-muted">
                      {a.feasibleCount} of {a.screened} feasible · {a.owner}
                    </p>
                  </td>
                  <td className="tabular px-4 py-3.5 font-mono text-xs text-ink-soft">
                    {a.inputs.temperature}°C · {a.inputs.rh}% RH · {a.inputs.shelfLifeDays} d
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium ${shelfFitStyles[a.shelfFit]}`}>{a.shelfFit}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] leading-relaxed text-ink-muted">
                    {a.ruleVersion}
                    <br />
                    {a.modelVersion} · {a.dbVersion.replace('Materials DB ', 'DB ')}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onReopen(a.commodityId, a.inputs)}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors duration-150 hover:bg-canvas">
                      
                      <RotateCwIcon className="h-3.5 w-3.5" aria-hidden="true" /> Re-run
                    </button>
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
      </div>
    </div>);

}