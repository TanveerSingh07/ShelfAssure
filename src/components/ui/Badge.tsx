import React from 'react';

type Tone = 'neutral' | 'brand' | 'accent' | 'danger' | 'warn' | 'dark';

interface BadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: 'bg-canvas text-ink-soft ring-line',
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  accent: 'bg-accent-50 text-accent-700 ring-accent-100',
  danger: 'bg-danger-50 text-danger-700 ring-danger-100',
  warn: 'bg-warn-50 text-warn-700 ring-warn-100',
  dark: 'bg-ink text-white ring-ink'
};

export function Badge({ tone = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${tones[tone]} ${className}`}>
      
      {children}
    </span>);

}