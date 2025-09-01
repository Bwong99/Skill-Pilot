'use client'

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Button from '../Button'

const HeroCTA = () => {
  const { user } = useUser()

  return (
    <div className="mt-10 flex items-center justify-center">
      {/* When user is signed out - show login button */}
      <SignedOut>
        <Link href="/sign-in">
          <Button
            type="button"
            title="Start Learning Now"
            variant="bg-indigo-600 text-white px-6 py-3 hover:bg-indigo-500 shadow-sm transition-colors"
          />
        </Link>
      </SignedOut>

      {/* When user is signed in - show dashboard button */}
      <SignedIn>
        <Link href="/dashboard">
          <Button
            type="button"
            title="Go to Dashboard"
            variant="bg-green-600 text-white px-6 py-3 hover:bg-green-500 shadow-sm transition-colors"
          />
        </Link>
      </SignedIn>
    </div>
  )
}

export default HeroCTA
