import React from 'react';
import { Logo } from './Logo';
import { navItems } from './navItems';
import type { View } from '../types/navigation';

interface MobileNavProps {
  view: View;
  onNavigate: (v: View) => void;
}

export function MobileNav({ view, onNavigate }: MobileNavProps) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-[11px] font-semibold text-ink">AR</div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Main">
        {navItems.map((item) => {
          const active = view === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onNavigate(item.view)}
              aria-current={active ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
              active ? 'bg-ink text-white' : 'text-ink-muted hover:bg-canvas'}`
              }>
              
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.label}
            </button>);

        })}
      </nav>
    </header>);

}