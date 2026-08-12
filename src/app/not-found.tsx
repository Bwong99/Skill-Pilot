import Link from 'next/link'
import { buttonStyles } from '@/components/Button'

// Replaces Next's unstyled built-in 404, which rendered without the app's
// navbar or type and looked like a different site.
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        We could not find that page
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        The link may be out of date, or the roadmap may have been deleted.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard" className={buttonStyles()}>
          Go to dashboard
        </Link>
        <Link href="/explore" className={buttonStyles({ variant: 'secondary' })}>
          Explore roadmaps
        </Link>
      </div>
    </main>
  )
}
