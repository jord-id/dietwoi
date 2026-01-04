<script setup lang="ts">
import type { CalculatorConfig } from '~/types/calculator'
import type { ActivityLevel } from '~/composables/useCalculations'

const config: CalculatorConfig = {
  meta: {
    title: 'Calorie Calculator',
    description: 'Calculate your calorie deficit or surplus for weight loss, maintenance, or muscle gain',
    shortDescription: 'Find your ideal daily calorie target based on your goals. Plan for weight loss, maintenance, or muscle gain with safe calorie adjustments.',
    path: '/calories',
    color: 'amber',
    contentPath: 'calculators/calories',
  },
  seo: {
    title: 'Calorie Calculator - Deficit & Surplus for Weight Loss & Gain',
    description: 'Calculate your daily calorie needs with deficit/surplus goals. Get personalized targets for weight loss, maintenance, or muscle gain with safe minimum thresholds.',
    path: '/calories',
  },
  schema: {
    name: 'Calorie Calculator',
    description: 'Calculate calorie deficit or surplus for weight management goals',
    url: '/calories',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Calorie Calculator', url: '/calories' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
    { key: 'age', label: 'Age', type: 'slider', min: 15, max: 100, default: 30, unit: 'years' },
    { key: 'activityLevel', label: 'Activity Level', type: 'activity', default: 'moderate' },
  ],
}

// Goal types
type Goal = 'loss-slow' | 'loss-moderate' | 'loss-aggressive' | 'maintain' | 'bulk-lean' | 'bulk-standard'

interface GoalConfig {
  label: string
  description: string
  calorieAdjust: number
  category: 'loss' | 'maintain' | 'bulk'
}

const GOALS: Record<Goal, GoalConfig> = {
  'loss-slow': { label: 'Slow Cut', description: '-250 cal', calorieAdjust: -250, category: 'loss' },
  'loss-moderate': { label: 'Moderate Cut', description: '-500 cal', calorieAdjust: -500, category: 'loss' },
  'loss-aggressive': { label: 'Aggressive Cut', description: '-750 cal', calorieAdjust: -750, category: 'loss' },
  'maintain': { label: 'Maintain', description: 'Current weight', calorieAdjust: 0, category: 'maintain' },
  'bulk-lean': { label: 'Lean Bulk', description: '+250 cal', calorieAdjust: 250, category: 'bulk' },
  'bulk-standard': { label: 'Standard Bulk', description: '+500 cal', calorieAdjust: 500, category: 'bulk' },
}

// Minimum safe calories
const MIN_CALORIES = {
  male: 1500,
  female: 1200,
}

// State
const { calculate: calculateTdee } = useTdee()

const inputs = ref<Record<string, number | string>>({
  gender: 'male',
  weight: 70,
  height: 170,
  age: 30,
  activityLevel: 'moderate',
})

// Type-safe accessors (centralized type narrowing)
const weight = computed(() => Number(inputs.value.weight))
const height = computed(() => Number(inputs.value.height))
const age = computed(() => Number(inputs.value.age))
const gender = computed(() => inputs.value.gender as 'male' | 'female')
const activityLevel = computed(() => inputs.value.activityLevel as ActivityLevel)

const selectedGoal = ref<Goal>('maintain')

// Calculations
const tdeeResult = computed(() => {
  return calculateTdee({
    weight: weight.value,
    height: height.value,
    age: age.value,
    gender: gender.value,
    activityLevel: activityLevel.value,
  })
})

const currentGoal = computed(() => GOALS[selectedGoal.value])

const targetCalories = computed(() => {
  const target = tdeeResult.value.tdee + currentGoal.value.calorieAdjust
  const minCal = MIN_CALORIES[gender.value]

  // Don't go below safe minimums
  return Math.max(target, minCal)
})

const isUnderMinimum = computed(() => {
  const target = tdeeResult.value.tdee + currentGoal.value.calorieAdjust
  const minCal = MIN_CALORIES[gender.value]
  return target < minCal
})

// Weight change projections
const weeklyWeightChange = computed(() => {
  // 7,700 calories = 1 kg of body fat
  const actualDeficit = targetCalories.value - tdeeResult.value.tdee
  const kgPerWeek = (actualDeficit * 7) / 7700
  return Math.round(kgPerWeek * 100) / 100
})

const monthlyWeightChange = computed(() => {
  return Math.round(weeklyWeightChange.value * 4.33 * 10) / 10
})

// Goal categories for display
const lossGoals = computed(() =>
  Object.entries(GOALS).filter(([_, config]) => config.category === 'loss').map(([key, _]) => key as Goal)
)
const bulkGoals = computed(() =>
  Object.entries(GOALS).filter(([_, config]) => config.category === 'bulk').map(([key, _]) => key as Goal)
)
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Goal Selection -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">YOUR GOAL</label>

        <!-- Weight Loss Goals -->
        <div class="mb-3">
          <p class="font-pixel text-[10px] text-sky-600 mb-2 tracking-wide">WEIGHT LOSS</p>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="goal in lossGoals"
              :key="goal"
              class="relative p-3 border-2 bg-white text-center"
              :class="selectedGoal === goal
                ? 'border-sky-500'
                : 'border-gray-200 hover:border-gray-300'"
              @click="selectedGoal = goal"
            >
              <div v-if="selectedGoal === goal" class="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
              <span class="block font-pixel text-[10px] tracking-wide" :class="selectedGoal === goal ? 'text-sky-700' : 'text-gray-600'">{{ GOALS[goal].label.toUpperCase() }}</span>
              <span class="block font-game text-xs text-gray-400 mt-1">{{ GOALS[goal].description }}</span>
            </button>
          </div>
        </div>

        <!-- Maintain -->
        <div class="mb-3">
          <p class="font-pixel text-[10px] text-green-600 mb-2 tracking-wide">MAINTENANCE</p>
          <button
            class="relative w-full p-3 border-2 bg-white text-center"
            :class="selectedGoal === 'maintain'
              ? 'border-green-500'
              : 'border-gray-200 hover:border-gray-300'"
            @click="selectedGoal = 'maintain'"
          >
            <div v-if="selectedGoal === 'maintain'" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="block font-pixel text-[10px] tracking-wide" :class="selectedGoal === 'maintain' ? 'text-green-700' : 'text-gray-600'">{{ GOALS.maintain.label.toUpperCase() }}</span>
            <span class="block font-game text-xs text-gray-400 mt-1">{{ GOALS.maintain.description }}</span>
          </button>
        </div>

        <!-- Muscle Gain Goals -->
        <div>
          <p class="font-pixel text-[10px] text-amber-600 mb-2 tracking-wide">MUSCLE GAIN</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="goal in bulkGoals"
              :key="goal"
              class="relative p-3 border-2 bg-white text-center"
              :class="selectedGoal === goal
                ? 'border-amber-500'
                : 'border-gray-200 hover:border-gray-300'"
              @click="selectedGoal = goal"
            >
              <div v-if="selectedGoal === goal" class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <span class="block font-pixel text-[10px] tracking-wide" :class="selectedGoal === goal ? 'text-amber-700' : 'text-gray-600'">{{ GOALS[goal].label.toUpperCase() }}</span>
              <span class="block font-game text-xs text-gray-400 mt-1">{{ GOALS[goal].description }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- TDEE Reference -->
        <div class="relative p-4 border-2 border-amber-200 bg-white">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
          <p class="pl-2 font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">YOUR DAILY ENERGY EXPENDITURE (TDEE)</p>
          <p class="pl-2 font-game text-2xl sm:text-3xl font-bold text-amber-700">{{ tdeeResult.tdee.toLocaleString() }} <span class="text-sm text-gray-500">kcal</span></p>
        </div>

        <!-- Target Calories -->
        <div class="relative text-center p-6 border-2 border-amber-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">DAILY CALORIE TARGET</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              {{ targetCalories.toLocaleString() }}
            </span>
            <span class="font-game text-lg text-gray-500">kcal</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">
            <span v-if="currentGoal.calorieAdjust !== 0" class="text-amber-600">
              {{ currentGoal.calorieAdjust > 0 ? '+' : '' }}{{ currentGoal.calorieAdjust }} from TDEE
            </span>
            <span v-else class="text-gray-600">At maintenance</span>
          </p>
        </div>

        <!-- Safety Warning -->
        <div v-if="isUnderMinimum" class="relative p-4 border-2 border-red-300 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="font-pixel text-[10px] sm:text-xs text-red-800 tracking-wide">MINIMUM CALORIE WARNING</p>
              <p class="font-game text-sm text-red-600 mt-1">
                Target is below safe minimum of {{ MIN_CALORIES[gender] }} kcal. Consider a smaller deficit.
              </p>
            </div>
          </div>
        </div>

        <!-- Weight Change Projection -->
        <div v-if="weeklyWeightChange !== 0">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-amber-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">PROJECTED WEIGHT CHANGE</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="relative p-4 border-2 border-amber-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">PER WEEK</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-amber-700">
                {{ weeklyWeightChange > 0 ? '+' : '' }}{{ weeklyWeightChange }} kg
              </p>
            </div>
            <div class="relative p-4 border-2 border-amber-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">PER MONTH</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-amber-700">
                {{ monthlyWeightChange > 0 ? '+' : '' }}{{ monthlyWeightChange }} kg
              </p>
            </div>
          </div>
          <p class="font-game text-xs text-gray-500 mt-2 text-center">Based on 1 kg = 7,700 calories</p>
        </div>

        <!-- Quick Tips -->
        <div class="relative p-4 border-2 border-amber-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <h3 class="font-pixel text-[10px] sm:text-xs text-amber-800 mb-2 tracking-wide">QUICK TIPS</h3>
          <ul class="font-game text-sm text-amber-700 space-y-1">
            <li v-if="currentGoal.category === 'loss'" class="flex items-start gap-2">
              <span class="w-1.5 h-1.5 bg-amber-500 mt-1.5 flex-shrink-0" />
              <span>Aim for 0.5-1% body weight loss per week</span>
            </li>
            <li v-if="currentGoal.category === 'bulk'" class="flex items-start gap-2">
              <span class="w-1.5 h-1.5 bg-amber-500 mt-1.5 flex-shrink-0" />
              <span>Slow, controlled weight gain minimizes fat</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-1.5 h-1.5 bg-amber-500 mt-1.5 flex-shrink-0" />
              <span>Adjust calories based on 2-4 week progress</span>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT CALORIE TARGETS</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Your calorie target is based on your TDEE plus or minus an adjustment based on your goal.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HOW IT WORKS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Weight Loss:</strong> Eat below TDEE</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Maintenance:</strong> Eat at TDEE</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Muscle Gain:</strong> Eat above TDEE</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">SAFE GUIDELINES</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span>Slow cut: -250 cal (~0.25 kg/week)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span>Moderate cut: -500 cal (~0.5 kg/week)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span>Never go below 1200 kcal (women) or 1500 kcal (men)</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
