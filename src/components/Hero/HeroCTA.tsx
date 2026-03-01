'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const buttonClass =
  'group inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950'

const HeroCTA = () => {
  return (
    <div className="mt-9 flex flex-wrap items-center gap-4">
      <SignedOut>
        <Link href="/sign-in" className={buttonClass}>
          Build a roadmap
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </SignedOut>

      <SignedIn>
        <Link href="/dashboard" className={buttonClass}>
          Open your dashboard
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      </SignedIn>

      <Link
        href="/explore"
        className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-7 py-3.5 text-sm font-semibold text-ink-200 transition-colors hover:border-ink-500 hover:text-white"
      >
        Browse roadmaps
      </Link>
    </div>
  )
}

export default HeroCTA
