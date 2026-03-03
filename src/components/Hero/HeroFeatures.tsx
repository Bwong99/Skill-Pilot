import { GitBranch, Map, Route } from 'lucide-react'

const HeroFeatures = () => {
  const views = [
    {
      Icon: Route,
      title: "Timeline",
      description:
        "Every week on one track, with the hours it should take. The solid run shows how far you actually got.",
    },
    {
      Icon: GitBranch,
      title: "Skill tree",
      description:
        "Where each week branches off the last, so you can see what has to come before what.",
    },
    {
      Icon: Map,
      title: "Skill map",
      description:
        "The surrounding topics and how they connect, so you know what a skill sits next to.",
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Three ways to look at the same plan
        </h2>
        <p className="mt-4 text-base text-ink-300">
          A list of weeks tells you what is next. These tell you where you are.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {views.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-ink-700 bg-ink-900/60 p-6 text-left transition-colors hover:border-ink-600"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
              <Icon className="h-5 w-5 text-brand-400" strokeWidth={1.75} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-ink-300">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroFeatures
