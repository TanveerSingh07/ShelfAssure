import React, { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { LeafIcon } from 'lucide-react';
import { Slider } from '../ui/Slider';
import { simulateMAP } from '../../utils/engine';
import type { Commodity, Material } from '../../types/analysis';

interface MapSimulatorProps {
  commodity: Commodity;
  temperature: number;
  respirationRate: number | null;
  films: Material[];
}

const statusCopy = {
  'in-target': { label: 'Within target band', cls: 'bg-brand-50 text-brand-700' },
  'above-target': { label: 'Above target — limited MAP benefit', cls: 'bg-warn-50 text-warn-700' },
  anaerobic: { label: 'Anaerobic risk — O₂ too low', cls: 'bg-danger-50 text-danger-700' }
};

export function MapSimulator({ commodity, temperature, respirationRate, films }: MapSimulatorProps) {
  const [filmId, setFilmId] = useState(films[0].id);
  const [temp, setTemp] = useState(temperature);
  const film = films.find((f) => f.id === filmId) ?? films[0];
  const r = commodity.respiration!;
  const sim = useMemo(() => simulateMAP(commodity, temp, film.otr ?? 0, respirationRate), [commodity, temp, film, respirationRate]);
  const status = statusCopy[sim.status];

  return (
    <div className="rounded-xl bg-surface p-6 shadow-card ring-1 ring-line sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <LeafIcon className="h-4 w-4 text-brand-600" aria-hidden="true" /> Fresh-produce MAP module
        </h2>
        <p className="max-w-2xl text-sm text-ink-soft">
          Headspace gas inside a {r.fillWeightKg * 1000} g pack as {commodity.name.toLowerCase()} respire. The film must let in O₂ as fast as
          the produce uses it, so the pack settles inside the target band.
        </p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-ink">Film</p>
            <div className="mt-2 space-y-1.5" role="radiogroup" aria-label="Film">
              {films.map((f) =>
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={f.id === filmId}
                onClick={() => setFilmId(f.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm ring-1 transition-colors duration-150 ${
                f.id === filmId ? 'bg-brand-50 font-medium text-ink ring-brand-300' : 'text-ink-soft ring-line hover:bg-canvas'}`
                }>
                
                  <span className="truncate">{f.name}</span>
                  <span className="tabular shrink-0 font-mono text-[11px] text-ink-muted">{f.otr?.toLocaleString('en-IN')}</span>
                </button>
              )}
            </div>
          </div>
          <Slider label="Storage temperature" value={temp} min={2} max={30} unit="°C" onChange={setTemp} />
          <dl className="grid grid-cols-2 gap-4 border-t border-line pt-4">
            <div>
              <dt className="text-xs text-ink-muted">Equilibrium O₂</dt>
              <dd className="tabular font-mono text-xl font-semibold text-ink">{sim.eqO2.toFixed(1)}%</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Equilibrium CO₂</dt>
              <dd className="tabular font-mono text-xl font-semibold text-ink">{sim.eqCO2.toFixed(1)}%</dd>
            </div>
          </dl>
          <p className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${status.cls}`} role="status">
            {status.label}
          </p>
        </div>

        <div className="min-h-[300px]">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={sim.points} margin={{ top: 8, right: 12, left: -16, bottom: 4 }}>
              <CartesianGrid stroke="#E4E2DA" vertical={false} />
              <ReferenceArea y1={r.targetO2[0]} y2={r.targetO2[1]} fill="#1F7F64" fillOpacity={0.1} stroke="none" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#66756F' }} tickLine={false} axisLine={false} unit="h" />
              <YAxis domain={[0, 22]} tick={{ fontSize: 11, fill: '#66756F' }} tickLine={false} axisLine={false} unit="%" />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E4E2DA', fontSize: 12 }}
                labelFormatter={(h) => `Hour ${h}`}
                formatter={(v: number, n: string) => [`${v.toFixed(1)}%`, n === 'o2' ? 'O₂' : 'CO₂']} />
              
              <Line type="monotone" dataKey="o2" stroke="#166A53" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="co2" stroke="#D9912B" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-5 text-xs text-ink-soft">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-brand-600" /> O₂</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-accent-500" /> CO₂</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-brand-100" /> O₂ target {r.targetO2[0]}–{r.targetO2[1]}%</span>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Respiration and film permeance depend on the product and on temperature. Verify headspace gas in a physical trial before
            commercial use.
          </p>
        </div>
      </div>
    </div>);

}