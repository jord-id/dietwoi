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
} as const

/** BMI category key type */
export type BmiCategory = keyof typeof BMI_RANGES

/** BMI ranges type */
export type BmiRanges = typeof BMI_RANGES

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

  return {
    calculate,
    getCategoryInfo,
    ranges: BMI_RANGES as BmiRanges,
  }
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

// ─── Waist-to-Hip Ratio ────────────────────────────────────────────────────

export interface WhrInput {
  waist: number // cm
  hip: number // cm
  gender: 'male' | 'female'
}

export interface WhrResult {
  ratio: number
  category: 'low' | 'moderate' | 'high'
  categoryLabel: string
}

/**
 * Calculate Waist-to-Hip Ratio
 * Formula: WHR = waist circumference / hip circumference
 * Risk thresholds per WHO guidelines
 */
export function useWaistHipRatio() {
  const calculate = (input: WhrInput): WhrResult => {
    validateRange(input.waist, 40, 200, 'Waist')
    validateRange(input.hip, 40, 200, 'Hip')
    validateGender(input.gender)

    const ratio = input.waist / input.hip

    let category: WhrResult['category'] = 'high'
    if (input.gender === 'male') {
      if (ratio < 0.90) category = 'low'
      else if (ratio < 1.0) category = 'moderate'
    } else {
      if (ratio < 0.80) category = 'low'
      else if (ratio < 0.85) category = 'moderate'
    }

    const labels = { low: 'Low Risk', moderate: 'Moderate Risk', high: 'High Risk' }

    return {
      ratio: Math.round(ratio * 100) / 100,
      category,
      categoryLabel: labels[category],
    }
  }

  return { calculate }
}

// ─── Waist-to-Height Ratio ─────────────────────────────────────────────────

export interface WhtRInput {
  waist: number // cm
  height: number // cm
}

export interface WhtRResult {
  ratio: number
  category: 'underweight' | 'healthy' | 'increased' | 'high'
  categoryLabel: string
}

/**
 * Calculate Waist-to-Height Ratio
 * Formula: WHtR = waist circumference / height
 * Boundary value 0.5 ("keep your waist under half your height")
 */
export function useWaistHeightRatio() {
  const calculate = (input: WhtRInput): WhtRResult => {
    validateRange(input.waist, 40, 200, 'Waist')
    validateRange(input.height, 50, 300, 'Height')

    const ratio = input.waist / input.height

    let category: WhtRResult['category'] = 'high'
    if (ratio < 0.4) category = 'underweight'
    else if (ratio < 0.5) category = 'healthy'
    else if (ratio < 0.6) category = 'increased'

    const labels = {
      underweight: 'Underweight Risk',
      healthy: 'Healthy',
      increased: 'Increased Risk',
      high: 'High Risk',
    }

    return {
      ratio: Math.round(ratio * 100) / 100,
      category,
      categoryLabel: labels[category],
    }
  }

  return { calculate }
}

// ─── Metabolic Age ─────────────────────────────────────────────────────────

export interface MetabolicAgeInput {
  weight: number // kg
  height: number // cm
  age: number
  gender: 'male' | 'female'
}

export interface MetabolicAgeResult {
  metabolicAge: number
  actualAge: number
  bmr: number
  difference: number // positive = older than actual, negative = younger
  assessment: string
}

/**
 * Estimate Metabolic Age
 * Compares personal BMR (Mifflin-St Jeor) against age-group averages
 * to interpolate a "metabolic age"
 */
export function useMetabolicAge() {
  const AVG_BMR: Record<'male' | 'female', { age: number; bmr: number }[]> = {
    male: [
      { age: 20, bmr: 1800 }, { age: 25, bmr: 1775 }, { age: 30, bmr: 1750 },
      { age: 35, bmr: 1725 }, { age: 40, bmr: 1700 }, { age: 45, bmr: 1675 },
      { age: 50, bmr: 1650 }, { age: 55, bmr: 1625 }, { age: 60, bmr: 1600 },
      { age: 65, bmr: 1575 }, { age: 70, bmr: 1550 }, { age: 75, bmr: 1525 },
      { age: 80, bmr: 1500 },
    ],
    female: [
      { age: 20, bmr: 1450 }, { age: 25, bmr: 1425 }, { age: 30, bmr: 1400 },
      { age: 35, bmr: 1375 }, { age: 40, bmr: 1350 }, { age: 45, bmr: 1325 },
      { age: 50, bmr: 1300 }, { age: 55, bmr: 1275 }, { age: 60, bmr: 1250 },
      { age: 65, bmr: 1225 }, { age: 70, bmr: 1200 }, { age: 75, bmr: 1175 },
      { age: 80, bmr: 1150 },
    ],
  }

  const calculate = (input: MetabolicAgeInput): MetabolicAgeResult => {
    validateRange(input.weight, 20, 500, 'Weight')
    validateRange(input.height, 50, 300, 'Height')
    validateRange(input.age, 15, 100, 'Age')
    validateGender(input.gender)

    let bmr: number
    if (input.gender === 'male') {
      bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age + 5
    } else {
      bmr = 10 * input.weight + 6.25 * input.height - 5 * input.age - 161
    }

    const table = AVG_BMR[input.gender]
    let metabolicAge = table[0].age

    if (bmr > table[0].bmr) {
      metabolicAge = Math.max(15, table[0].age - Math.round((bmr - table[0].bmr) / 10))
    } else if (bmr < table[table.length - 1].bmr) {
      metabolicAge = table[table.length - 1].age + Math.round((table[table.length - 1].bmr - bmr) / 10)
    } else {
      for (let i = 0; i < table.length - 1; i++) {
        if (bmr <= table[i].bmr && bmr >= table[i + 1].bmr) {
          const ratio = (table[i].bmr - bmr) / (table[i].bmr - table[i + 1].bmr)
          metabolicAge = Math.round(table[i].age + ratio * (table[i + 1].age - table[i].age))
          break
        }
      }
    }

    const difference = metabolicAge - input.age
    let assessment: string
    if (difference <= -5) assessment = 'Excellent — significantly younger than actual age'
    else if (difference < 0) assessment = 'Good — younger than actual age'
    else if (difference === 0) assessment = 'Average — matches actual age'
    else if (difference <= 5) assessment = 'Above average — slightly older than actual age'
    else assessment = 'Consider lifestyle changes to improve metabolic health'

    return { metabolicAge, actualAge: input.age, bmr: Math.round(bmr), difference, assessment }
  }

  return { calculate }
}

// ─── Calorie Deficit ──────────────────────────────────────────────────────

export type WeightGoal = 'slow-loss' | 'moderate-loss' | 'aggressive-loss' | 'slow-gain' | 'standard-gain'

export interface CalorieDeficitInput {
  weight: number
  height: number
  age: number
  gender: 'male' | 'female'
  activityLevel: ActivityLevel
  goal: WeightGoal
}

export interface CalorieDeficitResult {
  tdee: number
  targetCalories: number
  deficit: number
  weeklyChange: number
  minimumSafe: number
  isBelowMinimum: boolean
}

/**
 * Calculate Calorie Deficit / Surplus
 * Adjusts TDEE based on weight goal with safety minimums
 */
export function useCalorieDeficit() {
  const GOAL_ADJUSTMENTS: Record<WeightGoal, { calories: number; weeklyKg: number }> = {
    'slow-loss': { calories: -250, weeklyKg: -0.25 },
    'moderate-loss': { calories: -500, weeklyKg: -0.5 },
    'aggressive-loss': { calories: -750, weeklyKg: -0.75 },
    'slow-gain': { calories: 250, weeklyKg: 0.25 },
    'standard-gain': { calories: 500, weeklyKg: 0.5 },
  }

  const calculate = (input: CalorieDeficitInput): CalorieDeficitResult => {
    validateRange(input.weight, 20, 500, 'Weight')
    validateRange(input.height, 50, 300, 'Height')
    validateRange(input.age, 15, 100, 'Age')
    validateGender(input.gender)

    const { calculate: calculateTdee } = useTdee()
    const tdeeResult = calculateTdee(input)
    const adjustment = GOAL_ADJUSTMENTS[input.goal]
    const targetCalories = tdeeResult.tdee + adjustment.calories
    const minimumSafe = input.gender === 'female' ? 1200 : 1500

    return {
      tdee: tdeeResult.tdee,
      targetCalories: Math.max(targetCalories, minimumSafe),
      deficit: -adjustment.calories,
      weeklyChange: adjustment.weeklyKg,
      minimumSafe,
      isBelowMinimum: targetCalories < minimumSafe,
    }
  }

  return { calculate, goals: GOAL_ADJUSTMENTS }
}

// ─── Protein ──────────────────────────────────────────────────────────────

export type ProteinGoal = 'sedentary' | 'recreational' | 'endurance' | 'strength-maintain' | 'strength-gain' | 'deficit' | 'elderly'

export interface ProteinInput {
  weight: number
  goal: ProteinGoal
}

export interface ProteinResult {
  dailyGrams: { min: number; max: number }
  perMeal: { min: number; max: number }
  perKg: { min: number; max: number }
  goalLabel: string
}

/**
 * Calculate Protein Intake
 * Based on ISSN position stand ranges per body weight and goal
 */
export function useProtein() {
  const PROTEIN_RANGES: Record<ProteinGoal, { min: number; max: number; label: string }> = {
    'sedentary': { min: 0.8, max: 0.8, label: 'Sedentary Adult' },
    'recreational': { min: 1.0, max: 1.2, label: 'Recreational Exerciser' },
    'endurance': { min: 1.2, max: 1.4, label: 'Endurance Athlete' },
    'strength-maintain': { min: 1.4, max: 1.6, label: 'Strength (Maintenance)' },
    'strength-gain': { min: 1.6, max: 2.2, label: 'Strength (Muscle Gain)' },
    'deficit': { min: 1.8, max: 2.4, label: 'Caloric Deficit (Preserve Muscle)' },
    'elderly': { min: 1.0, max: 1.2, label: 'Elderly (65+)' },
  }

  const calculate = (input: ProteinInput): ProteinResult => {
    validateRange(input.weight, 20, 500, 'Weight')
    const range = PROTEIN_RANGES[input.goal]
    const minGrams = Math.round(input.weight * range.min)
    const maxGrams = Math.round(input.weight * range.max)

    return {
      dailyGrams: { min: minGrams, max: maxGrams },
      perMeal: { min: Math.round(minGrams / 4), max: Math.round(maxGrams / 4) },
      perKg: { min: range.min, max: range.max },
      goalLabel: range.label,
    }
  }

  return { calculate, ranges: PROTEIN_RANGES }
}

// ─── Meal Calories ────────────────────────────────────────────────────────

export type MealPattern = 'traditional' | 'large-lunch' | 'intermittent' | 'five-meals'

export interface MealCaloriesInput {
  weight: number
  height: number
  age: number
  gender: 'male' | 'female'
  activityLevel: ActivityLevel
  pattern: MealPattern
}

export interface MealCaloriesResult {
  tdee: number
  pattern: MealPattern
  meals: { name: string; calories: number; percentage: number }[]
}

/**
 * Calculate Meal Calorie Distribution
 * Distributes TDEE across meals based on eating pattern
 */
export function useMealCalories() {
  const PATTERNS: Record<MealPattern, { label: string; meals: { name: string; percentage: number }[] }> = {
    'traditional': {
      label: 'Traditional (3 meals + snack)',
      meals: [
        { name: 'Breakfast', percentage: 25 },
        { name: 'Lunch', percentage: 35 },
        { name: 'Dinner', percentage: 30 },
        { name: 'Snacks', percentage: 10 },
      ],
    },
    'large-lunch': {
      label: 'Large Lunch',
      meals: [
        { name: 'Breakfast', percentage: 20 },
        { name: 'Lunch', percentage: 40 },
        { name: 'Dinner', percentage: 30 },
        { name: 'Snacks', percentage: 10 },
      ],
    },
    'intermittent': {
      label: 'Intermittent Fasting (16:8)',
      meals: [
        { name: 'Lunch', percentage: 45 },
        { name: 'Dinner', percentage: 45 },
        { name: 'Snacks', percentage: 10 },
      ],
    },
    'five-meals': {
      label: '5 Meals',
      meals: [
        { name: 'Breakfast', percentage: 20 },
        { name: 'Lunch', percentage: 25 },
        { name: 'Dinner', percentage: 25 },
        { name: 'Snack 1', percentage: 15 },
        { name: 'Snack 2', percentage: 15 },
      ],
    },
  }

  const calculate = (input: MealCaloriesInput): MealCaloriesResult => {
    const { calculate: calculateTdee } = useTdee()
    const tdeeResult = calculateTdee(input)

    const pattern = PATTERNS[input.pattern]
    return {
      tdee: tdeeResult.tdee,
      pattern: input.pattern,
      meals: pattern.meals.map(m => ({
        name: m.name,
        calories: Math.round(tdeeResult.tdee * m.percentage / 100),
        percentage: m.percentage,
      })),
    }
  }

  return { calculate, patterns: PATTERNS }
}

// ─── Sleep ────────────────────────────────────────────────────────────────

export interface SleepInput {
  age: number
}

export interface SleepResult {
  recommended: { min: number; max: number }
  acceptable: { min: number; max: number }
  notRecommended: { below: number; above: number }
  ageGroup: string
}

export function useSleep() {
  const SLEEP_TABLE = [
    { minAge: 0, maxAge: 0.25, group: 'Newborn (0-3 mo)', rec: [14, 17], acc: [11, 19] },
    { minAge: 0.25, maxAge: 1, group: 'Infant (4-11 mo)', rec: [12, 15], acc: [10, 18] },
    { minAge: 1, maxAge: 3, group: 'Toddler (1-2 yr)', rec: [11, 14], acc: [9, 16] },
    { minAge: 3, maxAge: 6, group: 'Preschool (3-5 yr)', rec: [10, 13], acc: [8, 14] },
    { minAge: 6, maxAge: 14, group: 'School Age (6-13 yr)', rec: [9, 11], acc: [7, 12] },
    { minAge: 14, maxAge: 18, group: 'Teen (14-17 yr)', rec: [8, 10], acc: [7, 11] },
    { minAge: 18, maxAge: 26, group: 'Young Adult (18-25)', rec: [7, 9], acc: [6, 11] },
    { minAge: 26, maxAge: 65, group: 'Adult (26-64)', rec: [7, 9], acc: [6, 10] },
    { minAge: 65, maxAge: 120, group: 'Older Adult (65+)', rec: [7, 8], acc: [5, 9] },
  ]

  const calculate = (input: SleepInput): SleepResult => {
    validateRange(input.age, 0, 120, 'Age')
    const entry = SLEEP_TABLE.find(e => input.age >= e.minAge && input.age < e.maxAge) || SLEEP_TABLE[SLEEP_TABLE.length - 1]

    return {
      recommended: { min: entry.rec[0], max: entry.rec[1] },
      acceptable: { min: entry.acc[0], max: entry.acc[1] },
      notRecommended: { below: entry.acc[0], above: entry.acc[1] },
      ageGroup: entry.group,
    }
  }

  return { calculate }
}

// ─── Caffeine ─────────────────────────────────────────────────────────────

export interface CaffeineSource {
  id: string
  name: string
  caffeineMg: number
  servingSize: string
}

export interface CaffeineInput {
  servings: Record<string, number>
  isPregnant: boolean
}

export interface CaffeineResult {
  totalMg: number
  limit: number
  percentOfLimit: number
  isOverLimit: boolean
  breakdown: { name: string; mg: number; servings: number }[]
}

export function useCaffeine() {
  const SOURCES: CaffeineSource[] = [
    { id: 'espresso', name: 'Espresso (30ml)', caffeineMg: 63, servingSize: '30ml' },
    { id: 'brewed', name: 'Brewed Coffee (240ml)', caffeineMg: 130, servingSize: '240ml' },
    { id: 'instant', name: 'Instant Coffee (240ml)', caffeineMg: 63, servingSize: '240ml' },
    { id: 'black-tea', name: 'Black Tea (240ml)', caffeineMg: 47, servingSize: '240ml' },
    { id: 'green-tea', name: 'Green Tea (240ml)', caffeineMg: 28, servingSize: '240ml' },
    { id: 'cola', name: 'Cola (355ml)', caffeineMg: 34, servingSize: '355ml' },
    { id: 'energy-drink', name: 'Energy Drink (250ml)', caffeineMg: 80, servingSize: '250ml' },
    { id: 'dark-chocolate', name: 'Dark Chocolate (30g)', caffeineMg: 23, servingSize: '30g' },
  ]

  const calculate = (input: CaffeineInput): CaffeineResult => {
    const limit = input.isPregnant ? 200 : 400
    const breakdown: CaffeineResult['breakdown'] = []
    let totalMg = 0

    for (const source of SOURCES) {
      const servings = input.servings[source.id] || 0
      if (servings > 0) {
        const mg = servings * source.caffeineMg
        totalMg += mg
        breakdown.push({ name: source.name, mg, servings })
      }
    }

    return {
      totalMg: Math.round(totalMg),
      limit,
      percentOfLimit: Math.round((totalMg / limit) * 100),
      isOverLimit: totalMg > limit,
      breakdown,
    }
  }

  return { calculate, sources: SOURCES }
}

// ─── Sodium ───────────────────────────────────────────────────────────────

export interface SodiumInput {
  sodiumMg: number
}

export interface SodiumResult {
  sodiumMg: number
  saltG: number
  whoCategory: string
  ahaCategory: string
  percentOfWho: number
  percentOfAha: number
}

export function useSodium() {
  const calculate = (input: SodiumInput): SodiumResult => {
    validateRange(input.sodiumMg, 0, 10000, 'Sodium')

    const saltG = Math.round(input.sodiumMg * 0.0025 * 10) / 10

    let whoCategory: string
    if (input.sodiumMg <= 2000) whoCategory = 'Within WHO guideline'
    else if (input.sodiumMg <= 2300) whoCategory = 'Above WHO, within US guideline'
    else whoCategory = 'Above all guidelines'

    let ahaCategory: string
    if (input.sodiumMg <= 1500) ahaCategory = 'Ideal (AHA)'
    else if (input.sodiumMg <= 2300) ahaCategory = 'Acceptable'
    else ahaCategory = 'Excessive'

    return {
      sodiumMg: input.sodiumMg,
      saltG,
      whoCategory,
      ahaCategory,
      percentOfWho: Math.round((input.sodiumMg / 2000) * 100),
      percentOfAha: Math.round((input.sodiumMg / 1500) * 100),
    }
  }

  return { calculate }
}

// ─── Alcohol ──────────────────────────────────────────────────────────────

export type AlcoholUnitSystem = 'uk' | 'us' | 'au'

export interface AlcoholInput {
  volumeMl: number
  abvPercent: number
  unitSystem: AlcoholUnitSystem
}

export interface AlcoholResult {
  units: number
  unitLabel: string
  pureAlcoholG: number
  calories: number
  weeklyLimit: number
  percentOfWeekly: number
}

export function useAlcohol() {
  const SYSTEMS: Record<AlcoholUnitSystem, { gramsPerUnit: number; label: string; weeklyLimit: number }> = {
    uk: { gramsPerUnit: 8, label: 'UK Units', weeklyLimit: 14 },
    us: { gramsPerUnit: 14, label: 'US Standard Drinks', weeklyLimit: 14 },
    au: { gramsPerUnit: 10, label: 'AU Standard Drinks', weeklyLimit: 10 },
  }

  const calculate = (input: AlcoholInput): AlcoholResult => {
    validateRange(input.volumeMl, 1, 5000, 'Volume')
    validateRange(input.abvPercent, 0.1, 100, 'ABV')

    const pureAlcoholMl = input.volumeMl * (input.abvPercent / 100)
    const pureAlcoholG = pureAlcoholMl * 0.789

    const system = SYSTEMS[input.unitSystem]
    const units = pureAlcoholG / system.gramsPerUnit

    return {
      units: Math.round(units * 10) / 10,
      unitLabel: system.label,
      pureAlcoholG: Math.round(pureAlcoholG * 10) / 10,
      calories: Math.round(pureAlcoholG * 7),
      weeklyLimit: system.weeklyLimit,
      percentOfWeekly: Math.round((units / system.weeklyLimit) * 100),
    }
  }

  return { calculate, systems: SYSTEMS }
}

// ─── Max Heart Rate ──────────────────────────────────────────────────────

export interface MaxHrInput {
  age: number
  gender: 'male' | 'female'
}

export interface MaxHrResult {
  traditional: number
  tanaka: number
  gellish: number
  gulati: number | null
  recommended: number
}

/**
 * Calculate Max Heart Rate
 * Multiple formulas: Traditional (220-age), Tanaka (2001), Gellish, Gulati (women)
 */
export function useMaxHeartRate() {
  const calculate = (input: MaxHrInput): MaxHrResult => {
    validateRange(input.age, 10, 100, 'Age')
    validateGender(input.gender)

    const traditional = Math.round(220 - input.age)
    const tanaka = Math.round(208 - 0.7 * input.age)
    const gellish = Math.round(207 - 0.7 * input.age)
    const gulati = input.gender === 'female' ? Math.round(206 - 0.88 * input.age) : null
    const recommended = input.gender === 'female' ? gulati! : tanaka

    return { traditional, tanaka, gellish, gulati, recommended }
  }

  return { calculate }
}

// ─── Heart Rate Zones ────────────────────────────────────────────────────

export interface HrZonesInput {
  maxHr: number
  restingHr: number
}

export interface HrZone {
  zone: number
  name: string
  purpose: string
  minHr: number
  maxHr: number
  minPercent: number
  maxPercent: number
}

export interface HrZonesResult {
  zones: HrZone[]
  maxHr: number
  restingHr: number
  heartRateReserve: number
}

/**
 * Calculate Heart Rate Zones
 * Uses Karvonen method (Heart Rate Reserve) for 5 training zones
 */
export function useHeartRateZones() {
  const ZONES = [
    { zone: 1, name: 'Recovery', purpose: 'Warm-up, recovery, easy movement', min: 50, max: 60 },
    { zone: 2, name: 'Fat Burn', purpose: 'Endurance base, fat burning', min: 60, max: 70 },
    { zone: 3, name: 'Aerobic', purpose: 'Aerobic capacity, cardio fitness', min: 70, max: 80 },
    { zone: 4, name: 'Threshold', purpose: 'Lactate threshold, race pace', min: 80, max: 90 },
    { zone: 5, name: 'VO2 Max', purpose: 'Maximum effort, anaerobic', min: 90, max: 100 },
  ]

  const calculate = (input: HrZonesInput): HrZonesResult => {
    validateRange(input.maxHr, 100, 250, 'Max Heart Rate')
    validateRange(input.restingHr, 30, 120, 'Resting Heart Rate')
    if (input.restingHr >= input.maxHr) {
      throw new CalculationError('Resting heart rate must be lower than max heart rate')
    }

    const hrr = input.maxHr - input.restingHr
    const zones: HrZone[] = ZONES.map(z => ({
      zone: z.zone, name: z.name, purpose: z.purpose,
      minHr: Math.round(hrr * (z.min / 100) + input.restingHr),
      maxHr: Math.round(hrr * (z.max / 100) + input.restingHr),
      minPercent: z.min, maxPercent: z.max,
    }))

    return { zones, maxHr: input.maxHr, restingHr: input.restingHr, heartRateReserve: hrr }
  }

  return { calculate }
}

// ─── VO2 Max ─────────────────────────────────────────────────────────────

export type Vo2TestType = 'cooper' | 'mile-run' | 'step-test'

export interface Vo2MaxInput {
  testType: Vo2TestType
  distanceM?: number
  timeMin?: number
  heartRate?: number
  age?: number
  gender?: 'male' | 'female'
}

export interface Vo2MaxResult {
  vo2max: number
  testType: Vo2TestType
  classification: string
}

/**
 * Calculate VO2 Max
 * Supports Cooper 12-min run, 1.5 Mile Run, and Step Test methods
 */
export function useVo2Max() {
  const classify = (vo2: number, age: number, gender: 'male' | 'female'): string => {
    const thresholds = gender === 'male'
      ? { excellent: 55, good: 47, average: 39, belowAvg: 31 }
      : { excellent: 49, good: 41, average: 33, belowAvg: 25 }
    const ageAdjust = Math.max(0, (age - 30) / 5)
    if (vo2 > thresholds.excellent - ageAdjust) return 'Excellent'
    if (vo2 > thresholds.good - ageAdjust) return 'Good'
    if (vo2 > thresholds.average - ageAdjust) return 'Average'
    if (vo2 > thresholds.belowAvg - ageAdjust) return 'Below Average'
    return 'Poor'
  }

  const calculate = (input: Vo2MaxInput): Vo2MaxResult => {
    let vo2max: number
    switch (input.testType) {
      case 'cooper':
        if (!input.distanceM) throw new CalculationError('Distance is required for Cooper test')
        validateRange(input.distanceM, 400, 5000, 'Distance')
        vo2max = (input.distanceM - 504.9) / 44.73
        break
      case 'mile-run':
        if (!input.timeMin) throw new CalculationError('Time is required for 1.5 mile run test')
        validateRange(input.timeMin, 5, 30, 'Time')
        vo2max = 483 / input.timeMin + 3.5
        break
      case 'step-test':
        if (!input.heartRate) throw new CalculationError('Heart rate is required for step test')
        validateRange(input.heartRate, 40, 200, 'Heart Rate')
        vo2max = 111.33 - 0.42 * input.heartRate
        break
      default:
        throw new CalculationError('Invalid test type')
    }
    return {
      vo2max: Math.round(vo2max * 10) / 10,
      testType: input.testType,
      classification: classify(vo2max, input.age || 30, input.gender || 'male'),
    }
  }

  return { calculate }
}

// ─── Pace Calculator ─────────────────────────────────────────────────────

export interface PaceInput {
  distanceKm: number
  timeSeconds: number
}

export interface PaceResult {
  paceMinKm: string
  paceMinMile: string
  speedKmh: number
  speedMph: number
  predictions: { race: string; distance: string; time: string }[]
}

/**
 * Calculate Running Pace and Race Predictions
 * Uses Riegel formula for race time predictions
 */
export function usePaceCalculator() {
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.round(totalSeconds % 60)
    if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  }

  const calculate = (input: PaceInput): PaceResult => {
    validateRange(input.distanceKm, 0.1, 200, 'Distance')
    validateRange(input.timeSeconds, 10, 86400, 'Time')

    const paceSecondsPerKm = input.timeSeconds / input.distanceKm
    const paceSecondsPerMile = paceSecondsPerKm * 1.60934
    const speedKmh = (input.distanceKm / input.timeSeconds) * 3600
    const speedMph = speedKmh / 1.60934

    const races = [
      { race: '5K', distanceKm: 5 },
      { race: '10K', distanceKm: 10 },
      { race: 'Half Marathon', distanceKm: 21.0975 },
      { race: 'Marathon', distanceKm: 42.195 },
    ]

    const predictions = races.map(r => ({
      race: r.race,
      distance: `${r.distanceKm} km`,
      time: formatTime(input.timeSeconds * Math.pow(r.distanceKm / input.distanceKm, 1.06)),
    }))

    return {
      paceMinKm: formatTime(paceSecondsPerKm),
      paceMinMile: formatTime(paceSecondsPerMile),
      speedKmh: Math.round(speedKmh * 10) / 10,
      speedMph: Math.round(speedMph * 10) / 10,
      predictions,
    }
  }

  return { calculate }
}

// ─── Calories Burned ─────────────────────────────────────────────────────

export interface CaloriesBurnedInput {
  activityMet: number
  weight: number
  durationMin: number
}

export interface CaloriesBurnedResult {
  calories: number
  met: number
  durationMin: number
}

/**
 * Calculate Calories Burned by Activity
 * Based on MET values from Ainsworth 2011 compendium
 */
export function useCaloriesBurned() {
  const ACTIVITIES = [
    { id: 'walking-slow', name: 'Walking (3.5 mph)', met: 4.3 },
    { id: 'walking-brisk', name: 'Walking (4.0 mph, brisk)', met: 5.0 },
    { id: 'running-5', name: 'Running (5 mph / 12 min mile)', met: 8.3 },
    { id: 'running-6', name: 'Running (6 mph / 10 min mile)', met: 9.8 },
    { id: 'running-7', name: 'Running (7 mph / 8.5 min mile)', met: 11.0 },
    { id: 'running-8', name: 'Running (8 mph / 7.5 min mile)', met: 11.8 },
    { id: 'cycling-moderate', name: 'Cycling (12-14 mph)', met: 8.0 },
    { id: 'cycling-vigorous', name: 'Cycling (14-16 mph)', met: 10.0 },
    { id: 'swimming-moderate', name: 'Swimming (moderate)', met: 5.8 },
    { id: 'swimming-vigorous', name: 'Swimming (vigorous)', met: 9.8 },
    { id: 'weights-moderate', name: 'Weight Training (moderate)', met: 3.5 },
    { id: 'weights-vigorous', name: 'Weight Training (vigorous)', met: 6.0 },
    { id: 'hiit', name: 'HIIT', met: 10.0 },
    { id: 'yoga', name: 'Yoga', met: 3.0 },
    { id: 'jump-rope', name: 'Jump Rope', met: 11.5 },
  ]

  const calculate = (input: CaloriesBurnedInput): CaloriesBurnedResult => {
    validateRange(input.weight, 20, 500, 'Weight')
    validateRange(input.durationMin, 1, 600, 'Duration')
    validateRange(input.activityMet, 0.5, 20, 'MET value')

    return {
      calories: Math.round(input.activityMet * input.weight * (input.durationMin / 60)),
      met: input.activityMet,
      durationMin: input.durationMin,
    }
  }

  return { calculate, activities: ACTIVITIES }
}

// ==================== HEALTH ====================

export interface BpInput {
  systolic: number
  diastolic: number
}

export interface BpResult {
  systolic: number
  diastolic: number
  category: 'normal' | 'elevated' | 'stage1' | 'stage2' | 'crisis'
  categoryLabel: string
  recommendation: string
}

export function useBloodPressure() {
  const calculate = (input: BpInput): BpResult => {
    validateRange(input.systolic, 60, 250, 'Systolic')
    validateRange(input.diastolic, 30, 150, 'Diastolic')

    let category: BpResult['category']
    let categoryLabel: string
    let recommendation: string

    if (input.systolic > 180 || input.diastolic > 120) {
      category = 'crisis'; categoryLabel = 'Hypertensive Crisis'
      recommendation = 'Seek immediate medical attention'
    } else if (input.systolic >= 140 || input.diastolic >= 90) {
      category = 'stage2'; categoryLabel = 'Hypertension Stage 2'
      recommendation = 'Consult your doctor. Medication may be needed alongside lifestyle changes.'
    } else if (input.systolic >= 130 || input.diastolic >= 80) {
      category = 'stage1'; categoryLabel = 'Hypertension Stage 1'
      recommendation = 'Lifestyle changes recommended. Your doctor may consider medication.'
    } else if (input.systolic >= 120 && input.diastolic < 80) {
      category = 'elevated'; categoryLabel = 'Elevated'
      recommendation = 'Maintain healthy habits. Monitor regularly.'
    } else {
      category = 'normal'; categoryLabel = 'Normal'
      recommendation = 'Your blood pressure is in a healthy range. Keep it up!'
    }

    return { systolic: input.systolic, diastolic: input.diastolic, category, categoryLabel, recommendation }
  }

  return { calculate }
}

export interface CholesterolInput {
  totalCholesterol: number
  hdl: number
  ldl: number
  triglycerides: number
}

export interface CholesterolResult {
  totalHdlRatio: { value: number; risk: string }
  ldlHdlRatio: { value: number; risk: string }
  trigHdlRatio: { value: number; risk: string }
  nonHdl: { value: number; risk: string }
}

export function useCholesterol() {
  const calculate = (input: CholesterolInput): CholesterolResult => {
    validateRange(input.totalCholesterol, 50, 500, 'Total Cholesterol')
    validateRange(input.hdl, 10, 150, 'HDL')
    validateRange(input.ldl, 20, 400, 'LDL')
    validateRange(input.triglycerides, 20, 1000, 'Triglycerides')

    const totalHdl = input.totalCholesterol / input.hdl
    const ldlHdl = input.ldl / input.hdl
    const trigHdl = input.triglycerides / input.hdl
    const nonHdl = input.totalCholesterol - input.hdl

    return {
      totalHdlRatio: {
        value: Math.round(totalHdl * 10) / 10,
        risk: totalHdl < 4.5 ? 'Low Risk' : totalHdl < 5.5 ? 'Average' : 'High Risk',
      },
      ldlHdlRatio: {
        value: Math.round(ldlHdl * 10) / 10,
        risk: ldlHdl < 2.0 ? 'Optimal' : ldlHdl < 2.5 ? 'Good' : ldlHdl < 3.3 ? 'Borderline' : 'High',
      },
      trigHdlRatio: {
        value: Math.round(trigHdl * 10) / 10,
        risk: trigHdl < 2.0 ? 'Ideal' : trigHdl < 4.0 ? 'Good' : 'High',
      },
      nonHdl: {
        value: Math.round(nonHdl),
        risk: nonHdl < 130 ? 'Optimal' : nonHdl < 160 ? 'Near Optimal' : nonHdl < 190 ? 'Borderline' : 'High',
      },
    }
  }

  return { calculate }
}

export interface FindriscInput {
  ageGroup: 'under45' | '45-54' | '55-64' | 'over64'
  bmiGroup: 'under25' | '25-30' | 'over30'
  waistGroup: 'low' | 'medium' | 'high'
  dailyActivity: boolean
  dailyVegetables: boolean
  bpMedication: boolean
  highGlucoseHistory: boolean
  familyHistory: boolean
}

export interface FindriscResult {
  score: number
  riskCategory: string
  tenYearRisk: string
}

export function useDiabetesRisk() {
  const calculate = (input: FindriscInput): FindriscResult => {
    let score = 0
    const agePoints = { 'under45': 0, '45-54': 2, '55-64': 3, 'over64': 4 }
    score += agePoints[input.ageGroup]
    const bmiPoints = { 'under25': 0, '25-30': 1, 'over30': 3 }
    score += bmiPoints[input.bmiGroup]
    const waistPoints = { 'low': 0, 'medium': 3, 'high': 4 }
    score += waistPoints[input.waistGroup]
    if (!input.dailyActivity) score += 2
    if (!input.dailyVegetables) score += 1
    if (input.bpMedication) score += 2
    if (input.highGlucoseHistory) score += 5
    if (input.familyHistory) score += 5

    let riskCategory: string; let tenYearRisk: string
    if (score < 7) { riskCategory = 'Low'; tenYearRisk = '~1%' }
    else if (score <= 11) { riskCategory = 'Slightly Elevated'; tenYearRisk = '~4%' }
    else if (score <= 14) { riskCategory = 'Moderate'; tenYearRisk = '~17%' }
    else if (score <= 20) { riskCategory = 'High'; tenYearRisk = '~33%' }
    else { riskCategory = 'Very High'; tenYearRisk = '~50%' }

    return { score, riskCategory, tenYearRisk }
  }

  return { calculate }
}

export interface PregnancyWeightInput {
  prePregnancyWeight: number
  height: number
  currentWeek: number
  twins: boolean
}

export interface PregnancyWeightResult {
  preBmi: number
  bmiCategory: string
  recommendedTotal: { min: number; max: number }
  weeklyRate: { min: number; max: number }
  expectedCurrent: { min: number; max: number }
}

export function usePregnancyWeight() {
  const calculate = (input: PregnancyWeightInput): PregnancyWeightResult => {
    validateRange(input.prePregnancyWeight, 30, 200, 'Pre-pregnancy weight')
    validateRange(input.height, 100, 250, 'Height')
    validateRange(input.currentWeek, 1, 42, 'Week')

    const heightM = input.height / 100
    const bmi = input.prePregnancyWeight / (heightM * heightM)

    let bmiCategory: string
    let totalGain: { min: number; max: number }
    let weeklyRate: { min: number; max: number }

    if (input.twins) {
      if (bmi < 25) { totalGain = { min: 17, max: 25 }; weeklyRate = { min: 0.57, max: 0.83 } }
      else if (bmi < 30) { totalGain = { min: 14, max: 23 }; weeklyRate = { min: 0.47, max: 0.77 } }
      else { totalGain = { min: 11, max: 19 }; weeklyRate = { min: 0.37, max: 0.63 } }
    } else {
      if (bmi < 18.5) { totalGain = { min: 12.5, max: 18 }; weeklyRate = { min: 0.44, max: 0.58 } }
      else if (bmi < 25) { totalGain = { min: 11.5, max: 16 }; weeklyRate = { min: 0.35, max: 0.50 } }
      else if (bmi < 30) { totalGain = { min: 7, max: 11.5 }; weeklyRate = { min: 0.23, max: 0.33 } }
      else { totalGain = { min: 5, max: 9 }; weeklyRate = { min: 0.17, max: 0.27 } }
    }

    if (bmi < 18.5) bmiCategory = 'Underweight'
    else if (bmi < 25) bmiCategory = 'Normal'
    else if (bmi < 30) bmiCategory = 'Overweight'
    else bmiCategory = 'Obese'

    let expectedMin = 0, expectedMax = 0
    if (input.currentWeek <= 13) {
      const progress = input.currentWeek / 13
      expectedMin = 0.5 * progress; expectedMax = 2 * progress
    } else {
      const weeks = input.currentWeek - 13
      expectedMin = 0.5 + weeklyRate.min * weeks
      expectedMax = 2 + weeklyRate.max * weeks
    }

    return {
      preBmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      recommendedTotal: totalGain,
      weeklyRate,
      expectedCurrent: { min: Math.round(expectedMin * 10) / 10, max: Math.round(expectedMax * 10) / 10 },
    }
  }

  return { calculate }
}

export interface ChildGrowthInput {
  ageMonths: number
  weight: number
  height: number
  gender: 'male' | 'female'
}

export interface ChildGrowthResult {
  weightPercentile: string
  heightPercentile: string
  weightInterpretation: string
  heightInterpretation: string
}

export function useChildGrowth() {
  const WHO_MEDIAN_WEIGHT: Record<'male' | 'female', { months: number; kg: number }[]> = {
    male: [
      { months: 0, kg: 3.3 }, { months: 3, kg: 6.4 }, { months: 6, kg: 7.9 },
      { months: 9, kg: 9.0 }, { months: 12, kg: 9.6 }, { months: 18, kg: 10.9 },
      { months: 24, kg: 12.2 }, { months: 36, kg: 14.3 }, { months: 48, kg: 16.3 },
      { months: 60, kg: 18.3 }, { months: 72, kg: 20.5 }, { months: 96, kg: 25.3 },
      { months: 120, kg: 31.2 }, { months: 144, kg: 39.9 }, { months: 168, kg: 50.8 },
      { months: 192, kg: 60.0 }, { months: 216, kg: 67.0 }, { months: 240, kg: 71.0 },
    ],
    female: [
      { months: 0, kg: 3.2 }, { months: 3, kg: 5.8 }, { months: 6, kg: 7.3 },
      { months: 9, kg: 8.2 }, { months: 12, kg: 8.9 }, { months: 18, kg: 10.2 },
      { months: 24, kg: 11.5 }, { months: 36, kg: 13.9 }, { months: 48, kg: 16.1 },
      { months: 60, kg: 18.2 }, { months: 72, kg: 20.2 }, { months: 96, kg: 25.0 },
      { months: 120, kg: 31.9 }, { months: 144, kg: 41.5 }, { months: 168, kg: 49.0 },
      { months: 192, kg: 53.5 }, { months: 216, kg: 56.0 }, { months: 240, kg: 58.0 },
    ],
  }

  const WHO_MEDIAN_HEIGHT: Record<'male' | 'female', { months: number; cm: number }[]> = {
    male: [
      { months: 0, cm: 49.9 }, { months: 3, cm: 61.4 }, { months: 6, cm: 67.6 },
      { months: 9, cm: 72.0 }, { months: 12, cm: 75.7 }, { months: 18, cm: 82.3 },
      { months: 24, cm: 87.8 }, { months: 36, cm: 96.1 }, { months: 48, cm: 103.3 },
      { months: 60, cm: 110.0 }, { months: 72, cm: 116.0 }, { months: 96, cm: 127.3 },
      { months: 120, cm: 137.8 }, { months: 144, cm: 149.1 }, { months: 168, cm: 163.2 },
      { months: 192, cm: 173.4 }, { months: 216, cm: 176.5 }, { months: 240, cm: 177.0 },
    ],
    female: [
      { months: 0, cm: 49.1 }, { months: 3, cm: 59.8 }, { months: 6, cm: 65.7 },
      { months: 9, cm: 70.1 }, { months: 12, cm: 74.0 }, { months: 18, cm: 80.7 },
      { months: 24, cm: 86.4 }, { months: 36, cm: 95.1 }, { months: 48, cm: 102.7 },
      { months: 60, cm: 109.4 }, { months: 72, cm: 115.5 }, { months: 96, cm: 126.6 },
      { months: 120, cm: 138.4 }, { months: 144, cm: 151.2 }, { months: 168, cm: 159.8 },
      { months: 192, cm: 163.3 }, { months: 216, cm: 163.8 }, { months: 240, cm: 164.0 },
    ],
  }

  const interpolateMedian = (table: { months: number; kg?: number; cm?: number }[], ageMonths: number, key: 'kg' | 'cm'): number => {
    for (let i = 0; i < table.length - 1; i++) {
      if (ageMonths >= table[i].months && ageMonths <= table[i + 1].months) {
        const ratio = (ageMonths - table[i].months) / (table[i + 1].months - table[i].months)
        return (table[i] as any)[key] + ratio * ((table[i + 1] as any)[key] - (table[i] as any)[key])
      }
    }
    return (table[table.length - 1] as any)[key]
  }

  const getPercentileEstimate = (value: number, median: number): string => {
    const ratio = value / median
    if (ratio < 0.85) return 'Below 3rd'
    if (ratio < 0.92) return '3rd-15th'
    if (ratio < 1.08) return '15th-85th (Normal)'
    if (ratio < 1.15) return '85th-97th'
    return 'Above 97th'
  }

  const getInterpretation = (percentile: string): string => {
    if (percentile.includes('Below 3rd')) return 'Below normal range — consult pediatrician'
    if (percentile.includes('3rd-15th')) return 'Below average but within range'
    if (percentile.includes('Normal')) return 'Normal range'
    if (percentile.includes('85th-97th')) return 'Above average but within range'
    return 'Above normal range — consult pediatrician'
  }

  const calculate = (input: ChildGrowthInput): ChildGrowthResult => {
    validateRange(input.ageMonths, 0, 240, 'Age')
    validateRange(input.weight, 1, 150, 'Weight')
    validateRange(input.height, 30, 200, 'Height')
    validateGender(input.gender)

    const medianWeight = interpolateMedian(WHO_MEDIAN_WEIGHT[input.gender], input.ageMonths, 'kg')
    const medianHeight = interpolateMedian(WHO_MEDIAN_HEIGHT[input.gender], input.ageMonths, 'cm')

    const weightPercentile = getPercentileEstimate(input.weight, medianWeight)
    const heightPercentile = getPercentileEstimate(input.height, medianHeight)

    return {
      weightPercentile,
      heightPercentile,
      weightInterpretation: getInterpretation(weightPercentile),
      heightInterpretation: getInterpretation(heightPercentile),
    }
  }

  return { calculate }
}
