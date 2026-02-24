type LogoProps = {
  /** 'light' for dark backgrounds, 'dark' for light backgrounds */
  tone?: 'light' | 'dark'
  className?: string
  showWordmark?: boolean
}

/**
 * Three ascending nodes joined by a path. Doubles as the visual shorthand
 * for the roadmap views (timeline, tree, map) used throughout the app.
 */
const LogoMark = ({ className = 'h-7 w-7' }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M5 24.5 L14 15.5 L20 21 L27.5 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-500"
      opacity="0.55"
    />
    <circle cx="5" cy="24.5" r="2.75" className="fill-brand-500" />
    <circle cx="14" cy="15.5" r="2.75" className="fill-brand-400" />
    <circle cx="27.5" cy="8" r="3.25" className="fill-brand-300" />
  </svg>
)

const Logo = ({ tone = 'dark', className = '', showWordmark = true }: LogoProps) => {
  const light = tone === 'light'

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      {showWordmark && (
        <span className="text-[1.375rem] leading-none tracking-tight">
          <span className={light ? 'font-light text-ink-300' : 'font-light text-ink-400'}>skill</span>
          <span className={light ? 'font-bold text-white' : 'font-bold text-ink-900'}>pilot</span>
        </span>
      )}
    </span>
  )
}

export { LogoMark }
export default Logo
