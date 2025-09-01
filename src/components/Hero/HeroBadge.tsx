import Link from 'next/link'

const HeroBadge = () => {
  return (
    <div className="mb-8 flex flex-col items-center">
      {/* SkillPilot Brand Title - Made Larger */}
      <h1 className="text-6xl font-extrabold text-indigo-600 mb-6 sm:text-7xl">
        SkillPilot
      </h1>
      
      {/* AI-Powered Badge */}
      <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
        🚀 AI-Powered Learning Platform{' '}
        <Link href="#" className="font-semibold text-indigo-600">
          <span className="absolute inset-0" aria-hidden="true" />
          Learn more <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  )
}

export default HeroBadge
