import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { materials } from '../../data/materials';

const stages = [
'Validating inputs and units',
'Classifying food risks',
'Deriving packaging requirement profile',
`Screening ${materials.length} structures against hard constraints`,
'Ranking feasible candidates'];


export function EngineRunning({ commodityName }: {commodityName: string;}) {
  const [done, setDone] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setDone((d) => Math.min(stages.length, d + 1)), 320);
    return () => window.clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      role="status"
      aria-live="polite">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-lift">
        
        <p className="text-sm text-ink-muted">Analysing</p>
        <h2 className="mt-0.5 text-lg font-semibold text-ink">{commodityName}</h2>
        <ul className="mt-5 space-y-3">
          {stages.map((s, i) => {
            const complete = i < done;
            const active = i === done;
            return (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  complete ? 'bg-brand-600 text-white' : active ? 'text-brand-600' : 'bg-line text-transparent'}`
                  }>
                  
                  {complete ? <CheckIcon className="h-3 w-3" /> : active ? <Loader2Icon className="h-4 w-4 animate-spin" /> : null}
                </span>
                <span className={complete || active ? 'text-ink' : 'text-ink-muted'}>{s}</span>
              </li>);

          })}
        </ul>
      </motion.div>
    </motion.div>);

}