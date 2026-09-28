import React from 'react';
import { Logo } from './Logo';
import { navItems } from './navItems';
import { DB_VERSION, RULE_VERSION } from '../utils/engine';
import type { View } from '../types/navigation';

interface SidebarProps {
  view: View;
  onNavigate: (v: View) => void;
}

export function Sidebar({ view, onNavigate }: SidebarProps) {
  return (
    <aside className="no-print sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-ink px-3 py-5 lg:flex">
      <div className="px-2">
        <Logo dark />
        <p className="mt-1.5 text-[11px] leading-snug text-white/50">Food properties → the right pack</p>
      </div>

      <nav className="mt-8 flex flex-col gap-0.5" aria-label="Main">
        {navItems.map((item) => {
          const active = view === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onNavigate(item.view)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
              active ? 'bg-white/10 font-medium text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`
              }>
              
              <Icon className={`h-4 w-4 ${active ? 'text-accent-100' : ''}`} aria-hidden="true" />
              {item.label}
            </button>);

        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-lg border border-white/10 px-3 py-2.5">
          <p className="text-[11px] font-medium text-white/70">Engine</p>
          <p className="mt-1 font-mono text-[11px] text-white/50">{RULE_VERSION}</p>
          <p className="font-mono text-[11px] text-white/50">{DB_VERSION}</p>
        </div>
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-xs font-semibold text-ink">AR</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">Ananya Rao</p>
            <p className="truncate text-[11px] text-white/50">Kisan Foods · Food technologist</p>
          </div>
        </div>
      </div>
    </aside>);

}