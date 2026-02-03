const HeroBadge = () => {
  return (
    <div className="mb-8 flex flex-col items-center">
      <h1 className="text-6xl font-extrabold text-indigo-600 mb-6 sm:text-7xl">
        SkillPilot
      </h1>

      <div className="rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10">
        Built with Next.js, Supabase and Gemini
      </div>
    </div>
  )
}

export default HeroBadge
