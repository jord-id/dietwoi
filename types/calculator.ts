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

// Consolidated color styles - single source of truth for all components
export interface ColorStyle {
  // Backgrounds
  bg50: string
  bg400: string
  bg500: string
  // Text
  text500: string
  text600: string
  // Borders
  border300: string
  border400: string
  border500: string
  // Gradient
  gradient: string
}

export const colorStyles: Record<CalculatorColor, ColorStyle> = {
  purple: {
    bg50: 'bg-purple-50',
    bg400: 'bg-purple-400',
    bg500: 'bg-purple-500',
    text500: 'text-purple-500',
    text600: 'text-purple-600',
    border300: 'border-purple-300',
    border400: 'border-purple-400',
    border500: 'border-purple-500',
    gradient: 'from-purple-500 to-violet-500',
  },
  orange: {
    bg50: 'bg-orange-50',
    bg400: 'bg-orange-400',
    bg500: 'bg-orange-500',
    text500: 'text-orange-500',
    text600: 'text-orange-600',
    border300: 'border-orange-300',
    border400: 'border-orange-400',
    border500: 'border-orange-500',
    gradient: 'from-orange-500 to-amber-500',
  },
  blue: {
    bg50: 'bg-blue-50',
    bg400: 'bg-blue-400',
    bg500: 'bg-blue-500',
    text500: 'text-blue-500',
    text600: 'text-blue-600',
    border300: 'border-blue-300',
    border400: 'border-blue-400',
    border500: 'border-blue-500',
    gradient: 'from-blue-500 to-indigo-500',
  },
  teal: {
    bg50: 'bg-teal-50',
    bg400: 'bg-teal-400',
    bg500: 'bg-teal-500',
    text500: 'text-teal-500',
    text600: 'text-teal-600',
    border300: 'border-teal-300',
    border400: 'border-teal-400',
    border500: 'border-teal-500',
    gradient: 'from-teal-500 to-cyan-500',
  },
  pink: {
    bg50: 'bg-pink-50',
    bg400: 'bg-pink-400',
    bg500: 'bg-pink-500',
    text500: 'text-pink-500',
    text600: 'text-pink-600',
    border300: 'border-pink-300',
    border400: 'border-pink-400',
    border500: 'border-pink-500',
    gradient: 'from-pink-500 to-rose-500',
  },
  red: {
    bg50: 'bg-red-50',
    bg400: 'bg-red-400',
    bg500: 'bg-red-500',
    text500: 'text-red-500',
    text600: 'text-red-600',
    border300: 'border-red-300',
    border400: 'border-red-400',
    border500: 'border-red-500',
    gradient: 'from-red-500 to-rose-500',
  },
  green: {
    bg50: 'bg-green-50',
    bg400: 'bg-green-400',
    bg500: 'bg-green-500',
    text500: 'text-green-500',
    text600: 'text-green-600',
    border300: 'border-green-300',
    border400: 'border-green-400',
    border500: 'border-green-500',
    gradient: 'from-green-500 to-emerald-500',
  },
  cyan: {
    bg50: 'bg-cyan-50',
    bg400: 'bg-cyan-400',
    bg500: 'bg-cyan-500',
    text500: 'text-cyan-500',
    text600: 'text-cyan-600',
    border300: 'border-cyan-300',
    border400: 'border-cyan-400',
    border500: 'border-cyan-500',
    gradient: 'from-cyan-500 to-sky-500',
  },
  amber: {
    bg50: 'bg-amber-50',
    bg400: 'bg-amber-400',
    bg500: 'bg-amber-500',
    text500: 'text-amber-500',
    text600: 'text-amber-600',
    border300: 'border-amber-300',
    border400: 'border-amber-400',
    border500: 'border-amber-500',
    gradient: 'from-amber-500 to-yellow-500',
  },
}

// Helper to get color styles with fallback
export const getColorStyles = (color: CalculatorColor): ColorStyle => {
  return colorStyles[color] || colorStyles.orange
}
