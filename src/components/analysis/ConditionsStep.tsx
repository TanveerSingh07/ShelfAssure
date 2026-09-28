import React from 'react';
import { AlertTriangleIcon, RotateCcwIcon, SunIcon, SunDimIcon } from 'lucide-react';
import { Slider } from '../ui/Slider';
import { Segmented } from '../ui/Segmented';
import type { Commodity, FoodInputs, RequirementProfile, StorageType, TransportMode } from '../../types/analysis';

interface ConditionsStepProps {
  commodity: Commodity;
  inputs: FoodInputs;
  profile: RequirementProfile;
  onChange: (patch: Partial<FoodInputs>) => void;
  onReset: () => void;
}

export function ConditionsStep({ commodity, inputs, profile, onChange, onReset }: ConditionsStepProps) {
  const produce = commodity.cls === 'fresh-produce';
  const edited = JSON.stringify(inputs) !== JSON.stringify(commodity.defaults);

  return (
    <section aria-labelledby="conditions-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 id="conditions-heading" className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Describe the product and its journey
          </h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Typical values for {commodity.name.toLowerCase()} are loaded. Adjust them to match your formulation, storage and
            distribution.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={!edited}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors duration-150 hover:bg-canvas disabled:opacity-40 sm:self-auto">
          
          <RotateCcwIcon className="h-3.5 w-3.5" aria-hidden="true" /> Reset to typical
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr_300px]">
        <fieldset className="rounded-xl bg-surface p-6 shadow-card ring-1 ring-line">
          <legend className="sr-only">Food properties</legend>
          <h2 className="font-semibold text-ink">Food properties</h2>
          <p className="mt-0.5 text-sm text-ink-muted">What the product is made of</p>
          <div className="mt-6 space-y-6">
            <Slider label="Moisture content" value={inputs.moisture} min={0} max={98} step={0.5} unit="%" onChange={(v) => onChange({ moisture: v })} />
            <Slider label="Fat / oil content" value={inputs.fat} min={0} max={60} step={0.5} unit="%" onChange={(v) => onChange({ fat: v })} />
            <Slider label="Water activity" value={inputs.aw} min={0.1} max={1} step={0.01} unit="aw" onChange={(v) => onChange({ aw: v })} />
            <Slider label="pH" value={inputs.pH} min={2} max={9} step={0.1} onChange={(v) => onChange({ pH: v })} />
            {produce && inputs.respirationRate !== null &&
            <Slider
              label="Respiration rate at 10°C"
              value={inputs.respirationRate}
              min={2}
              max={20}
              step={0.5}
              unit="mL/kg·h"
              hint="Oxygen consumed by the produce. Drives the MAP calculation."
              onChange={(v) => onChange({ respirationRate: v })} />

            }
          </div>
        </fieldset>

        <fieldset className="rounded-xl bg-surface p-6 shadow-card ring-1 ring-line">
          <legend className="sr-only">Environment and goals</legend>
          <h2 className="font-semibold text-ink">Environment & goals</h2>
          <p className="mt-0.5 text-sm text-ink-muted">Where it lives and for how long</p>
          <div className="mt-6 space-y-6">
            <Slider label="Target shelf life" value={inputs.shelfLifeDays} min={3} max={540} unit="days" onChange={(v) => onChange({ shelfLifeDays: v })} />
            <Slider label="Storage temperature" value={inputs.temperature} min={-18} max={45} unit="°C" onChange={(v) => onChange({ temperature: v })} />
            <Slider label="Relative humidity" value={inputs.rh} min={20} max={98} unit="% RH" onChange={(v) => onChange({ rh: v })} />
            <Segmented<StorageType>
              label="Storage type"
              value={inputs.storage}
              onChange={(v) => onChange({ storage: v })}
              options={[
              { value: 'ambient', label: 'Ambient' },
              { value: 'chilled', label: 'Chilled' },
              { value: 'frozen', label: 'Frozen' }]
              } />
            
            <Segmented<TransportMode>
              label="Transport"
              value={inputs.transport}
              onChange={(v) => onChange({ transport: v })}
              options={[
              { value: 'local', label: 'Local' },
              { value: 'regional', label: 'Regional' },
              { value: 'long-haul', label: 'Long-haul' }]
              } />
            
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Retail light exposure</p>
                <p className="text-xs text-ink-muted">Shelf display under store lighting</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={inputs.retailLight}
                aria-label="Retail light exposure"
                onClick={() => onChange({ retailLight: !inputs.retailLight })}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
                inputs.retailLight ? 'bg-brand-600' : 'bg-line-strong'}`
                }>
                
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform duration-150 ease-out ${
                  inputs.retailLight ? 'translate-x-5' : 'translate-x-0.5'}`
                  }>
                  
                  {inputs.retailLight ? <SunIcon className="h-3 w-3 text-accent-600" /> : <SunDimIcon className="h-3 w-3 text-ink-muted" />}
                </span>
              </button>
            </div>
          </div>
        </fieldset>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-line">
            <img src={commodity.image} alt={commodity.name} className="aspect-[16/9] w-full object-cover" />
            <div className="p-4">
              <p className="text-xs text-ink-muted">{commodity.category}</p>
              <p className="font-semibold text-ink">{commodity.name}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{commodity.packFormat}</p>
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-ink-muted">Preliminary risk class</dt>
                </div>
                <dd className="font-medium text-ink">{profile.riskClass}</dd>
              </dl>
            </div>
          </div>
          {profile.warnings.length > 0 ?
          <div className="rounded-xl bg-warn-50 p-4 ring-1 ring-inset ring-warn-100" role="alert">
              <div className="flex items-center gap-2 text-sm font-semibold text-warn-700">
                <AlertTriangleIcon className="h-4 w-4" aria-hidden="true" /> Check these inputs
              </div>
              <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
                {profile.warnings.map((w) =>
              <li key={w}>{w}</li>
              )}
              </ul>
            </div> :

          <p className="px-1 text-xs leading-relaxed text-ink-muted">
              All inputs are within the validated range for this commodity class. Running the analysis builds the requirement profile and
              screens every structure in the materials library.
            </p>
          }
        </aside>
      </div>
    </section>);

}