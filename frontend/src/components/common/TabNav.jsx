import React, { useMemo } from 'react';

const slug = (s) => String(s).toLowerCase().replace(/\s+/g, '-');

/**
 * Accessible Tab Navigation
 *
 * props:
 * - tabs: Array<{ key: string, label: string }>
 * - activeKey: string
 * - onChange: (key: string) => void
 * - ariaLabel?: string
 * - className?: string
 */
export default function TabNav({ tabs, activeKey, onChange, ariaLabel = 'Tabs', className = '' }) {
  const keys = useMemo(() => tabs.map((t) => t.key), [tabs]);
  const currentIndex = useMemo(() => keys.indexOf(activeKey), [keys, activeKey]);

  const onKeyDown = (e, idx) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const next = (idx + delta + keys.length) % keys.length;
    const nextKey = keys[next];
    onChange(nextKey);
    const nextId = `tab-${slug(nextKey)}`;
    requestAnimationFrame(() => document.getElementById(nextId)?.focus());
  };

  return (
    <nav
      className={`-mb-px flex space-x-6 overflow-x-auto ${className}`}
      aria-label={ariaLabel}
      role="tablist"
    >
      {tabs.map((t, idx) => {
        const id = `tab-${slug(t.key)}`;
        const panelId = `panel-${slug(t.key)}`;
        const isActive = activeKey === t.key;
        return (
          <button
            key={t.key}
            id={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            onClick={() => onChange(t.key)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isActive
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

