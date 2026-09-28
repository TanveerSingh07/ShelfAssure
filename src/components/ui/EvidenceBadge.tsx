import React from 'react';
import { BeakerIcon, BookOpenIcon, FactoryIcon, FileQuestionIcon } from 'lucide-react';
import type { EvidenceStatus } from '../../types/analysis';
import { Badge } from './Badge';

const config: Record<EvidenceStatus, {tone: 'brand' | 'neutral' | 'accent' | 'warn';icon: React.ElementType;label: string;}> = {
  Measured: { tone: 'brand', icon: BeakerIcon, label: 'Measured' },
  Literature: { tone: 'neutral', icon: BookOpenIcon, label: 'Literature' },
  Manufacturer: { tone: 'accent', icon: FactoryIcon, label: 'Manufacturer' },
  Reference: { tone: 'warn', icon: FileQuestionIcon, label: 'Reference only' }
};

export function EvidenceBadge({ status }: {status: EvidenceStatus;}) {
  const c = config[status];
  const Icon = c.icon;
  return (
    <Badge tone={c.tone}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {c.label}
    </Badge>);

}