import React from 'react'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className="max-container padding-container flex flex-col gap-20 
    py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row border-2 border-red-500">
    <div className="hero-map"/>
         
    <div className="relative z-20 flex flex-1 flex-col xl:w-1/2">
    <Image
      src="/assets/icons/SkillPilotIcon.png"
      alt="Hero Image"
      width={50}
      height={50}
      className="absolute left-4 top-4 w-10 lg:w-[70px]"
    />

    <h1>Skill Pilot</h1>
    </div>
    </section>
  )
}

export default Hero