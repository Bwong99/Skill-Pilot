import Link from 'next/link'
import { Compass } from 'lucide-react'
import { buttonStyles } from '@/components/Button'

// Shown when the Supabase environment variables are absent, which is the
// deliberate state while the database is not yet locked down. Without this the
// pages that read from Supabase sit on their loading spinner forever, because
// the query never resolves and `loading` never flips back to false.
export default function ComingSoon({
  title = 'Roadmaps are coming soon',
  message = 'We are putting the finishing touches on this part of SkillPilot. Check back shortly.',
}: {
  title?: string
  message?: string
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
          <Compass className="h-6 w-6 text-brand-600" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/welcome" className={buttonStyles()}>
            Back to home
          </Link>
          <Link href="/profile" className={buttonStyles({ variant: 'secondary' })}>
            Profile settings
          </Link>
        </div>
      </div>
    </div>
  )
}
