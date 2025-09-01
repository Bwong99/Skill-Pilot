const HeroStats = () => {
  return (
    <div className="mt-16">
      {/* Description above stats */}
      <div className="text-center mb-12">
        <p className="text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
          Skill Pilot creates personalized learning roadmaps powered by AI. 
          Get step-by-step guidance, track your progress, and learn new skills starting today!
        </p>
      </div>
      
      {/* Stats */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">10+</div>
            <div className="text-sm text-gray-600">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">20+</div>
            <div className="text-sm text-gray-600">Learning Paths</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroStats
