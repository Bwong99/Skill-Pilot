import {
  BookMarked,
  BookOpen,
  Code2,
  FileText,
  GraduationCap,
  Hammer,
  PlayCircle,
  Repeat,
  Terminal,
  type LucideIcon,
} from 'lucide-react'

const RESOURCE_ICONS: Record<string, LucideIcon> = {
  video: PlayCircle,
  article: FileText,
  book: BookMarked,
  practice: Terminal,
  project: Hammer,
  documentation: BookOpen,
  course: GraduationCap,
  tutorial: Code2,
}

const EXERCISE_ICONS: Record<string, LucideIcon> = {
  coding: Terminal,
  practice: Repeat,
  project: Hammer,
  reading: BookOpen,
}

type IconProps = {
  type?: string
  className?: string
}

export const ResourceIcon = ({ type, className = 'h-5 w-5' }: IconProps) => {
  const Icon = RESOURCE_ICONS[type ?? ''] ?? FileText
  return <Icon className={className} strokeWidth={1.75} />
}

export const ExerciseIcon = ({ type, className = 'h-4 w-4' }: IconProps) => {
  const Icon = EXERCISE_ICONS[type ?? ''] ?? Repeat
  return <Icon className={className} strokeWidth={1.75} />
}
