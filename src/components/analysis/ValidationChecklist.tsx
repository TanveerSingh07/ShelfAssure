import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import type { Material } from '../../types/analysis';

interface ValidationChecklistProps {
  material: Material;
  isProduce: boolean;
}

export function ValidationChecklist({ material, isProduce }: ValidationChecklistProps) {
  const items = [
  { id: 'migration', label: 'Food-contact compliance & migration test', ref: 'FSSAI 2018 · IS 9845' },
  isProduce ?
  { id: 'gas', label: 'Headspace O₂/CO₂ verification in a pack trial', ref: 'FAO MAP guidance' } :
  { id: 'otr', label: `OTR verification on the final ${material.thicknessRange[0]}–${material.thicknessRange[1]} µm laminate`, ref: 'ASTM D3985' },
  isProduce ?
  { id: 'condensation', label: 'Anti-fog and condensation check at storage RH', ref: 'Visual, 48 h' } :
  { id: 'wvtr', label: 'WVTR verification at 38°C / 90% RH', ref: 'ASTM F1249' },
  { id: 'seal', label: 'Seal strength and leak test', ref: 'ASTM F88 · F2096' },
  { id: 'drop', label: 'Drop and compression test for the distribution route', ref: 'IS 7028' },
  { id: 'shelf', label: 'Product-specific shelf-life study', ref: 'Accelerated + real time' }];

  const [done, setDone] = useState<string[]>([]);
  const toggle = (id: string) => setDone((d) => d.includes(id) ? d.filter((x) => x !== id) : [...d, id]);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold text-ink">Validation checklist</h2>
        <span className="tabular font-mono text-xs text-ink-muted">
          {done.length}/{items.length}
        </span>
      </div>
      <ul className="mt-4 space-y-1">
        {items.map((it) => {
          const checked = done.includes(it.id);
          return (
            <li key={it.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(it.id)}
                className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-canvas">
                
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
                  checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-line-strong bg-surface'}`
                  }>
                  
                  {checked && <CheckIcon className="h-3 w-3" />}
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm ${checked ? 'text-ink-muted line-through' : 'text-ink'}`}>{it.label}</span>
                  <span className="text-[11px] text-ink-muted">{it.ref}</span>
                </span>
              </button>
            </li>);

        })}
      </ul>
    </div>);

}