'use client'

import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import { buttonStyles } from '../Button'

const HeroCTA = () => {
  return (
    <div className="mt-9 flex flex-wrap items-center gap-3">
      <SignedOut>
        <Link href="/sign-in" className={buttonStyles()}>
          Build a roadmap
        </Link>
      </SignedOut>

      <SignedIn>
        <Link href="/dashboard" className={buttonStyles()}>
          Open your dashboard
        </Link>
      </SignedIn>

      <Link href="/explore" className={buttonStyles({ variant: 'outlineDark' })}>
        Browse roadmaps
      </Link>
    </div>
  )
}

export default HeroCTA
