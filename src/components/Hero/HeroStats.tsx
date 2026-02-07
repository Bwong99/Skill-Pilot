const HeroStats = () => {
  const steps = [
    {
      step: "01",
      title: "Say what you want to learn",
      detail: "A skill, a rough deadline, and how many hours a week you can give it."
    },
    {
      step: "02",
      title: "Get the weeks laid out",
      detail: "Each one comes with reading, exercises and an estimate of the time it takes."
    },
    {
      step: "03",
      title: "Work through it",
      detail: "Tick milestones off as you go. Adjust the hours if life gets in the way."
    }
  ]

  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <p className="text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
          Most learning plans fall apart because they assume you have more time than you do.
          SkillPilot starts from your actual schedule and works backwards.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-3xl mx-auto text-left">
        {steps.map(({ step, title, detail }) => (
          <div key={step}>
            <div className="text-sm font-semibold text-indigo-600 mb-2">{step}</div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroStats
