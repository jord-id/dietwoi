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
      { name: 'Waist-Hip Ratio', path: '/waist-hip-ratio' },
      { name: 'Waist-Height Ratio', path: '/waist-height-ratio' },
      { name: 'Metabolic Age', path: '/metabolic-age' },
    ],
  },
  {
    title: 'ENERGY',
    items: [
      { name: 'BMR', path: '/bmr' },
      { name: 'TDEE', path: '/tdee' },
      { name: 'Calories', path: '/calories' },
      { name: 'Macros', path: '/macros' },
      { name: 'Calorie Deficit', path: '/calorie-deficit' },
      { name: 'Protein', path: '/protein' },
      { name: 'Meal Calories', path: '/meal-calories' },
    ],
  },
  {
    title: 'WELLNESS',
    items: [
      { name: 'Water Intake', path: '/water-intake' },
      { name: 'Sleep', path: '/sleep-calculator' },
      { name: 'Caffeine', path: '/caffeine' },
      { name: 'Sodium', path: '/sodium' },
      { name: 'Alcohol', path: '/alcohol' },
    ],
  },
  {
    title: 'FITNESS',
    items: [
      { name: 'One Rep Max', path: '/one-rep-max' },
      { name: 'Calories Burned', path: '/calories-burned' },
      { name: 'Max Heart Rate', path: '/max-heart-rate' },
      { name: 'Heart Rate Zones', path: '/heart-rate-zones' },
      { name: 'VO2 Max', path: '/vo2-max' },
      { name: 'Pace Calculator', path: '/pace-calculator' },
    ],
  },
  {
    title: 'HEALTH',
    items: [
      { name: 'Blood Pressure', path: '/blood-pressure' },
      { name: 'Cholesterol', path: '/cholesterol' },
      { name: 'Diabetes Risk', path: '/diabetes-risk' },
      { name: 'Pregnancy Weight', path: '/pregnancy-weight' },
      { name: 'Child Growth', path: '/child-growth' },
    ],
  },
]
