import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outlineDark'
type Size = 'sm' | 'md'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  // For the navy hero, where a white border would be too loud
  outlineDark:
    'border border-ink-600 text-ink-100 hover:border-ink-400 hover:text-white focus-visible:ring-offset-ink-950',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
}

export const buttonStyles = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  className?: string
} = {}) => cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button type={type} className={buttonStyles({ variant, size, fullWidth, className })} {...props} />
)

export default Button
