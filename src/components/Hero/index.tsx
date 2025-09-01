'use client'
import { useState } from 'react'
import HeroBadge from './HeroBadge'
import HeroHeading from './HeroHeading'
import HeroCTA from './HeroCTA'
import HeroStats from './HeroStats'
import HeroFeatures from './HeroFeatures'
import HeroContact from './HeroContact'
import HeroBackground from './HeroBackground'
import Button from '../Button'

const Hero = () => {
  const [activeSection, setActiveSection] = useState('welcome')

  const renderContent = () => {
    switch(activeSection) {
      case 'welcome':
        return (
          <>
            <HeroBadge />
            <HeroHeading />
            <HeroCTA />
          </>
        )
      case 'about':
        return (
          <>
            <HeroFeatures />
            <HeroStats />
          </>
        )
      case 'contact':
        return <HeroContact />
      default:
        return (
          <>
            <HeroBadge />
            <HeroHeading />
            <HeroCTA />
          </>
        )
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {renderContent()}
        </div>
        
        {/* Navigation Buttons - Bottom of Hero Section */}
        <div className="mt-20 flex justify-center gap-4">
          <Button
            type="button"
            title="Welcome"
            variant={`px-6 py-3 transition-colors ${
              activeSection === 'welcome' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveSection('welcome')}
          />
          <Button
            type="button"
            title="About"
            variant={`px-6 py-3 transition-colors ${
              activeSection === 'about' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveSection('about')}
          />
          <Button
            type="button"
            title="Contact"
            variant={`px-6 py-3 transition-colors ${
              activeSection === 'contact' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveSection('contact')}
          />
        </div>
      </div>
      <HeroBackground />
    </section>
  )
}

export default Hero
