import React from 'react';
import { SlidersHorizontalIcon } from 'lucide-react';
import { DEFAULT_PRIORITIES } from '../../utils/engine';
import type { Priorities } from '../../types/analysis';

interface PriorityPanelProps {
  priorities: Priorities;
  onChange: (p: Priorities) => void;
}

const rows: {key: keyof Priorities;label: string;color: string;}[] = [
{ key: 'protection', label: 'Protection', color: '#1F7F64' },
{ key: 'cost', label: 'Cost', color: '#D9912B' },
{ key: 'sustainability', label: 'Sustainability', color: '#6BB79D' }];


export function PriorityPanel({ priorities, onChange }: PriorityPanelProps) {
  const total = priorities.protection + priorities.cost + priorities.sustainability || 1;
  return (
    <div className="rounded-xl bg-surface p-5 shadow-card ring-1 ring-line">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontalIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" /> Decision priorities
        </h2>
        <button type="button" onClick={() => onChange(DEFAULT_PRIORITIES)} className="text-xs font-medium text-brand-700 hover:underline">
          Reset
        </button>
      </div>
      <div className="mt-3 flex h-1.5 overflow-hidden rounded-full" aria-hidden="true">
        {rows.map((r) =>
        <div key={r.key} style={{ width: `${priorities[r.key] / total * 100}%`, background: r.color }} />
        )}
      </div>
      <div className="mt-4 space-y-3.5">
        {rows.map((r) =>
        <div key={r.key}>
            <div className="flex items-baseline justify-between text-sm">
              <label htmlFor={`prio-${r.key}`} className="text-ink-soft">
                {r.label}
              </label>
              <span className="tabular font-mono text-xs text-ink-muted">{Math.round(priorities[r.key] / total * 100)}%</span>
            </div>
            <input
            id={`prio-${r.key}`}
            type="range"
            min={0}
            max={100}
            value={priorities[r.key]}
            onChange={(e) => onChange({ ...priorities, [r.key]: parseInt(e.target.value, 10) })}
            className="sa-range mt-1.5 w-full" />
          
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-ink-muted">Weights re-rank feasible options only. They never change which options pass.</p>
    </div>);

}