import { CalendarClock, ListChecks, RefreshCw, SlidersHorizontal } from 'lucide-react'

const HeroFeatures = () => {
  const features = [
    {
      Icon: CalendarClock,
      title: "Built around your week",
      description: "Tell it how many hours you actually have. The roadmap is sized to that, not to an ideal schedule."
    },
    {
      Icon: ListChecks,
      title: "Weekly milestones",
      description: "Each week gets its own resources, exercises and an hour estimate, so you always know what's next."
    },
    {
      Icon: RefreshCw,
      title: "Change it later",
      description: "Editing your hours regenerates the remaining weeks. Nothing is locked in once it's created."
    },
    {
      Icon: SlidersHorizontal,
      title: "Yours to adjust",
      description: "Rename milestones, drop the ones you've already covered, and mark off what you finish."
    }
  ]

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          What it does
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Four things that make a plan worth sticking to
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ Icon, title, description }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50">
              <Icon className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed text-center max-w-xs">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroFeatures
