import { useMemo, useState } from 'react';
import { getCommodity } from '../data/commodities';
import { computeProfile, DEFAULT_PRIORITIES, evaluateCandidates } from '../utils/engine';
import type { FoodInputs, Priorities } from '../types/analysis';
import type { AnalysisSeed } from '../types/navigation';

export const STEPS = ['Commodity', 'Conditions', 'Requirements', 'Candidates', 'Compare', 'Report'] as const;

export function useAnalysis(seed: AnalysisSeed) {
  const seeded = seed.commodityId ? getCommodity(seed.commodityId) : undefined;
  const [step, setStep] = useState(seeded ? 1 : 0);
  const [maxStep, setMaxStep] = useState(seeded ? 1 : 0);
  const [commodityId, setCommodityId] = useState<string | null>(seeded?.id ?? null);
  const [inputs, setInputs] = useState<FoodInputs | null>(seed.inputs ?? seeded?.defaults ?? null);
  const [priorities, setPriorities] = useState<Priorities>(DEFAULT_PRIORITIES);
  const [running, setRunning] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [reportId, setReportId] = useState<string | null>(null);

  const commodity = commodityId ? getCommodity(commodityId) ?? null : null;
  const profile = useMemo(() => commodity && inputs ? computeProfile(commodity, inputs) : null, [commodity, inputs]);
  const results = useMemo(
    () => commodity && inputs && profile ? evaluateCandidates(commodity, inputs, priorities, profile) : [],
    [commodity, inputs, profile, priorities]
  );
  const ranked = results.filter((r) => r.status !== 'rejected');
  const reportCandidate = results.find((r) => r.material.id === reportId && r.status !== 'rejected') ?? ranked[0] ?? null;

  const goTo = (s: number) => {
    if (s === 4 && compareIds.length === 0) setCompareIds(ranked.slice(0, 3).map((r) => r.material.id));
    setStep(s);
    setMaxStep((m) => Math.max(m, s));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCommodity = (id: string) => {
    const c = getCommodity(id);
    if (!c) return;
    if (id !== commodityId) {
      setCommodityId(id);
      setInputs(c.defaults);
      setCompareIds([]);
      setReportId(null);
      setMaxStep(0);
    }
  };

  const updateInputs = (patch: Partial<FoodInputs>) => setInputs((prev) => prev ? { ...prev, ...patch } : prev);

  const resetInputs = () => commodity && setInputs(commodity.defaults);

  const runAnalysis = () => {
    setRunning(true);
    setMaxStep(1);
    window.setTimeout(() => {
      setRunning(false);
      goTo(2);
    }, 1700);
  };

  const toggleCompare = (id: string) =>
  setCompareIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? [...prev.slice(1), id] : [...prev, id]);

  return {
    step,
    maxStep,
    goTo,
    commodity,
    inputs,
    setInputs,
    updateInputs,
    resetInputs,
    selectCommodity,
    priorities,
    setPriorities,
    profile,
    results,
    ranked,
    running,
    runAnalysis,
    compareIds,
    toggleCompare,
    reportCandidate,
    setReportId
  };
}