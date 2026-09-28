import React, { useId } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  onChange: (v: number) => void;
}

export function Slider({ label, value, min, max, step = 1, unit = '', hint, onChange }: SliderProps) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            className="tabular w-16 rounded-md border border-line bg-surface px-1.5 py-0.5 text-right font-mono text-sm text-ink focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            aria-label={`${label} value`} />
          
          <span className="w-10 text-xs text-ink-muted">{unit}</span>
        </div>
      </div>
      <input
        id={id}
        type="range"
        className="sa-range mt-2.5 w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          background: `linear-gradient(to right, #1F7F64 ${(value - min) / (max - min) * 100}%, #E4E2DA ${(value - min) / (max - min) * 100}%)`
        }} />
      
      {hint && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
    </div>);

}