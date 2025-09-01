import Link from 'next/link'

const HeroBadge = () => {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
        🚀 AI-Powered Learning Platform{' '}
        <Link href="#" className="font-semibold text-indigo-600">
          <span className="absolute inset-0" aria-hidden="true" />
          Learn more <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  )
}

export default HeroBadge
