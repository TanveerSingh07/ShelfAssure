import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ChevronDownIcon, HelpCircleIcon, XIcon } from 'lucide-react';
import { LayerStack } from '../LayerStack';
import { Badge } from '../ui/Badge';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { ScoreBar } from '../ui/ScoreBar';
import { featureLabels, shelfFitStyles } from '../../utils/format';
import type { CandidateResult } from '../../types/analysis';

interface CandidateRowProps {
  result: CandidateResult;
  recommended: boolean;
  comparing: boolean;
  onToggleCompare: () => void;
}

export function CandidateRow({ result, recommended, comparing, onToggleCompare }: CandidateRowProps) {
  const [open, setOpen] = useState(false);
  const m = result.material;

  return (
    <motion.li
      layout
      transition={{ layout: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
      className={`rounded-xl bg-surface ring-1 ${recommended ? 'shadow-lift ring-2 ring-brand-500' : 'shadow-card ring-line'}`}>
      
      <div className="grid items-center gap-4 p-4 sm:p-5 md:grid-cols-[48px_minmax(0,1.6fr)_minmax(0,1.4fr)_120px_auto]">
        <div className="flex items-center gap-3 md:block">
          <span
            className={`tabular flex h-10 w-10 items-center justify-center rounded-lg font-mono text-base font-semibold ${
            recommended ? 'bg-brand-600 text-white' : 'bg-canvas text-ink-soft'}`
            }>
            
            {result.rank}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {recommended && <Badge tone="brand">Recommended</Badge>}
            {result.status === 'conditional' && <Badge tone="warn">Validation required</Badge>}
            <EvidenceBadge status={m.evidence} />
          </div>
          <h3 className="mt-1.5 truncate font-semibold text-ink">{m.name}</h3>
          <div className="mt-2 max-w-[220px]">
            <LayerStack layers={m.layers} />
          </div>
          <p className="mt-1.5 truncate text-xs text-ink-muted">
            {m.family} · {m.thicknessRange[0]}–{m.thicknessRange[1]} µm
            {result.featureMatch.length > 0 && ` · ${result.featureMatch.map((f) => featureLabels[f]).join(', ')}`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ScoreBar label="Protection" value={result.protection} />
          <ScoreBar label="Cost" value={result.costScore} color="bg-accent-500" />
          <ScoreBar label="Sustain." value={result.sustainScore} color="bg-brand-300" />
        </div>

        <div>
          <p className="text-[11px] text-ink-muted">Est. shelf life</p>
          <p className="tabular font-mono text-sm font-medium text-ink">
            {result.shelfLife ? `${result.shelfLife.low}–${result.shelfLife.high} d` : 'Data unavailable'}
          </p>
          <span className={`mt-1 inline-block whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium ${shelfFitStyles[result.shelfFit]}`}>
            {result.shelfFit}
          </span>
        </div>

        <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
          <div className="text-right">
            <p className="tabular font-mono text-2xl font-semibold leading-none text-ink">{result.overall}</p>
            <p className="mt-1 text-[11px] text-ink-muted">fit · {Math.round(result.confidence * 100)}% conf.</p>
          </div>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-soft hover:bg-canvas">
              <input type="checkbox" checked={comparing} onChange={onToggleCompare} className="h-3.5 w-3.5 accent-[#166A53]" />
              Compare
            </label>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={`${open ? 'Hide' : 'Show'} constraint checks for ${m.name}`}
              className="rounded-md p-1 text-ink-muted hover:bg-canvas hover:text-ink">
              
              <ChevronDownIcon className={`h-4 w-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {open &&
      <div className="border-t border-line px-5 py-4">
          <p className="text-xs font-medium text-ink-muted">Constraint checks</p>
          <ul className="mt-2 grid gap-x-8 gap-y-2 md:grid-cols-2">
            {result.checks.map((ch) =>
          <li key={ch.label} className="flex gap-2.5 text-sm">
                <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
              ch.ok === true ? 'bg-brand-100 text-brand-700' : ch.ok === null ? 'bg-warn-100 text-warn-700' : 'bg-danger-100 text-danger-700'}`
              }>
              
                  {ch.ok === true ? <CheckIcon className="h-2.5 w-2.5" /> : ch.ok === null ? <HelpCircleIcon className="h-2.5 w-2.5" /> : <XIcon className="h-2.5 w-2.5" />}
                </span>
                <span>
                  <span className="font-medium text-ink">{ch.label}</span>
                  <span className="block text-xs text-ink-muted">{ch.detail}</span>
                </span>
              </li>
          )}
          </ul>
          <p className="mt-3 text-xs text-ink-muted">Source: {m.source}</p>
        </div>
      }
    </motion.li>);

}