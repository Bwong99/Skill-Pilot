'use client'

import { BookOpen, Clock, Dumbbell } from 'lucide-react'

type MilestoneExplanationProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MilestoneExplanation({ isOpen, onClose }: MilestoneExplanationProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-brand-500 text-white">
          <div>
            <h2 className="text-2xl font-bold">What are Milestones?</h2>
            <p className="text-brand-50 mt-1">How your roadmap is put together</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="bg-slate-50 rounded-lg p-5 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              What a milestone is
            </h3>
            <p className="text-blue-800 leading-relaxed">
One milestone is one week of work. It holds the things you read or watch that week, a few exercises to try, and an estimate of how long it should take.
            </p>
          </div>

          {/* Structure */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What is inside one</h3>
            <div className="grid gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 shrink-0 text-brand-500" strokeWidth={1.75} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Learning Resources</h4>
                    <p className="text-sm text-gray-600 mt-1">
Videos, articles, docs and courses picked for your level and the time you have.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Videos</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Articles</span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">Tutorials</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Documentation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Dumbbell className="h-5 w-5 shrink-0 text-brand-500" strokeWidth={1.75} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Practice Exercises</h4>
                    <p className="text-sm text-gray-600 mt-1">
Something to build or solve, so the week does not end up being all reading.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Easy</span>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Medium</span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Hard</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 shrink-0 text-brand-500" strokeWidth={1.75} />
                  <div>
                    <h4 className="font-semibold text-gray-900">Hour estimates</h4>
                    <p className="text-sm text-gray-600 mt-1">
Every week is sized to the hours you said you had, so you can tell in advance if it fits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How they fit together</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Sequential Learning</h4>
                  <p className="text-sm text-gray-600">
                    Complete milestones in order. Each builds upon previous knowledge and skills.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Track Progress</h4>
                  <p className="text-sm text-gray-600">
                    Mark milestones complete as you finish them. Visual progress tracking keeps you motivated.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Flexible Pacing</h4>
                  <p className="text-sm text-gray-600">
                    While designed for weekly completion, go at your own pace. Quality learning matters more than speed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
              Why it is split up this way
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0"></span>
                <span>A week is small enough to actually start on a Monday</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0"></span>
                <span>Ticking one off gives you a real sense of where you are</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0"></span>
                <span>Big skills stop looking like one impossible block</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0"></span>
                <span>You skip the hour normally spent deciding what to read</span>
              </li>
            </ul>
          </div>

          {/* Visual Guide */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">The skill tree</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 mb-3">
                Click the "View Skill Tree" button to see your learning path as an interactive visual tree:
              </p>
              <div className="flex items-center justify-center space-x-4 py-4">
                <div className="w-12 h-12 bg-gray-200 border-4 border-gray-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                  1
                </div>
                <div className="w-8 h-1 bg-gray-300 rounded"></div>
                <div className="w-12 h-12 bg-blue-500 border-4 border-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  2
                </div>
                <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-gray-300 rounded"></div>
                <div className="w-12 h-12 bg-gray-100 border-4 border-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-400">
                  3
                </div>
              </div>
              <div className="flex justify-center space-x-12 text-xs text-gray-600">
                <span>Completed</span>
                <span>Current</span>
                <span>Upcoming</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
That is the whole idea. Pick a week and get started.
            </p>
            <button
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-md bg-brand-500 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Got it, let's learn!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
