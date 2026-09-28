import React, { useState } from 'react';
import { ChevronDownIcon, ShieldAlertIcon } from 'lucide-react';
import { CandidateRow } from './CandidateRow';
import { PriorityPanel } from './PriorityPanel';
import type { CandidateResult, Priorities, RequirementProfile } from '../../types/analysis';

interface CandidatesStepProps {
  results: CandidateResult[];
  profile: RequirementProfile;
  priorities: Priorities;
  onPriorities: (p: Priorities) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  shelfTarget: number;
}

export function CandidatesStep({ results, profile, priorities, onPriorities, compareIds, onToggleCompare, shelfTarget }: CandidatesStepProps) {
  const [showRejected, setShowRejected] = useState(false);
  const ranked = results.filter((r) => r.status !== 'rejected');
  const feasible = results.filter((r) => r.status === 'feasible').length;
  const conditional = results.filter((r) => r.status === 'conditional').length;
  const rejected = results.filter((r) => r.status === 'rejected');
  const total = results.length;

  return (
    <section aria-labelledby="cand-heading">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-medium text-brand-700">Screened & ranked candidates</p>
          <h1 id="cand-heading" className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {ranked.length} of {total} structures can do the job
          </h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Hard constraints run first: food-contact status, temperature, {profile.isProduce ? 'gas exchange' : 'barrier targets'}, light,
            strength and seal. Only structures that pass are ranked, so a high score can never rescue an unsafe option.
          </p>

          <div className="mt-6">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
              <div className="bg-brand-500" style={{ width: `${feasible / total * 100}%` }} />
              <div className="bg-warn-500" style={{ width: `${conditional / total * 100}%` }} />
              <div className="bg-line-strong" style={{ width: `${rejected.length / total * 100}%` }} />
            </div>
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-500" aria-hidden="true" />
                <dt className="text-ink-soft">Feasible</dt>
                <dd className="tabular font-mono font-semibold text-ink">{feasible}</dd>
              </div>
              {conditional > 0 &&
              <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warn-500" aria-hidden="true" />
                  <dt className="text-ink-soft">Needs validation</dt>
                  <dd className="tabular font-mono font-semibold text-ink">{conditional}</dd>
                </div>
              }
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-line-strong" aria-hidden="true" />
                <dt className="text-ink-soft">Rejected</dt>
                <dd className="tabular font-mono font-semibold text-ink">{rejected.length}</dd>
              </div>
            </dl>
          </div>
        </div>
        <PriorityPanel priorities={priorities} onChange={onPriorities} />
      </div>

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="font-semibold text-ink">Ranked shortlist</h2>
        <p className="text-xs text-ink-muted">Shelf-life target {shelfTarget} days · select up to 3 to compare</p>
      </div>
      <ul className="mt-3 space-y-3">
        {ranked.map((r, idx) =>
        <CandidateRow
          key={r.material.id}
          result={r}
          recommended={idx === 0}
          comparing={compareIds.includes(r.material.id)}
          onToggleCompare={() => onToggleCompare(r.material.id)} />

        )}
      </ul>

      <div className="mt-8 rounded-xl bg-surface shadow-card ring-1 ring-line">
        <button
          type="button"
          onClick={() => setShowRejected((s) => !s)}
          aria-expanded={showRejected}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
          
          <span className="flex items-center gap-2.5">
            <ShieldAlertIcon className="h-4 w-4 text-danger-500" aria-hidden="true" />
            <span className="font-semibold text-ink">{rejected.length} rejected on hard constraints</span>
          </span>
          <ChevronDownIcon className={`h-4 w-4 text-ink-muted transition-transform duration-150 ${showRejected ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {showRejected &&
        <div className="overflow-x-auto border-t border-line">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted">
                  <th className="px-5 py-2.5 font-medium">Structure</th>
                  <th className="px-5 py-2.5 font-medium">Failed constraint</th>
                  <th className="px-5 py-2.5 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rejected.map((r) => {
                const fails = r.checks.filter((c) => c.ok === false);
                return (
                  <tr key={r.material.id} className="align-top">
                      <td className="px-5 py-3 font-medium text-ink">{r.material.name}</td>
                      <td className="px-5 py-3 text-danger-700">
                        {fails[0]?.label}
                        {fails.length > 1 && <span className="text-ink-muted"> +{fails.length - 1} more</span>}
                      </td>
                      <td className="px-5 py-3 text-ink-soft">{fails[0]?.detail}</td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }
      </div>
    </section>);

}