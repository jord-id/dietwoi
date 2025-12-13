export interface NavItem {
  name: string
  path: string
  isNew?: boolean
}

export interface FooterSection {
  title: string
  items: NavItem[]
}

export const headerNav: NavItem[] = [
  { name: 'Home', path: '/' },
]

export const footerNav: FooterSection[] = [
  {
    title: 'Calculators',
    items: [
      { name: 'BMI Calculator', path: '/bmi' },
      { name: 'BMR Calculator', path: '/bmr' },
      { name: 'TDEE Calculator', path: '/tdee' },
      { name: 'Body Fat Calculator', path: '/body-fat' },
      { name: 'Ideal Weight Calculator', path: '/ideal-weight', isNew: true },
      { name: 'Macro Calculator', path: '/macros' },
      { name: 'Calorie Calculator', path: '/calories', isNew: true },
      { name: 'One Rep Max Calculator', path: '/one-rep-max', isNew: true },
      { name: 'Water Intake Calculator', path: '/water-intake', isNew: true },
    ],
  },
  {
    title: 'Coming Soon',
    items: [
      { name: 'Protein Calculator', path: '#' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  },
]
