import React from 'react';
import type { Layer } from '../types/analysis';
import { layerColors } from '../utils/format';

interface LayerStackProps {
  layers: Layer[];
  variant?: 'bar' | 'stack';
}

export function LayerStack({ layers, variant = 'bar' }: LayerStackProps) {
  const weights = layers.map((l) => Math.sqrt(Math.max(l.microns, 2)));
  const total = weights.reduce((a, b) => a + b, 0);

  if (variant === 'bar') {
    return (
      <div className="flex h-1.5 w-full overflow-hidden rounded-full" aria-label={layers.map((l) => l.name).join(' / ')}>
        {layers.map((l, idx) =>
        <div key={idx} style={{ width: `${weights[idx] / total * 100}%`, background: layerColors[l.kind] }} />
        )}
      </div>);

  }

  return (
    <div className="flex flex-col gap-1" aria-label="Layer structure, outside to inside">
      {layers.map((l, idx) =>
      <div key={idx} className="flex items-center gap-3">
          <div
          className="w-20 shrink-0 rounded-sm ring-1 ring-inset ring-black/5"
          style={{ height: `${Math.max(10, Math.min(40, weights[idx] * 3))}px`, background: layerColors[l.kind] }} />
        
          <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2 text-sm">
            <span className="truncate text-ink">{l.name}</span>
            <span className="tabular shrink-0 font-mono text-xs text-ink-muted">{l.microns} µm</span>
          </div>
        </div>
      )}
    </div>);

}