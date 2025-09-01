'use client'

import { useRouter } from 'next/navigation'
import CreateSkillPathForm from '@/components/CreateSkillPathForm'

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
            Start Your Learning Journey
          </h1>
          <p className="text-lg text-gray-600">
            Tell us what you want to learn, and our AI will create a personalized roadmap just for you
          </p>
        </div>

        {/* Form */}
        <CreateSkillPathForm onSuccess={handleSuccess} />

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Our AI analyzes your goals and creates a customized learning path
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Time-Based</h3>
            <p className="text-gray-600">
              Set your timeline and get weekly milestones to keep you on track
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning progress and celebrate your achievements
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
