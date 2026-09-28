import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Overview } from './pages/Overview';
import { Analysis } from './pages/Analysis';
import { Materials } from './pages/Materials';
import { History } from './pages/History';
import { Assistant } from './pages/Assistant';
import { savedAnalyses } from './data/analyses';
import type { FoodInputs, SavedAnalysis } from './types/analysis';
import type { AnalysisSeed, View } from './types/navigation';

export function App() {
  const [view, setView] = useState<View>('overview');
  const [seed, setSeed] = useState<AnalysisSeed>({ key: 0, commodityId: null });
  const [saved, setSaved] = useState<SavedAnalysis[]>(savedAnalyses);

  const startAnalysis = (commodityId: string | null = null, inputs?: FoodInputs) => {
    setSeed({ key: Date.now(), commodityId, inputs });
    setView('analyze');
    window.scrollTo({ top: 0 });
  };

  const navigate = (v: View) => {
    if (v === 'analyze' && view !== 'analyze') setSeed({ key: Date.now(), commodityId: null });
    setView(v);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex min-h-screen w-full bg-canvas font-sans text-ink">
      <Sidebar view={view} onNavigate={navigate} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNav view={view} onNavigate={navigate} />
        <main className="flex-1">
          {view === 'overview' && <Overview saved={saved} onStart={startAnalysis} onNavigate={navigate} />}
          {view === 'analyze' &&
          <Analysis key={seed.key} seed={seed} onSave={(a) => setSaved((prev) => [a, ...prev])} />
          }
          {view === 'materials' && <Materials />}
          {view === 'history' && <History saved={saved} onReopen={startAnalysis} />}
          {view === 'assistant' && <Assistant />}
        </main>
      </div>
      <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }} />
    </div>);

}