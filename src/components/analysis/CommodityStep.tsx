import React from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { commodities } from '../../data/commodities';

interface CommodityStepProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CommodityStep({ selectedId, onSelect }: CommodityStepProps) {
  return (
    <section aria-labelledby="commodity-heading">
      <h1 id="commodity-heading" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        What are you packaging?
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Pick a commodity. Its typical properties load automatically, and you can adjust them in the next step to match your
        product.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {commodities.map((c) => {
          const selected = c.id === selectedId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              aria-pressed={selected}
              className={`group flex flex-col overflow-hidden rounded-xl bg-surface text-left ring-1 transition-[box-shadow,transform] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
              selected ? 'shadow-lift ring-2 ring-brand-500' : 'shadow-card ring-line hover:-translate-y-0.5 hover:shadow-lift'}`
              }>
              
              <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                {selected &&
                <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white">
                    <CheckCircle2Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                }
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs text-ink-muted">{c.category}</p>
                <h2 className="mt-0.5 font-semibold text-ink">{c.name}</h2>
                <p className="mt-1 text-sm text-ink-soft">{c.tagline}</p>
                <div className="mt-auto pt-4">
                  <p className="text-[11px] text-ink-muted">Main risks</p>
                  <p className="mt-0.5 text-xs font-medium text-ink-soft">{c.keyRisks.join(' · ')}</p>
                </div>
              </div>
            </button>);

        })}
      </div>
    </section>);

}