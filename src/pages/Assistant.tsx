import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, BookMarkedIcon, ShieldCheckIcon } from 'lucide-react';
import { knowledgeBase, suggestedQuestions } from '../data/assistant';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string[];
  sources?: string[];
}

function answer(q: string): Omit<Message, 'id' | 'role'> {
  const lower = q.toLowerCase();
  const scored = knowledgeBase.
  map((k) => ({ k, score: k.keywords.filter((kw) => lower.includes(kw)).length + (k.question.toLowerCase() === lower ? 5 : 0) })).
  sort((a, b) => b.score - a.score);
  if (!scored[0] || scored[0].score === 0) {
    return {
      text: [
      'I couldn’t find this in the curated packaging library, so I won’t guess. Try asking about barrier properties, MAP for fresh produce, recyclability, validation tests or FSSAI requirements.']

    };
  }
  return { text: scored[0].k.answer, sources: scored[0].k.sources };
}

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, thinking]);

  const ask = (q: string) => {
    if (!q.trim() || thinking) return;
    setMessages((m) => [...m, { id: Date.now(), role: 'user', text: [q] }]);
    setInput('');
    setThinking(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', ...answer(q) }]);
      setThinking(false);
    }, 650);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-110px)] w-full max-w-3xl flex-col px-4 pb-6 pt-8 sm:px-6 lg:min-h-screen lg:pt-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Ask ShelfAssure</h1>
        <p className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
          <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          Answers come only from the curated packaging library, with sources. It won’t invent engineering values.
        </p>
      </div>

      <div className="mt-8 flex-1 space-y-6" aria-live="polite">
        {messages.length === 0 &&
        <div>
            <p className="text-xs text-ink-muted">Try asking</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {suggestedQuestions.map((q) =>
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              className="rounded-lg bg-surface px-4 py-3 text-left text-sm text-ink shadow-card ring-1 ring-line transition-colors duration-150 hover:bg-canvas">
              
                  {q}
                </button>
            )}
            </div>
          </div>
        }
        {messages.map((m) =>
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className={m.role === 'user' ? 'flex justify-end' : ''}>
          
            {m.role === 'user' ?
          <p className="max-w-[80%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white">{m.text[0]}</p> :

          <div className="space-y-3 text-[15px] leading-relaxed text-ink">
                {m.text.map((t) => <p key={t}>{t}</p>)}
                {m.sources &&
            <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.sources.map((s) =>
              <span key={s} className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-xs text-ink-soft ring-1 ring-line">
                        <BookMarkedIcon className="h-3 w-3 text-brand-600" aria-hidden="true" /> {s}
                      </span>
              )}
                  </div>
            }
              </div>
          }
          </motion.div>
        )}
        {thinking &&
        <div className="flex gap-1" aria-label="Searching library">
            {[0, 1, 2].map((i) =>
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ink-muted"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />

          )}
          </div>
        }
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="sticky bottom-4 mt-6 flex items-center gap-2 rounded-xl bg-surface p-2 shadow-lift ring-1 ring-line">
        
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about barriers, MAP, recyclability, testing…"
          aria-label="Your question"
          className="flex-1 bg-transparent px-2 py-1.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none" />
        
        <button
          type="submit"
          disabled={!input.trim() || thinking}
          aria-label="Send"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white transition-colors duration-150 hover:bg-brand-700 disabled:bg-line-strong">
          
          <ArrowUpIcon className="h-4 w-4" />
        </button>
      </form>
    </div>);

}