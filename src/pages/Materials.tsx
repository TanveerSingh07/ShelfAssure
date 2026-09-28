import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoIcon, SearchIcon, XIcon } from 'lucide-react';
import { materials } from '../data/materials';
import { LayerStack } from '../components/LayerStack';
import { EvidenceBadge } from '../components/ui/EvidenceBadge';
import { Badge } from '../components/ui/Badge';
import { SCALE } from '../utils/engine';
import { featureLabels, fmtNum } from '../utils/format';
import type { Material, MaterialFamily } from '../types/analysis';

const families: ('All' | MaterialFamily)[] = ['All', 'Mono film', 'Laminate', 'Metallized', 'High barrier', 'Breathable', 'Rigid', 'Paper-based', 'Woven'];

export function Materials() {
  const [family, setFamily] = useState<(typeof families)[number]>('All');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Material | null>(null);

  const list = useMemo(
    () =>
    materials.filter(
      (m) =>
      (family === 'All' || m.family === family) && (
      m.name.toLowerCase().includes(query.toLowerCase()) || m.typicalUse.toLowerCase().includes(query.toLowerCase()))
    ),
    [family, query]
  );

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-12">
      <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Materials library</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Curated packaging structures with measured or referenced properties. OTR and WVTR are not constants for a polymer name, so each
        value is stored with its thickness and test conditions.
      </p>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {families.map((f) =>
          <button
            key={f}
            type="button"
            onClick={() => setFamily(f)}
            aria-pressed={family === f}
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
            family === f ? 'bg-ink text-white' : 'bg-surface text-ink-soft ring-1 ring-line hover:bg-canvas'}`
            }>
            
              {f}
            </button>
          )}
        </div>
        <div className="relative lg:w-72">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search structures or uses"
            aria-label="Search materials"
            className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl bg-surface shadow-card ring-1 ring-line">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-muted">
              <th className="px-5 py-3 font-medium">Structure</th>
              <th className="px-4 py-3 text-right font-medium">OTR <span className="font-normal">cc/m²·day</span></th>
              <th className="px-4 py-3 text-right font-medium">WVTR <span className="font-normal">g/m²·day</span></th>
              <th className="px-4 py-3 font-medium">Temp. range</th>
              <th className="px-4 py-3 text-right font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">End of life</th>
              <th className="px-5 py-3 font-medium">Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((m) =>
            <tr
              key={m.id}
              onClick={() => setActive(m)}
              onKeyDown={(e) => e.key === 'Enter' && setActive(m)}
              tabIndex={0}
              className="cursor-pointer transition-colors duration-150 hover:bg-canvas/60 focus:bg-canvas focus:outline-none">
              
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink">{m.name}</p>
                    {!m.foodContact && <Badge tone="danger">Not food-contact</Badge>}
                  </div>
                  <div className="mt-1.5 w-40">
                    <LayerStack layers={m.layers} />
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{m.family} · {m.typicalUse}</p>
                </td>
                <td className="tabular px-4 py-3.5 text-right font-mono text-ink">
                  {m.otr === null ? <span className="text-warn-700">n/a</span> : fmtNum(m.otr)}
                </td>
                <td className="tabular px-4 py-3.5 text-right font-mono text-ink">
                  {m.wvtr === null ? <span className="text-warn-700">n/a</span> : fmtNum(m.wvtr)}
                </td>
                <td className="tabular px-4 py-3.5 font-mono text-ink-soft">{m.tempRange[0]}…{m.tempRange[1]}°C</td>
                <td className="tabular px-4 py-3.5 text-right font-mono text-ink">₹{m.costPerM2}</td>
                <td className="px-4 py-3.5 text-ink-soft">{m.recyclability}</td>
                <td className="px-5 py-3.5"><EvidenceBadge status={m.evidence} /></td>
              </tr>
            )}
          </tbody>
        </table>
        {list.length === 0 && <p className="px-5 py-10 text-center text-sm text-ink-muted">No structures match your search.</p>}
      </div>

      <AnimatePresence>
        {active &&
        <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink/30"
            onClick={() => setActive(null)} />
          
            <motion.aside
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-surface shadow-lift"
            role="dialog"
            aria-modal="true"
            aria-labelledby="material-title">
            
              <div className="flex items-start justify-between gap-4 border-b border-line p-6">
                <div>
                  <p className="text-xs text-ink-muted">{active.family}</p>
                  <h2 id="material-title" className="text-lg font-semibold text-ink">{active.name}</h2>
                  <div className="mt-2"><EvidenceBadge status={active.evidence} /></div>
                </div>
                <button type="button" onClick={() => setActive(null)} className="rounded-md p-1 text-ink-muted hover:bg-canvas" aria-label="Close">
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-8 p-6">
                <div>
                  <h3 className="text-sm font-semibold text-ink">Layers</h3>
                  <p className="text-xs text-ink-muted">Outside → product contact</p>
                  <div className="mt-3"><LayerStack layers={active.layers} variant="stack" /></div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">Barrier properties</h3>
                  <dl className="mt-3 space-y-3 text-sm">
                    {[
                  { k: 'OTR', v: active.otr, u: 'cc/m²·day', c: active.otrCond },
                  { k: 'WVTR', v: active.wvtr, u: 'g/m²·day', c: active.wvtrCond }].
                  map((row) =>
                  <div key={row.k} className="rounded-lg bg-canvas p-3">
                        <div className="flex items-baseline justify-between">
                          <dt className="text-ink-muted">{row.k}</dt>
                          <dd className="tabular font-mono font-semibold text-ink">
                            {row.v === null ? 'Data unavailable' : `${fmtNum(row.v)} ${row.u}`}
                          </dd>
                        </div>
                        <p className={`mt-1 text-xs ${row.v === null ? 'text-warn-700' : 'text-ink-muted'}`}>{row.c}</p>
                      </div>
                  )}
                  </dl>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {[
                ['Thickness', `${active.thicknessRange[0]}–${active.thicknessRange[1]} µm`],
                ['Temperature', `${active.tempRange[0]} to ${active.tempRange[1]}°C`],
                ['Light barrier', SCALE[active.light]],
                ['Seal', SCALE[active.seal]],
                ['Strength', SCALE[active.mechanical]],
                ['Food contact', active.foodContact ? 'Approved' : 'Not approved'],
                ['Cost', `₹${active.costPerM2} / m²`],
                ['Carbon', `${active.carbon} kg CO₂e/kg`]].
                map(([k, v]) =>
                <div key={k}>
                      <dt className="text-xs text-ink-muted">{k}</dt>
                      <dd className="font-medium text-ink">{v}</dd>
                    </div>
                )}
                </dl>
                {active.features.length > 0 &&
              <div className="flex flex-wrap gap-1.5">
                    {active.features.map((f) => <Badge key={f}>{featureLabels[f]}</Badge>)}
                  </div>
              }
                <div className="flex gap-2 rounded-lg border border-line p-3 text-xs text-ink-soft">
                  <InfoIcon className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                  <span>Source: {active.source}. {active.recyclability}.</span>
                </div>
              </div>
            </motion.aside>
          </>
        }
      </AnimatePresence>
    </div>);

}