'use client'

import { useRouter } from 'next/navigation'
import CreateSkillPathForm from '@/components/CreateSkillPathForm'
import { CalendarClock, ListChecks, Wand2 } from 'lucide-react'

export default function CreatePathPage() {
  const router = useRouter()

  const handleSuccess = (skillPathId: string) => {
    router.push(`/dashboard/paths/${skillPathId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What do you want to learn?
          </h1>
          <p className="text-lg text-gray-600">
            Give it a skill, a rough timeline and your weekly hours. You will get the weeks back broken down.
          </p>
        </div>

        {/* Form */}
        <CreateSkillPathForm onSuccess={handleSuccess} />

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50">
              <Wand2 className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drafted for you</h3>
            <p className="text-gray-600">
              Gemini writes the first version. Everything in it stays editable afterwards.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50">
              <CalendarClock className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sized to your week</h3>
            <p className="text-gray-600">
              Five hours a week and twenty hours a week produce very different plans.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50">
              <ListChecks className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress you can see</h3>
            <p className="text-gray-600">
              Completed weeks roll up into a percentage on your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
