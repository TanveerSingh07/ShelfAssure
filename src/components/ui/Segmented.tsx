import React from 'react';

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: {value: T;label: string;}[];
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div>
      <span className="text-sm font-medium text-ink">{label}</span>
      <div role="radiogroup" aria-label={label} className="mt-2 grid gap-1 rounded-lg bg-canvas p-1 ring-1 ring-inset ring-line" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
              active ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'}`
              }>
              
              {o.label}
            </button>);

        })}
      </div>
    </div>);

}