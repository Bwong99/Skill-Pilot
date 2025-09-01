const HeroStats = () => {
  return (
    <div className="mt-16 flex justify-center">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600">10K+</div>
          <div className="text-sm text-gray-600">Active Learners</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600">500+</div>
          <div className="text-sm text-gray-600">Learning Paths</div>
        </div>
      </div>
    </div>
  )
}

export default HeroStats
