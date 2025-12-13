export interface NavItem {
  name: string
  path: string
}

export interface FooterCategory {
  title: string
  items: NavItem[]
}

export const headerNav: NavItem[] = [
  { name: 'Home', path: '/' },
]

export const footerCategories: FooterCategory[] = [
  {
    title: 'BODY',
    items: [
      { name: 'BMI', path: '/bmi' },
      { name: 'Body Fat', path: '/body-fat' },
      { name: 'Ideal Weight', path: '/ideal-weight' },
      { name: 'Lean Body Mass', path: '/lean-body-mass' },
    ],
  },
  {
    title: 'ENERGY',
    items: [
      { name: 'BMR', path: '/bmr' },
      { name: 'TDEE', path: '/tdee' },
      { name: 'Calories', path: '/calories' },
      { name: 'Macros', path: '/macros' },
    ],
  },
  {
    title: 'WELLNESS',
    items: [
      { name: 'Water Intake', path: '/water-intake' },
    ],
  },
  {
    title: 'STRENGTH',
    items: [
      { name: 'One Rep Max', path: '/one-rep-max' },
    ],
  },
]
