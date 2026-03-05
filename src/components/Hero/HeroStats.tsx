const HeroStats = () => {
  const steps = [
    {
      step: "01",
      title: "Say what you want to learn",
      detail: "A skill, a rough deadline, and how many hours a week you can give it.",
    },
    {
      step: "02",
      title: "Get the weeks laid out",
      detail: "Each one comes with reading, exercises and an estimate of the time it takes.",
    },
    {
      step: "03",
      title: "Work through it",
      detail: "Tick milestones off as you go. Adjust the hours if life gets in the way.",
    },
  ]

  return (
    <div className="mx-auto mt-20 max-w-4xl">
      <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-ink-300">
        Most learning plans fall apart because they assume you have more time than you do.
        SkillPilot starts from your actual schedule and works backwards.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-10 text-left sm:grid-cols-3">
        {steps.map(({ step, title, detail }) => (
          <div key={step} className="border-t border-ink-700 pt-5">
            <div className="mb-2 text-sm font-semibold text-brand-400">{step}</div>
            <h3 className="mb-1.5 text-base font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-ink-300">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroStats
