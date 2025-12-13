export type CalculatorColor = 'purple' | 'orange' | 'blue' | 'teal' | 'pink' | 'red' | 'green' | 'cyan' | 'amber'

export interface CalculatorInput {
  key: string
  label: string
  type: 'slider' | 'gender' | 'activity'
  min?: number
  max?: number
  step?: number
  default: number | string
  unit?: string
}

export interface CalculatorMeta {
  title: string
  description: string
  shortDescription: string
  path: string
  color: CalculatorColor
  contentPath: string
}

export interface CalculatorSeo {
  title: string
  description: string
  path: string
}

export interface CalculatorSchema {
  name: string
  description: string
  url: string
  applicationCategory: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface CalculatorConfig {
  meta: CalculatorMeta
  seo: CalculatorSeo
  schema: CalculatorSchema
  breadcrumbs: BreadcrumbItem[]
  inputs: CalculatorInput[]
}

// Color mappings for gradient backgrounds
export const colorGradients: Record<CalculatorColor, string> = {
  purple: 'from-purple-50 via-violet-50 to-fuchsia-50',
  orange: 'from-orange-50 via-amber-50 to-yellow-50',
  blue: 'from-blue-50 via-indigo-50 to-violet-50',
  teal: 'from-teal-50 via-cyan-50 to-emerald-50',
  pink: 'from-pink-50 via-rose-50 to-fuchsia-50',
  red: 'from-red-50 via-rose-50 to-pink-50',
  green: 'from-green-50 via-emerald-50 to-teal-50',
  cyan: 'from-cyan-50 via-sky-50 to-blue-50',
  amber: 'from-amber-50 via-yellow-50 to-orange-50',
}

export const colorAccents: Record<CalculatorColor, { gradient: string; text: string; bg: string }> = {
  purple: {
    gradient: 'from-purple-500 to-violet-500',
    text: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  orange: {
    gradient: 'from-orange-500 to-amber-500',
    text: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  blue: {
    gradient: 'from-blue-500 to-indigo-500',
    text: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  teal: {
    gradient: 'from-teal-500 to-cyan-500',
    text: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  pink: {
    gradient: 'from-pink-500 to-rose-500',
    text: 'text-pink-600',
    bg: 'bg-pink-50',
  },
  red: {
    gradient: 'from-red-500 to-rose-500',
    text: 'text-red-600',
    bg: 'bg-red-50',
  },
  green: {
    gradient: 'from-green-500 to-emerald-500',
    text: 'text-green-600',
    bg: 'bg-green-50',
  },
  cyan: {
    gradient: 'from-cyan-500 to-sky-500',
    text: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  amber: {
    gradient: 'from-amber-500 to-yellow-500',
    text: 'text-amber-600',
    bg: 'bg-amber-50',
  },
}
