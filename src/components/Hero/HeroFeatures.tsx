const HeroFeatures = () => {
  const features = [
    {
      icon: "🎯",
      title: "Personalized Learning Paths",
      description: "AI creates custom roadmaps tailored to your goals, skill level, and learning style."
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Visual progress indicators and milestone tracking to keep you motivated."
    },
    {
      icon: "🤖",
      title: "AI-Powered Guidance",
      description: "Smart recommendations and adaptive learning based on your performance."
    },
    {
      icon: "⚙️",
      title: "User Customization",
      description: "Tailor your learning experience with customizable features and settings."
    }
  ]

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Latest Features
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Skill building tools
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed text-center max-w-xs">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroFeatures