'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { KeyRound, Menu } from 'lucide-react'
import Logo from "./Logo"

const NAV_LINKS = [
  { href: '/welcome', key: 'welcome', label: 'Home' },
  { href: '/explore', key: 'explore', label: 'Explore' },
  { href: '/dashboard', key: 'dashboard', label: 'Dashboard' },
]

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/welcome" aria-label="SkillPilot home">
          <Logo tone="dark" />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <li key={link.key}>
                <Link
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <SignedOut>
            <Link
              href="/sign-in"
              className="inline-flex h-9 items-center rounded-md bg-brand-500 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Sign in
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{ elements: { avatarBox: 'h-9 w-9' } }}
              afterSignOutUrl="/welcome"
            >
              {/* Roadmap generation needs the user's own Gemini key, so the
                  settings page has to be reachable from every screen. */}
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Profile settings"
                  labelIcon={<KeyRound className="h-4 w-4" strokeWidth={1.75} />}
                  href="/profile"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>

        <button type="button" aria-label="Open menu" className="lg:hidden">
          <Menu className="h-6 w-6 text-slate-700" strokeWidth={1.75} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
