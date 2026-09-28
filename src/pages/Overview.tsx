import React from 'react';
import { ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { commodities, getCommodity } from '../data/commodities';
import { materials } from '../data/materials';
import { formatDate, shelfFitStyles } from '../utils/format';
import type { FoodInputs, SavedAnalysis } from '../types/analysis';
import type { View } from '../types/navigation';

interface OverviewProps {
  saved: SavedAnalysis[];
  onStart: (commodityId?: string | null, inputs?: FoodInputs) => void;
  onNavigate: (v: View) => void;
}

const pipeline = [
{ title: 'Input', text: 'Food properties, storage, transport and shelf-life target' },
{ title: 'Profile', text: 'Food risks turned into barrier and performance targets' },
{ title: 'Filter', text: 'Hard rules: food contact, temperature, barrier, seal' },
{ title: 'Rank', text: 'Model-assisted ranking of the structures that pass' },
{ title: 'Optimise', text: 'Protection, cost and sustainability trade-offs' },
{ title: 'Explain', text: 'Recommendation, evidence, assumptions and test plan' }];


export function Overview({ saved, onStart, onNavigate }: OverviewProps) {
  const latest = saved[0];
  const latestCommodity = latest ? getCommodity(latest.commodityId) : undefined;
  const evidenceMix = (['Measured', 'Manufacturer', 'Literature', 'Reference'] as const).map((e) => ({
    e,
    n: materials.filter((m) => m.evidence === e).length
  }));
  const evidenceColor: Record<string, string> = { Measured: '#1F7F64', Manufacturer: '#D9912B', Literature: '#9FD1BF', Reference: '#C99A06' };

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-12">
      <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="text-sm text-ink-muted">Good afternoon, Ananya</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[44px]">
            Packaging decisions, engineered from the food up.
          </h1>
          <p className="mt-4 max-w-xl text-ink-soft">
            Describe your product and its journey. ShelfAssure works out what the pack must do, screens every structure against hard safety
            rules, then ranks what’s left by protection, cost and sustainability.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onStart(null)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-brand-700">
              
              Start new analysis <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('materials')}
              className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-canvas">
              
              Browse materials
            </button>
          </div>
        </div>

        {latest && latestCommodity &&
        <button
          type="button"
          onClick={() => onStart(latest.commodityId, latest.inputs)}
          className="group rounded-2xl bg-ink p-6 text-left text-white shadow-lift transition-transform duration-200 ease-out hover:-translate-y-0.5">
          
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/50">Latest recommendation · {formatDate(latest.date)}</p>
              <ArrowUpRightIcon className="h-4 w-4 text-white/40 transition-colors duration-150 group-hover:text-white" aria-hidden="true" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <img src={latestCommodity.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div>
                <p className="text-sm text-white/60">{latest.commodityName}</p>
                <p className="text-lg font-semibold leading-snug">{latest.recommendation}</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-4 text-sm">
              <div>
                <p className="text-[11px] text-white/50">Screened</p>
                <p className="tabular font-mono font-semibold">{latest.screened}</p>
              </div>
              <div>
                <p className="text-[11px] text-white/50">Feasible</p>
                <p className="tabular font-mono font-semibold">{latest.feasibleCount}</p>
              </div>
              <div>
                <p className="text-[11px] text-white/50">Shelf life</p>
                <p className="font-semibold text-brand-200">{latest.shelfFit}</p>
              </div>
            </div>
          </button>
        }
      </section>

      <section className="mt-14" aria-labelledby="start-heading">
        <div className="flex items-baseline justify-between">
          <h2 id="start-heading" className="text-lg font-semibold text-ink">
            Start with a product
          </h2>
          <p className="hidden text-sm text-ink-muted sm:block">Typical properties load automatically</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {commodities.map((c) =>
          <button
            key={c.id}
            type="button"
            onClick={() => onStart(c.id)}
            className="group overflow-hidden rounded-xl bg-surface text-left shadow-card ring-1 ring-line transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lift">
            
              <div className="aspect-[4/3] overflow-hidden">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-3.5">
                <p className="font-semibold text-ink">{c.name}</p>
                <p className="mt-0.5 truncate text-xs text-ink-muted">{c.keyRisks[0]} · {c.packFormat}</p>
              </div>
            </button>
          )}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="pipeline-heading">
        <h2 id="pipeline-heading" className="text-lg font-semibold text-ink">
          How every recommendation is made
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">
          Requirements come first, materials second. Safety rules are fixed and applied before any model scoring, so a high score can never
          override an incompatibility.
        </p>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-0">
          {pipeline.map((p, i) =>
          <li key={p.title} className="relative lg:pr-5">
              <div className="flex items-center gap-3">
                <span
                className={`tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ${'bg-ink text-white'}`
                }>
              
                  {i + 1}
                </span>
                {i < pipeline.length - 1 && <span className="hidden h-px flex-1 bg-line-strong lg:block" aria-hidden="true" />}
              </div>
              <p className="mt-3 font-semibold text-ink">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.text}</p>
            </li>
          )}
        </ol>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl bg-surface shadow-card ring-1 ring-line">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-semibold text-ink">Recent analyses</h2>
            <button type="button" onClick={() => onNavigate('history')} className="text-sm font-medium text-brand-700 hover:underline">
              View all
            </button>
          </div>
          <ul className="divide-y divide-line border-t border-line">
            {saved.slice(0, 4).map((a) => {
              const c = getCommodity(a.commodityId);
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onStart(a.commodityId, a.inputs)}
                    className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors duration-150 hover:bg-canvas/60">
                    
                    {c && <img src={c.image} alt="" className="h-9 w-9 shrink-0 rounded-md object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{a.recommendation}</p>
                      <p className="truncate text-xs text-ink-muted">
                        {a.commodityName} · {formatDate(a.date)} · {a.owner}
                      </p>
                    </div>
                    <span className={`hidden whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium sm:inline ${shelfFitStyles[a.shelfFit]}`}>
                      {a.shelfFit}
                    </span>
                  </button>
                </li>);

            })}
          </ul>
        </div>

        <div className="rounded-xl bg-surface p-5 shadow-card ring-1 ring-line">
          <h2 className="font-semibold text-ink">Knowledge base</h2>
          <dl className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-ink-muted">Structures</dt>
              <dd className="tabular font-mono text-2xl font-semibold text-ink">{materials.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Commodities</dt>
              <dd className="tabular font-mono text-2xl font-semibold text-ink">{commodities.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Rules</dt>
              <dd className="tabular font-mono text-2xl font-semibold text-ink">42</dd>
            </div>
          </dl>
          <p className="mt-5 text-xs text-ink-muted">Property evidence</p>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full" aria-hidden="true">
            {evidenceMix.map(({ e, n }) =>
            <div key={e} style={{ width: `${n / materials.length * 100}%`, background: evidenceColor[e] }} />
            )}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-ink-soft">
            {evidenceMix.map(({ e, n }) =>
            <li key={e} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: evidenceColor[e] }} aria-hidden="true" />
                {e} <span className="tabular ml-auto font-mono text-ink-muted">{n}</span>
              </li>
            )}
          </ul>
          <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-ink-muted">
            Every barrier value is stored with its unit, thickness and test conditions.
          </p>
        </div>
      </section>
    </div>);

}