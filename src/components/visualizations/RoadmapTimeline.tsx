'use client'

import { Check } from 'lucide-react'

export type TimelineMilestone = {
  id: string
  title: string
  week_number: number
  estimated_hours: number
  completed: boolean
}

type RoadmapTimelineProps = {
  milestones: TimelineMilestone[]
  currentWeek?: number
  onSelectWeek?: (index: number) => void
}

/**
 * Horizontal week track. The connector between two nodes is filled only when
 * the earlier week is done, so the solid run shows how far you actually got
 * rather than how many boxes are ticked overall.
 */
const RoadmapTimeline = ({ milestones, currentWeek, onSelectWeek }: RoadmapTimelineProps) => {
  if (milestones.length === 0) return null

  const ordered = [...milestones].sort((a, b) => a.week_number - b.week_number)
  const totalHours = ordered.reduce((sum, m) => sum + (m.estimated_hours || 0), 0)
  const doneCount = ordered.filter((m) => m.completed).length

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h3 className="text-base font-semibold text-slate-900">Timeline</h3>
        <p className="text-sm text-slate-500">
          {doneCount} of {ordered.length} weeks done, about {totalHours}h total
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <ol className="flex min-w-max items-start">
          {ordered.map((milestone, index) => {
            const isCurrent = currentWeek === index
            const isLast = index === ordered.length - 1

            return (
              <li key={milestone.id} className="flex items-start">
                <div className="flex w-28 flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => onSelectWeek?.(index)}
                    disabled={!onSelectWeek}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Week ${milestone.week_number}: ${milestone.title}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                      milestone.completed
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : isCurrent
                        ? 'border-brand-500 bg-white text-brand-600'
                        : 'border-slate-300 bg-white text-slate-400'
                    } ${onSelectWeek ? 'cursor-pointer hover:border-brand-400' : ''}`}
                  >
                    {milestone.completed ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      milestone.week_number
                    )}
                  </button>

                  <p
                    className={`mt-2 line-clamp-2 px-1 text-xs leading-snug ${
                      isCurrent ? 'font-semibold text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {milestone.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{milestone.estimated_hours}h</p>
                </div>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={`mt-[18px] h-0.5 w-8 rounded ${
                      milestone.completed ? 'bg-brand-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export default RoadmapTimeline
