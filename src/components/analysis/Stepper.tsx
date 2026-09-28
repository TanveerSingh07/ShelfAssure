import React from 'react';
import { CheckIcon } from 'lucide-react';

interface StepperProps {
  steps: readonly string[];
  current: number;
  maxStep: number;
  onSelect: (i: number) => void;
}

export function Stepper({ steps, current, maxStep, onSelect }: StepperProps) {
  return (
    <nav aria-label="Analysis progress" className="no-print overflow-x-auto">
      <ol className="flex min-w-max items-center gap-1">
        {steps.map((label, i) => {
          const done = i < current && i <= maxStep;
          const active = i === current;
          const reachable = i <= maxStep;
          return (
            <li key={label} className="flex items-center gap-1">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onSelect(i)}
                aria-current={active ? 'step' : undefined}
                className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
                active ? 'bg-ink text-white' : reachable ? 'text-ink hover:bg-surface' : 'cursor-not-allowed text-ink-muted/60'}`
                }>
                
                <span
                  className={`tabular flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${
                  active ? 'bg-accent-100 text-ink' : done ? 'bg-brand-600 text-white' : 'bg-line text-ink-muted'}`
                  }>
                  
                  {done ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                </span>
                <span className="whitespace-nowrap font-medium">{label}</span>
              </button>
              {i < steps.length - 1 && <span className={`h-px w-5 ${i < maxStep ? 'bg-brand-400' : 'bg-line-strong'}`} aria-hidden="true" />}
            </li>);

        })}
      </ol>
    </nav>);

}