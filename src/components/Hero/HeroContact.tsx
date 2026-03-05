import Link from 'next/link'
import { Github, Mail } from 'lucide-react'

const HeroContact = () => {
  const links = [
    {
      Icon: Mail,
      label: 'Email',
      value: 'bwong999@student.ubc.ca',
      href: 'mailto:bwong999@student.ubc.ca',
      external: false,
    },
    {
      Icon: Github,
      label: 'GitHub',
      value: '@Bwong99',
      href: 'https://github.com/Bwong99',
      external: true,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Get in touch</h2>
      <p className="mt-4 text-base text-ink-300">
        Questions, bugs, or ideas for what to add next
      </p>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {links.map(({ Icon, label, value, href, external }) => (
          <Link
            key={label}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group rounded-xl border border-ink-700 bg-ink-900/60 p-6 text-left transition-colors hover:border-brand-500"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
              <Icon className="h-5 w-5 text-brand-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-sm font-medium text-ink-400">{label}</h3>
            <p className="mt-1 text-base font-semibold text-white group-hover:text-brand-300">
              {value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default HeroContact
