'use client'

import { useState } from 'react'

type Milestone = {
  id: string
  title: string
  description: string
  week_number: number
  estimated_hours: number
  completed: boolean
  resources: Array<{
    type: string
    title: string
    description?: string
    url?: string
    duration?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    platform?: string
    section?: string
    chapter?: string
  }>
  exercises?: Array<{
    title: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    estimated_time: string
    type: 'coding' | 'reading' | 'practice' | 'project'
  }>
}

type SkillTreeViewProps = {
  milestones: Milestone[]
  onToggleComplete: (milestoneId: string, completed: boolean) => void
  onClose: () => void
}

export default function SkillTreeView({ milestones, onToggleComplete, onClose }: SkillTreeViewProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)

  // Group milestones by phases (every 4 weeks is a phase)
  const phases = milestones.reduce((acc, milestone) => {
    const phaseIndex = Math.floor((milestone.week_number - 1) / 4)
    if (!acc[phaseIndex]) acc[phaseIndex] = []
    acc[phaseIndex].push(milestone)
    return acc
  }, {} as Record<number, Milestone[]>)

  const getPhaseTitle = (phaseIndex: number) => {
    const phaseNames = ['Foundation', 'Intermediate', 'Advanced', 'Expert', 'Mastery']
    return phaseNames[phaseIndex] || `Phase ${phaseIndex + 1}`
  }

  const getNodeColor = (milestone: Milestone) => {
    if (milestone.completed) return 'bg-emerald-500 border-emerald-600'
    const currentWeek = Math.max(1, Math.min(...milestones.filter(m => !m.completed).map(m => m.week_number)))
    if (milestone.week_number === currentWeek) return 'bg-blue-500 border-blue-600'
    if (milestone.week_number < currentWeek) return 'bg-gray-300 border-gray-400'
    return 'bg-gray-100 border-gray-300'
  }

  const getConnectorColor = (fromMilestone: Milestone, toMilestone: Milestone) => {
    if (fromMilestone.completed && toMilestone.completed) return 'bg-emerald-400'
    if (fromMilestone.completed) return 'bg-gradient-to-r from-emerald-400 to-gray-300'
    return 'bg-gray-300'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Learning Skill Tree</h2>
            <p className="text-indigo-100 mt-1">Visual progression through your learning journey</p>
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

        <div className="flex-1 overflow-auto flex">
          {/* Skill Tree */}
          <div className="flex-1 p-6">
            <div className="space-y-8">
              {Object.entries(phases).map(([phaseIndexStr, phaseMilestones], index) => {
                const phaseIndex = parseInt(phaseIndexStr)
                return (
                  <div key={phaseIndex} className="relative">
                    {/* Phase Title */}
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-lg">
                        <span className="mr-2">
                          {phaseIndex === 0 && '🌱'}
                          {phaseIndex === 1 && '🌿'}
                          {phaseIndex === 2 && '🌳'}
                          {phaseIndex === 3 && '🏆'}
                          {phaseIndex >= 4 && '⭐'}
                        </span>
                        {getPhaseTitle(phaseIndex)}
                      </div>
                    </div>

                    {/* Milestone Nodes */}
                    <div className="flex justify-center items-center space-x-8 relative">
                      {phaseMilestones.map((milestone, milestoneIndex) => (
                        <div key={milestone.id} className="relative flex flex-col items-center">
                          {/* Connection Lines */}
                          {milestoneIndex < phaseMilestones.length - 1 && (
                            <div className="absolute top-1/2 left-full w-8 h-1 transform -translate-y-1/2 z-0">
                              <div className={`w-full h-full rounded-full ${getConnectorColor(milestone, phaseMilestones[milestoneIndex + 1])}`} />
                            </div>
                          )}
                          
                          {/* Milestone Node */}
                          <button
                            onClick={() => setSelectedMilestone(milestone)}
                            className={`relative z-10 w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${getNodeColor(milestone)}`}
                          >
                            <span className="text-2xl font-bold text-white">
                              {milestone.week_number}
                            </span>
                            {milestone.completed && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                                ✓
                              </div>
                            )}
                          </button>
                          
                          {/* Milestone Title */}
                          <div className="mt-3 text-center max-w-24">
                            <p className="text-xs font-medium text-gray-700 line-clamp-2">
                              {milestone.title.split(':')[1]?.trim() || milestone.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {milestone.estimated_hours}h
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Vertical Connector to Next Phase */}
                    {index < Object.keys(phases).length - 1 && (
                      <div className="flex justify-center mt-6">
                        <div className="w-1 h-8 bg-gray-300 rounded-full" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Legend</h3>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-emerald-600"></div>
                  <span className="text-gray-700">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-600"></div>
                  <span className="text-gray-700">Current</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 rounded-full border-2 border-gray-300"></div>
                  <span className="text-gray-700">Upcoming</span>
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Details Sidebar */}
          {selectedMilestone && (
            <div className="w-96 border-l border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Week {selectedMilestone.week_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedMilestone.estimated_hours} hours estimated
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleComplete(selectedMilestone.id, selectedMilestone.completed)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedMilestone.completed
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {selectedMilestone.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">
                  {selectedMilestone.title}
                </h4>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {selectedMilestone.description}
                </p>

                {/* Resources */}
                {selectedMilestone.resources && selectedMilestone.resources.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                      📚 Resources ({selectedMilestone.resources.length})
                    </h5>
                    <div className="space-y-2">
                      {selectedMilestone.resources.slice(0, 3).map((resource, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{resource.type}</p>
                          {resource.duration && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-2 inline-block">
                              {resource.duration}
                            </span>
                          )}
                        </div>
                      ))}
                      {selectedMilestone.resources.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{selectedMilestone.resources.length - 3} more resources
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Exercises */}
                {selectedMilestone.exercises && selectedMilestone.exercises.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                      💪 Exercises ({selectedMilestone.exercises.length})
                    </h5>
                    <div className="space-y-2">
                      {selectedMilestone.exercises.slice(0, 2).map((exercise, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{exercise.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              exercise.difficulty === 'easy' 
                                ? 'bg-green-100 text-green-700'
                                : exercise.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {exercise.difficulty}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {exercise.estimated_time}
                            </span>
                          </div>
                        </div>
                      ))}
                      {selectedMilestone.exercises.length > 2 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{selectedMilestone.exercises.length - 2} more exercises
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
