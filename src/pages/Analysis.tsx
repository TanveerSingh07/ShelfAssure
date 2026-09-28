import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from 'lucide-react';
import { STEPS, useAnalysis } from '../hooks/useAnalysis';
import { Stepper } from '../components/analysis/Stepper';
import { CommodityStep } from '../components/analysis/CommodityStep';
import { ConditionsStep } from '../components/analysis/ConditionsStep';
import { RequirementsStep } from '../components/analysis/RequirementsStep';
import { CandidatesStep } from '../components/analysis/CandidatesStep';
import { CompareStep } from '../components/analysis/CompareStep';
import { ReportStep } from '../components/analysis/ReportStep';
import { EngineRunning } from '../components/analysis/EngineRunning';
import type { SavedAnalysis } from '../types/analysis';
import type { AnalysisSeed } from '../types/navigation';

interface AnalysisProps {
  seed: AnalysisSeed;
  onSave: (a: SavedAnalysis) => void;
}

export function Analysis({ seed, onSave }: AnalysisProps) {
  const a = useAnalysis(seed);
  const { step, commodity, inputs, profile } = a;

  const canContinue = step === 0 ? !!commodity : step < 5;
  const next = () => {
    if (step === 1) a.runAnalysis();else
    a.goTo(step + 1);
  };

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Stepper steps={STEPS} current={step} maxStep={a.maxStep} onSelect={(i) => i === 2 && a.maxStep < 2 ? null : a.goTo(i)} />
        {commodity && step > 0 &&
        <div className="no-print flex items-center gap-2 text-sm text-ink-soft">
            <img src={commodity.image} alt="" className="h-7 w-7 rounded-md object-cover" />
            <span className="font-medium text-ink">{commodity.name}</span>
          </div>
        }
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
            
            {step === 0 && <CommodityStep selectedId={commodity?.id ?? null} onSelect={a.selectCommodity} />}
            {step === 1 && commodity && inputs && profile &&
            <ConditionsStep commodity={commodity} inputs={inputs} profile={profile} onChange={a.updateInputs} onReset={a.resetInputs} />
            }
            {step === 2 && commodity && inputs && profile && <RequirementsStep commodity={commodity} inputs={inputs} profile={profile} />}
            {step === 3 && commodity && inputs && profile &&
            <CandidatesStep
              results={a.results}
              profile={profile}
              priorities={a.priorities}
              onPriorities={a.setPriorities}
              compareIds={a.compareIds}
              onToggleCompare={a.toggleCompare}
              shelfTarget={inputs.shelfLifeDays} />

            }
            {step === 4 && commodity && inputs && profile &&
            <CompareStep
              commodity={commodity}
              inputs={inputs}
              priorities={a.priorities}
              results={a.results}
              compareIds={a.compareIds}
              onToggleCompare={a.toggleCompare}
              onApplyScenario={(i) => a.setInputs(i)} />

            }
            {step === 5 && commodity && inputs && profile && a.reportCandidate &&
            <ReportStep
              commodity={commodity}
              inputs={inputs}
              profile={profile}
              results={a.results}
              candidate={a.reportCandidate}
              onChangeCandidate={a.setReportId}
              onSave={onSave} />

            }
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur lg:left-60">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => a.goTo(step - 1)}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors duration-150 hover:bg-canvas disabled:invisible">
            
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <p className="hidden text-xs text-ink-muted md:block">
            Step {step + 1} of {STEPS.length}
          </p>
          {step < 5 &&
          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:bg-line-strong">
            
              {step === 1 ?
            <>
                  <PlayIcon className="h-4 w-4" aria-hidden="true" /> Run analysis
                </> :

            <>
                  {step === 4 ? 'Generate report' : `Continue to ${STEPS[step + 1].toLowerCase()}`}
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </>
            }
            </button>
          }
        </div>
      </div>

      <AnimatePresence>{a.running && commodity && <EngineRunning commodityName={commodity.name} />}</AnimatePresence>
    </div>);

}