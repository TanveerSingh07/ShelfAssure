import React from 'react';

export function Logo({ dark = false }: {dark?: boolean;}) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="7" fill={dark ? '#1F7F64' : '#166A53'} />
        <path d="M14 6.5 20.5 9v5.2c0 3.9-2.7 6.6-6.5 7.8-3.8-1.2-6.5-3.9-6.5-7.8V9L14 6.5Z" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="m10.8 14.2 2.3 2.3 4.3-4.6" fill="none" stroke="#FAE6BF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`text-[15px] font-semibold tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>ShelfAssure</span>
    </div>);

}