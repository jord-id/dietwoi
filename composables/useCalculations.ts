// Health calculation composables with proper formulas and types

// Input validation error
export class CalculationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CalculationError'
  }
}

// Validation helpers
const validatePositive = (value: number, field: string): void => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new CalculationError(`${field} must be a valid number`)
  }
  if (value <= 0) {
    throw new CalculationError(`${field} must be greater than 0`)
  }
}

const validateRange = (value: number, min: number, max: number, field: string): void => {
  validatePositive(value, field)
  if (value < min || value > max) {
    throw new CalculationError(`${field} must be between ${min} and ${max}`)
  }
}

const validateGender = (gender: string): void => {
  if (gender !== 'male' && gender !== 'female') {
    throw new CalculationError('Gender must be "male" or "female"')
  }
}

export interface BmiInput {
  weight: number // kg
  height: number // cm
}

export interface BmiResult {
  bmi: number
  category: 'underweight' | 'normal' | 'overweight' | 'obese'
  healthyRange: { min: number; max: number }
}

export interface BmrInput {
  weight: number // kg
  height: number // cm
  age: number // years
  gender: 'male' | 'female'
}

export interface BmrResult {
  bmr: number // kcal/day
  tdee: Record<ActivityLevel, number>
}

export interface TdeeInput extends BmrInput {
  activityLevel: ActivityLevel
}

export interface TdeeResult {
  bmr: number
  tdee: number
  activityLevel: ActivityLevel
  macros: MacroSplit
}

export interface BodyFatInput {
  weight: number // kg
  height: number // cm
  age: number // years
  gender: 'male' | 'female'
}

export interface BodyFatResult {
  percentage: number
  category: string
  fatMass: number // kg
  leanMass: number // kg
}

export interface MacroSplit {
  protein: { grams: number; calories: number; percentage: number }
  carbs: { grams: number; calories: number; percentage: number }
  fat: { grams: number; calories: number; percentage: number }
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'

export interface OneRepMaxInput {
  weight: number // kg lifted
  reps: number // 1-15 reps performed
}

export interface OneRepMaxResult {
  epley: number
  brzycki: number
  lombardi: number
  oconner: number
  average: number
  percentages: Array<{ reps: number; weight: number; percentage: number }>
}

export type ClimateLevel = 'normal' | 'hot'

export interface WaterIntakeInput {
  weight: number // kg
  activityLevel: ActivityLevel
  climate: ClimateLevel
  highProtein: boolean
  pregnant: boolean
  breastfeeding: boolean
}

export interface WaterIntakeResult {
  baseline: number // ml
  adjustments: {
    exercise: number
    climate: number
    highProtein: number
    pregnancy: number
    breastfeeding: number
  }
  total: number // ml
  glasses: number // 250ml glasses
  liters: number
  recommendation: string
}

// Activity multipliers (Harris-Benedict)
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // Little or no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Hard exercise 6-7 days/week
  athlete: 1.9, // Very hard exercise, physical job
}

// BMI ranges
const BMI_RANGES = {
  underweight: { max: 18.5, label: 'Underweight' },
  normal: { min: 18.5, max: 24.9, label: 'Normal' },
  overweight: { min: 25, max: 29.9, label: 'Overweight' },
  obese: { min: 30, label: 'Obese' },
}

// Body fat ranges by gender
const BODY_FAT_RANGES = {
  male: [
    { max: 6, label: 'Essential Fat', category: 'essential' },
    { max: 14, label: 'Athletes', category: 'athletes' },
    { max: 18, label: 'Fitness', category: 'fitness' },
    { max: 25, label: 'Average', category: 'average' },
    { max: 100, label: 'Obese', category: 'obese' },
  ],
  female: [
    { max: 14, label: 'Essential Fat', category: 'essential' },
    { max: 21, label: 'Athletes', category: 'athletes' },
    { max: 25, label: 'Fitness', category: 'fitness' },
    { max: 32, label: 'Average', category: 'average' },
    { max: 100, label: 'Obese', category: 'obese' },
  ],
}

/**
 * Calculate Body Mass Index
 * Formula: weight (kg) / height (m)²
 */
export function useBmi() {
  const calculate = (input: BmiInput): BmiResult => {
    // Validate inputs
    validateRange(input.weight, 20, 500, 'Weight')
    validateRange(input.height, 50, 300, 'Height')

    const heightM = input.height / 100
    const bmi = input.weight / (heightM * heightM)

    let category: BmiResult['category'] = 'obese'
    if (bmi < BMI_RANGES.underweight.max) category = 'underweight'
    else if (bmi < BMI_RANGES.normal.max!) category = 'normal'
    else if (bmi < BMI_RANGES.overweight.max!) category = 'overweight'

    // Calculate healthy weight range for this height
    const minWeight = 18.5 * heightM * heightM
    const maxWeight = 24.9 * heightM * heightM

    return {
      bmi: Math.round(bmi * 10) / 10,
      category,
      healthyRange: {
        min: Math.round(minWeight * 10) / 10,
        max: Math.round(maxWeight * 10) / 10,
      },
    }
  }

  const getCategoryInfo = (category: BmiResult['category']) => {
    return BMI_RANGES[category]
  }

  return { calculate, getCategoryInfo, ranges: BMI_RANGES }
}

/**
 * Calculate Basal Metabolic Rate
 * Formula: Mifflin-St Jeor Equation
 * Male: (10 × weight) + (6.25 × height) - (5 × age) + 5
 * Female: (10 × weight) + (6.25 × height) - (5 × age) - 161
 */
export function useBmr() {
  const calculate = (input: BmrInput): BmrResult => {
    // Validate inputs
    validateRange(input.weight, 20, 500, 'Weight')
    validateRange(input.height, 50, 300, 'Height')
    validateRange(input.age, 1, 120, 'Age')
    validateGender(input.gender)

    let bmr: number

    if (input.gender === 'male') {
      bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age + 5
    } else {
      bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161
    }

    // Calculate TDEE for all activity levels
    const tdee = Object.entries(ACTIVITY_MULTIPLIERS).reduce(
      (acc, [level, multiplier]) => {
        acc[level as ActivityLevel] = Math.round(bmr * multiplier)
        return acc
      },
      {} as Record<ActivityLevel, number>
    )

    return {
      bmr: Math.round(bmr),
      tdee,
    }
  }

  return { calculate, activityMultipliers: ACTIVITY_MULTIPLIERS }
}

/**
 * Calculate Total Daily Energy Expenditure
 * TDEE = BMR × Activity Multiplier
 */
export function useTdee() {
  const { calculate: calculateBmr } = useBmr()

  const calculate = (input: TdeeInput): TdeeResult => {
    const bmrResult = calculateBmr(input)
    const tdee = bmrResult.tdee[input.activityLevel]

    // Default macro split: 30% protein, 40% carbs, 30% fat
    const macros = calculateMacros(tdee, { protein: 30, carbs: 40, fat: 30 })

    return {
      bmr: bmrResult.bmr,
      tdee,
      activityLevel: input.activityLevel,
      macros,
    }
  }

  const calculateMacros = (
    calories: number,
    split: { protein: number; carbs: number; fat: number }
  ): MacroSplit => {
    const proteinCals = calories * (split.protein / 100)
    const carbsCals = calories * (split.carbs / 100)
    const fatCals = calories * (split.fat / 100)

    return {
      protein: {
        grams: Math.round(proteinCals / 4), // 4 cal per gram
        calories: Math.round(proteinCals),
        percentage: split.protein,
      },
      carbs: {
        grams: Math.round(carbsCals / 4), // 4 cal per gram
        calories: Math.round(carbsCals),
        percentage: split.carbs,
      },
      fat: {
        grams: Math.round(fatCals / 9), // 9 cal per gram
        calories: Math.round(fatCals),
        percentage: split.fat,
      },
    }
  }

  return { calculate, calculateMacros, activityMultipliers: ACTIVITY_MULTIPLIERS }
}

/**
 * Calculate Body Fat Percentage
 * Formula: Deurenberg Equation
 * BFP = (1.20 × BMI) + (0.23 × age) - (10.8 × gender) - 5.4
 * where gender = 1 for male, 0 for female
 */
export function useBodyFat() {
  const { calculate: calculateBmi } = useBmi()

  const calculate = (input: BodyFatInput): BodyFatResult => {
    // Validate inputs (BMI calculation will also validate weight/height)
    validateRange(input.age, 1, 120, 'Age')
    validateGender(input.gender)

    const bmiResult = calculateBmi({ weight: input.weight, height: input.height })
    const genderFactor = input.gender === 'male' ? 1 : 0

    // Deurenberg formula
    let percentage = 1.2 * bmiResult.bmi + 0.23 * input.age - 10.8 * genderFactor - 5.4

    // Clamp to reasonable range
    percentage = Math.max(3, Math.min(60, percentage))

    // Calculate masses
    const fatMass = (percentage / 100) * input.weight
    const leanMass = input.weight - fatMass

    // Determine category
    const ranges = BODY_FAT_RANGES[input.gender]
    let category = 'Obese'
    for (const range of ranges) {
      if (percentage < range.max) {
        category = range.label
        break
      }
    }

    return {
      percentage: Math.round(percentage * 10) / 10,
      category,
      fatMass: Math.round(fatMass * 10) / 10,
      leanMass: Math.round(leanMass * 10) / 10,
    }
  }

  const getRanges = (gender: 'male' | 'female') => BODY_FAT_RANGES[gender]

  return { calculate, getRanges }
}

/**
 * Calculate Lean Body Mass
 * Multiple formulas: Boer, Hume, and from Body Fat %
 */
export function useLeanBodyMass() {
  interface LbmInput {
    weight: number // kg
    height: number // cm
    gender: 'male' | 'female'
    bodyFatPercentage?: number // optional, for BF%-based calculation
  }

  interface LbmResult {
    boer: number
    hume: number
    fromBodyFat: number | null
    average: number
    fatMass: number
  }

  const calculate = (input: LbmInput): LbmResult => {
    // Validate inputs
    validateRange(input.weight, 20, 500, 'Weight')
    validateRange(input.height, 50, 300, 'Height')
    validateGender(input.gender)
    if (input.bodyFatPercentage !== undefined) {
      validateRange(input.bodyFatPercentage, 1, 70, 'Body fat percentage')
    }

    let boer: number, hume: number

    if (input.gender === 'male') {
      // Boer formula (1984)
      boer = 0.407 * input.weight + 0.267 * input.height - 19.2
      // Hume formula (1966)
      hume = 0.32810 * input.weight + 0.33929 * input.height - 29.5336
    } else {
      boer = 0.252 * input.weight + 0.473 * input.height - 48.3
      hume = 0.29569 * input.weight + 0.41813 * input.height - 43.2933
    }

    // From body fat percentage if provided
    let fromBodyFat: number | null = null
    if (input.bodyFatPercentage !== undefined) {
      fromBodyFat = input.weight * (1 - input.bodyFatPercentage / 100)
    }

    // Calculate average of available methods
    const values = [boer, hume]
    if (fromBodyFat !== null) values.push(fromBodyFat)
    const average = values.reduce((a, b) => a + b, 0) / values.length

    // Fat mass is weight minus lean mass
    const fatMass = input.weight - average

    return {
      boer: Math.round(boer * 10) / 10,
      hume: Math.round(hume * 10) / 10,
      fromBodyFat: fromBodyFat !== null ? Math.round(fromBodyFat * 10) / 10 : null,
      average: Math.round(average * 10) / 10,
      fatMass: Math.round(fatMass * 10) / 10,
    }
  }

  return { calculate }
}

/**
 * Calculate Ideal Weight
 * Multiple formulas for different perspectives
 */
export function useIdealWeight() {
  interface IdealWeightInput {
    height: number // cm
    gender: 'male' | 'female'
  }

  interface IdealWeightResult {
    devine: number
    robinson: number
    miller: number
    hamwi: number
    bmiRange: { min: number; max: number }
  }

  const calculate = (input: IdealWeightInput): IdealWeightResult => {
    // Validate inputs
    validateRange(input.height, 50, 300, 'Height')
    validateGender(input.gender)

    const heightInches = input.height / 2.54
    const inchesOver5ft = Math.max(0, heightInches - 60)
    const heightM = input.height / 100

    let devine: number, robinson: number, miller: number, hamwi: number

    if (input.gender === 'male') {
      devine = 50 + 2.3 * inchesOver5ft
      robinson = 52 + 1.9 * inchesOver5ft
      miller = 56.2 + 1.41 * inchesOver5ft
      hamwi = 48 + 2.7 * inchesOver5ft
    } else {
      devine = 45.5 + 2.3 * inchesOver5ft
      robinson = 49 + 1.7 * inchesOver5ft
      miller = 53.1 + 1.36 * inchesOver5ft
      hamwi = 45.5 + 2.2 * inchesOver5ft
    }

    return {
      devine: Math.round(devine * 10) / 10,
      robinson: Math.round(robinson * 10) / 10,
      miller: Math.round(miller * 10) / 10,
      hamwi: Math.round(hamwi * 10) / 10,
      bmiRange: {
        min: Math.round(18.5 * heightM * heightM * 10) / 10,
        max: Math.round(24.9 * heightM * heightM * 10) / 10,
      },
    }
  }

  return { calculate }
}

/**
 * Calculate Macros for specific goals
 */
export function useMacros() {
  type Goal = 'maintain' | 'lose' | 'gain' | 'custom'

  interface MacroInput {
    tdee: number
    goal: Goal
    customSplit?: { protein: number; carbs: number; fat: number }
  }

  const GOAL_ADJUSTMENTS: Record<Goal, { calories: number; split: { protein: number; carbs: number; fat: number } }> = {
    maintain: { calories: 0, split: { protein: 30, carbs: 40, fat: 30 } },
    lose: { calories: -500, split: { protein: 40, carbs: 30, fat: 30 } }, // Higher protein for satiety
    gain: { calories: 300, split: { protein: 30, carbs: 45, fat: 25 } }, // Higher carbs for energy
    custom: { calories: 0, split: { protein: 30, carbs: 40, fat: 30 } },
  }

  const calculate = (input: MacroInput): { calories: number; macros: MacroSplit } => {
    const adjustment = GOAL_ADJUSTMENTS[input.goal]
    const targetCalories = input.tdee + adjustment.calories
    const split = input.customSplit || adjustment.split

    const { calculateMacros } = useTdee()
    const macros = calculateMacros(targetCalories, split)

    return {
      calories: targetCalories,
      macros,
    }
  }

  return { calculate, goalAdjustments: GOAL_ADJUSTMENTS }
}

/**
 * Calculate One Rep Max (1RM)
 * Multiple formulas to estimate maximum weight for one repetition
 */
export function useOneRepMax() {
  const calculate = (input: OneRepMaxInput): OneRepMaxResult => {
    // Validate inputs
    validateRange(input.weight, 1, 1000, 'Weight')
    validateRange(input.reps, 1, 30, 'Reps')

    const { weight, reps } = input

    // Epley Formula: 1RM = weight × (1 + reps/30)
    const epley = weight * (1 + reps / 30)

    // Brzycki Formula: 1RM = weight × (36 / (37 - reps))
    const brzycki = weight * (36 / (37 - reps))

    // Lombardi Formula: 1RM = weight × reps^0.10
    const lombardi = weight * Math.pow(reps, 0.1)

    // O'Conner Formula: 1RM = weight × (1 + 0.025 × reps)
    const oconner = weight * (1 + 0.025 * reps)

    // Average of all formulas
    const average = (epley + brzycki + lombardi + oconner) / 4

    // Calculate percentage-based weights (using average 1RM)
    // Common percentages for different rep ranges
    const percentageData = [
      { reps: 1, percentage: 100 },
      { reps: 2, percentage: 95 },
      { reps: 3, percentage: 93 },
      { reps: 4, percentage: 90 },
      { reps: 5, percentage: 87 },
      { reps: 6, percentage: 85 },
      { reps: 8, percentage: 80 },
      { reps: 10, percentage: 75 },
      { reps: 12, percentage: 70 },
      { reps: 15, percentage: 65 },
    ]

    const percentages = percentageData.map((item) => ({
      reps: item.reps,
      percentage: item.percentage,
      weight: Math.round((average * item.percentage) / 100),
    }))

    return {
      epley: Math.round(epley),
      brzycki: Math.round(brzycki),
      lombardi: Math.round(lombardi),
      oconner: Math.round(oconner),
      average: Math.round(average),
      percentages,
    }
  }

  return { calculate }
}

/**
 * Calculate Daily Water Intake
 * Formula:
 * - Baseline: weight(kg) × 33 ml (average of 30-35 ml)
 * - Exercise: +500-1000 ml based on activity level
 * - Hot climate: +750 ml
 * - High protein diet: +375 ml (average of 250-500)
 * - Pregnancy: +300 ml
 * - Breastfeeding: +700 ml
 */
export function useWaterIntake() {
  const EXERCISE_ADJUSTMENTS: Record<ActivityLevel, number> = {
    sedentary: 0,
    light: 250, // Light exercise, moderate addition
    moderate: 500, // Moderate exercise
    active: 750, // Hard exercise
    athlete: 1000, // Very hard exercise
  }

  const calculate = (input: WaterIntakeInput): WaterIntakeResult => {
    // Validate inputs
    validateRange(input.weight, 20, 500, 'Weight')

    // Baseline: 33ml per kg (average of 30-35ml)
    const baseline = input.weight * 33

    // Calculate adjustments
    const adjustments = {
      exercise: EXERCISE_ADJUSTMENTS[input.activityLevel],
      climate: input.climate === 'hot' ? 750 : 0,
      highProtein: input.highProtein ? 375 : 0,
      pregnancy: input.pregnant ? 300 : 0,
      breastfeeding: input.breastfeeding ? 700 : 0,
    }

    // Total water intake
    const total = baseline + Object.values(adjustments).reduce((sum, val) => sum + val, 0)

    // Convert to glasses (250ml each) and liters
    const glasses = Math.ceil(total / 250)
    const liters = Math.round((total / 1000) * 10) / 10

    // Generate recommendation based on gender averages
    // Men: ~3L/day, Women: ~2.2L/day
    let recommendation = 'Normal'
    if (liters < 2) {
      recommendation = 'Below recommended - increase water intake'
    } else if (liters >= 2 && liters <= 3) {
      recommendation = 'Good hydration level'
    } else if (liters > 3 && liters <= 4) {
      recommendation = 'Excellent hydration for active lifestyle'
    } else {
      recommendation = 'Very high - ensure this matches your activity level'
    }

    return {
      baseline: Math.round(baseline),
      adjustments,
      total: Math.round(total),
      glasses,
      liters,
      recommendation,
    }
  }

  return { calculate, exerciseAdjustments: EXERCISE_ADJUSTMENTS }
}
