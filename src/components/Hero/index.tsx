import HeroBadge from './HeroBadge'
import HeroHeading from './HeroHeading'
import HeroCTA from './HeroCTA'
import HeroStats from './HeroStats'
import HeroFeatures from './HeroFeatures'
import HeroBackground from './HeroBackground'

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <HeroBadge />
          <HeroHeading />
          <HeroCTA />
          <HeroFeatures />
          <HeroStats />
          
        </div>
      </div>
      <HeroBackground />
    </section>
  )
}

export default Hero
