'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Logo from '../Logo'
import HeroHeading from './HeroHeading'
import HeroCTA from './HeroCTA'
import HeroShowcase from './HeroShowcase'
import HeroStats from './HeroStats'
import HeroFeatures from './HeroFeatures'
import HeroContact from './HeroContact'
import HeroBackground from './HeroBackground'

const SECTIONS = [
  { key: 'welcome', label: 'Home' },
  { key: 'about', label: 'How it works' },
  { key: 'contact', label: 'Contact' },
] as const

type SectionKey = (typeof SECTIONS)[number]['key']

const Hero = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>('welcome')

  return (
    <section className="relative min-h-screen overflow-hidden bg-ink-950">
      <HeroBackground />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-10">
        {/* Top bar */}
        <header className="flex items-center justify-between py-7">
          <Logo tone="light" />

          <nav className="hidden items-center gap-1 md:flex">
            {SECTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                aria-current={activeSection === key ? 'page' : undefined}
                className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  activeSection === key
                    ? 'bg-ink-800 text-white'
                    : 'text-ink-300 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <SignedOut>
              <Link
                href="/sign-in"
                className="inline-flex h-9 items-center rounded-md border border-ink-600 px-4 text-sm font-medium text-ink-100 transition-colors hover:border-ink-400 hover:text-white"
              >
                Sign in
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/welcome" appearance={{ elements: { avatarBox: 'h-9 w-9' } }} />
            </SignedIn>
          </div>
        </header>

        {/* Mobile section switcher */}
        <nav className="mb-4 flex gap-1 md:hidden">
          {SECTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                activeSection === key ? 'bg-ink-800 text-white' : 'text-ink-400'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex flex-1 items-center py-10">
          {activeSection === 'welcome' && (
            <div className="grid w-full items-center gap-14 lg:grid-cols-2 lg:gap-10">
              <div className="text-left">
                <HeroHeading />
                <HeroCTA />
              </div>
              <HeroShowcase />
            </div>
          )}

          {activeSection === 'about' && (
            <div className="w-full">
              <HeroFeatures />
              <HeroStats />
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="w-full">
              <HeroContact />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
