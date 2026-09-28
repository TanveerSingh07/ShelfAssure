import React from 'react';

interface ScoreBarProps {
  label: string;
  value: number;
  color?: string;
}

export function ScoreBar({ label, value, color = 'bg-brand-500' }: ScoreBarProps) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] text-ink-muted">{label}</span>
        <span className="tabular font-mono text-[11px] font-medium text-ink-soft">{value}</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-line" role="presentation">
        <div className={`h-full rounded-full ${color} transition-[width] duration-300 ease-out`} style={{ width: `${value}%` }} />
      </div>
    </div>);

}