import type { Level, LayerKind, PackFeature, ShelfFit } from '../types/analysis';

export function fmtNum(v: number): string {
  if (v < 0.1) return v.toFixed(2);
  if (v < 10) return v.toFixed(1).replace(/\.0$/, '');
  return Math.round(v).toLocaleString('en-IN');
}

export const featureLabels: Record<PackFeature, string> = {
  'n2-flush': 'Nitrogen flush',
  vacuum: 'Vacuum',
  transparent: 'Product visibility',
  'anti-fog': 'Anti-fog',
  carton: 'Carton format',
  bulk: 'Bulk format',
  reclosable: 'Reclosable'
};

export const levelStyles: Record<Level, {text: string;bg: string;bar: string;}> = {
  Low: { text: 'text-ink-soft', bg: 'bg-canvas', bar: 'bg-brand-200' },
  Moderate: { text: 'text-brand-700', bg: 'bg-brand-50', bar: 'bg-brand-400' },
  High: { text: 'text-accent-700', bg: 'bg-accent-50', bar: 'bg-accent-500' },
  Critical: { text: 'text-danger-700', bg: 'bg-danger-50', bar: 'bg-danger-500' }
};

export const shelfFitStyles: Record<ShelfFit, string> = {
  'Meets target': 'text-brand-700 bg-brand-50',
  Marginal: 'text-warn-700 bg-warn-50',
  'Below target': 'text-danger-700 bg-danger-50',
  'Validation required': 'text-ink-soft bg-canvas'
};

export const layerColors: Record<LayerKind, string> = {
  PET: '#8FB8C9',
  BOPP: '#A9C7A0',
  CPP: '#CFE0BF',
  PE: '#E6E1D0',
  Metal: '#9AA3A8',
  Alu: '#6F7A80',
  EVOH: '#E9C77B',
  PA: '#D7A98A',
  Paper: '#C8A77A',
  PLA: '#B9CFA0',
  PP: '#BFD3DE',
  Cellulose: '#DCCFA0'
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}