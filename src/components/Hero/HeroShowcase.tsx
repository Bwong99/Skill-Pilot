'use client'

import { useState } from 'react'
import { GitBranch, Map, Route } from 'lucide-react'

const TABS = [
  { key: 'timeline', label: 'Timeline', Icon: Route },
  { key: 'tree', label: 'Skill tree', Icon: GitBranch },
  { key: 'map', label: 'Skill map', Icon: Map },
] as const

type TabKey = (typeof TABS)[number]['key']

const WEEKS = [
  { week: 1, label: 'JSX and props', done: true },
  { week: 2, label: 'State and events', done: true },
  { week: 3, label: 'Effects', done: true },
  { week: 4, label: 'Data fetching', done: false },
  { week: 5, label: 'Routing', done: false },
  { week: 6, label: 'Ship a project', done: false },
]

const TimelinePreview = () => (
  <div className="px-2">
    <div className="flex items-start justify-between">
      {WEEKS.map((w, i) => (
        <div key={w.week} className="flex flex-1 items-start">
          <div className="flex w-full flex-col items-center text-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-[11px] font-semibold ${
                w.done
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : i === 3
                  ? 'border-brand-400 bg-ink-900 text-brand-300'
                  : 'border-ink-600 bg-ink-900 text-ink-400'
              }`}
            >
              {w.week}
            </div>
            <p
              className={`mt-2 px-1 text-[11px] leading-tight ${
                i === 3 ? 'font-semibold text-white' : 'text-ink-400'
              }`}
            >
              {w.label}
            </p>
          </div>
          {i < WEEKS.length - 1 && (
            <div
              className={`mt-4 h-0.5 w-full shrink-0 ${w.done ? 'bg-brand-500' : 'bg-ink-700'}`}
            />
          )}
        </div>
      ))}
    </div>

    <div className="mt-7 rounded-lg border border-ink-700 bg-ink-850 p-4 text-left">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Week 4 &middot; Data fetching</p>
        <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[11px] font-medium text-brand-300">
          5h planned
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-300">
        Three resources, two exercises. Sized to the hours you said you had.
      </p>
    </div>
  </div>
)

const TreePreview = () => (
  <svg viewBox="0 0 360 200" className="h-[200px] w-full" role="img" aria-label="Skill tree branching from fundamentals into specialised topics">
    <g stroke="currentColor" className="text-ink-600" strokeWidth="1.5" fill="none">
      <path d="M60 100 L140 60" />
      <path d="M60 100 L140 140" />
      <path d="M140 60 L230 35" />
      <path d="M140 60 L230 85" />
      <path d="M140 140 L230 125" />
      <path d="M140 140 L230 170" />
      <path d="M230 85 L305 85" />
    </g>
    <g className="text-brand-500" stroke="currentColor" strokeWidth="1.5" fill="none">
      <path d="M60 100 L140 60" />
      <path d="M140 60 L230 35" />
    </g>

    <circle cx="60" cy="100" r="9" className="fill-brand-500" />
    <circle cx="140" cy="60" r="7" className="fill-brand-500" />
    <circle cx="230" cy="35" r="7" className="fill-brand-400" />
    <circle cx="140" cy="140" r="6" className="fill-ink-600" />
    <circle cx="230" cy="85" r="6" className="fill-ink-600" />
    <circle cx="230" cy="125" r="6" className="fill-ink-600" />
    <circle cx="230" cy="170" r="6" className="fill-ink-600" />
    <circle cx="305" cy="85" r="6" className="fill-ink-600" />

    <g className="fill-ink-300 text-[10px]" fontSize="10">
      <text x="60" y="128" textAnchor="middle" className="fill-white font-semibold">Basics</text>
      <text x="140" y="44" textAnchor="middle" className="fill-white">Components</text>
      <text x="252" y="39" className="fill-brand-300">Hooks</text>
      <text x="252" y="89">Context</text>
      <text x="140" y="166" textAnchor="middle">Tooling</text>
      <text x="252" y="129">Testing</text>
      <text x="252" y="174">Build</text>
    </g>
  </svg>
)

const MapPreview = () => (
  <svg viewBox="0 0 360 200" className="h-[200px] w-full" role="img" aria-label="Skill map showing related domains and how they connect">
    <g stroke="currentColor" className="text-ink-700" strokeWidth="1" fill="none">
      <path d="M95 65 L180 100 L265 60" />
      <path d="M95 140 L180 100 L270 140" />
      <path d="M95 65 L95 140" />
      <path d="M265 60 L270 140" />
    </g>

    <g>
      <circle cx="180" cy="100" r="30" className="fill-brand-500/15" />
      <circle cx="180" cy="100" r="30" className="fill-none stroke-brand-500" strokeWidth="1.5" />
      <text x="180" y="104" textAnchor="middle" className="fill-white text-[11px] font-semibold" fontSize="11">
        React
      </text>
    </g>

    {[
      { x: 95, y: 65, label: 'JS core' },
      { x: 265, y: 60, label: 'TypeScript' },
      { x: 95, y: 140, label: 'CSS' },
      { x: 270, y: 140, label: 'Next.js' },
    ].map(({ x, y, label }) => (
      <g key={label}>
        <circle cx={x} cy={y} r="22" className="fill-ink-800 stroke-ink-600" strokeWidth="1.5" />
        <text x={x} y={y + 4} textAnchor="middle" className="fill-ink-200" fontSize="9.5">
          {label}
        </text>
      </g>
    ))}
  </svg>
)

const HeroShowcase = () => {
  const [tab, setTab] = useState<TabKey>('timeline')

  return (
    <div className="w-full rounded-2xl border border-ink-700 bg-ink-900/80 p-5 shadow-2xl shadow-brand-700/10 backdrop-blur sm:p-6">
      <div
        role="tablist"
        aria-label="Roadmap views"
        className="mb-6 inline-flex rounded-lg border border-ink-700 bg-ink-850 p-1"
      >
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === key
                ? 'bg-brand-500 text-white'
                : 'text-ink-300 hover:text-white'
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-[240px]">
        {tab === 'timeline' && <TimelinePreview />}
        {tab === 'tree' && <TreePreview />}
        {tab === 'map' && <MapPreview />}
      </div>
    </div>
  )
}

export default HeroShowcase
