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

const selectedGoal = ref<Goal>('maintain')

// Calculations
const tdeeResult = computed(() => {
  return calculateTdee({
    weight: inputs.value.weight as number,
    height: inputs.value.height as number,
    age: inputs.value.age as number,
    gender: inputs.value.gender as 'male' | 'female',
    activityLevel: inputs.value.activityLevel as ActivityLevel,
  })
})

const currentGoal = computed(() => GOALS[selectedGoal.value])

const targetCalories = computed(() => {
  const target = tdeeResult.value.tdee + currentGoal.value.calorieAdjust
  const minCal = MIN_CALORIES[inputs.value.gender as 'male' | 'female']

  // Don't go below safe minimums
  return Math.max(target, minCal)
})

const isUnderMinimum = computed(() => {
  const target = tdeeResult.value.tdee + currentGoal.value.calorieAdjust
  const minCal = MIN_CALORIES[inputs.value.gender as 'male' | 'female']
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
        <label class="block text-sm font-medium text-gray-700 mb-3">Your Goal</label>

        <!-- Weight Loss Goals -->
        <div class="mb-2">
          <p class="text-xs text-gray-500 mb-2">Weight Loss</p>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="goal in lossGoals"
              :key="goal"
              class="p-3 rounded-xl border-2 transition-all text-center"
              :class="selectedGoal === goal
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'"
              @click="selectedGoal = goal"
            >
              <span class="block text-sm font-medium">{{ GOALS[goal].label }}</span>
              <span class="block text-xs text-gray-400 mt-1">{{ GOALS[goal].description }}</span>
            </button>
          </div>
        </div>

        <!-- Maintain -->
        <div class="mb-2">
          <p class="text-xs text-gray-500 mb-2">Maintenance</p>
          <button
            class="w-full p-3 rounded-xl border-2 transition-all text-center"
            :class="selectedGoal === 'maintain'
              ? 'border-amber-400 bg-amber-50 text-amber-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'"
            @click="selectedGoal = 'maintain'"
          >
            <span class="block text-sm font-medium">{{ GOALS.maintain.label }}</span>
            <span class="block text-xs text-gray-400 mt-1">{{ GOALS.maintain.description }}</span>
          </button>
        </div>

        <!-- Muscle Gain Goals -->
        <div>
          <p class="text-xs text-gray-500 mb-2">Muscle Gain</p>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="goal in bulkGoals"
              :key="goal"
              class="p-3 rounded-xl border-2 transition-all text-center"
              :class="selectedGoal === goal
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'"
              @click="selectedGoal = goal"
            >
              <span class="block text-sm font-medium">{{ GOALS[goal].label }}</span>
              <span class="block text-xs text-gray-400 mt-1">{{ GOALS[goal].description }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- TDEE Reference -->
        <div class="p-4 rounded-xl bg-gray-50">
          <p class="text-xs text-gray-500 mb-1">Your Daily Energy Expenditure (TDEE)</p>
          <p class="text-2xl font-bold text-gray-800">{{ tdeeResult.tdee.toLocaleString() }} <span class="text-sm text-gray-500">kcal</span></p>
        </div>

        <!-- Target Calories -->
        <div class="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl">
          <p class="text-sm text-gray-500 mb-2">Daily Calorie Target</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="text-5xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              {{ targetCalories.toLocaleString() }}
            </span>
            <span class="text-gray-500 text-lg">kcal</span>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            <span v-if="currentGoal.calorieAdjust !== 0" class="text-amber-600">
              {{ currentGoal.calorieAdjust > 0 ? '+' : '' }}{{ currentGoal.calorieAdjust }} from TDEE
            </span>
            <span v-else class="text-gray-600">At maintenance</span>
          </p>
        </div>

        <!-- Safety Warning -->
        <div v-if="isUnderMinimum" class="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-800">Minimum Calorie Warning</p>
              <p class="text-xs text-red-600 mt-1">
                Your target is below the safe minimum of {{ MIN_CALORIES[inputs.gender as 'male' | 'female'] }} kcal for {{ inputs.gender === 'male' ? 'men' : 'women' }}.
                Calorie intake has been adjusted to safe minimum. Consider a smaller deficit.
              </p>
            </div>
          </div>
        </div>

        <!-- Weight Change Projection -->
        <div v-if="weeklyWeightChange !== 0">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Projected Weight Change</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 text-center">
              <p class="text-xs text-gray-500 mb-1">Per Week</p>
              <p class="text-2xl font-bold" :class="weeklyWeightChange < 0 ? 'text-green-600' : 'text-orange-600'">
                {{ weeklyWeightChange > 0 ? '+' : '' }}{{ weeklyWeightChange }} kg
              </p>
            </div>
            <div class="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 text-center">
              <p class="text-xs text-gray-500 mb-1">Per Month</p>
              <p class="text-2xl font-bold" :class="monthlyWeightChange < 0 ? 'text-green-600' : 'text-orange-600'">
                {{ monthlyWeightChange > 0 ? '+' : '' }}{{ monthlyWeightChange }} kg
              </p>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2 text-center">Based on 1 kg = 7,700 calories</p>
        </div>

        <!-- Quick Tips -->
        <div class="p-4 rounded-xl bg-blue-50">
          <h3 class="text-sm font-medium text-blue-900 mb-2">Quick Tips</h3>
          <ul class="text-xs text-blue-700 space-y-1">
            <li v-if="currentGoal.category === 'loss'">• Aim for 0.5-1% body weight loss per week for sustainable results</li>
            <li v-if="currentGoal.category === 'loss'">• Higher protein intake (1.6-2.2g/kg) helps preserve muscle mass</li>
            <li v-if="currentGoal.category === 'bulk'">• Slow, controlled weight gain minimizes fat accumulation</li>
            <li v-if="currentGoal.category === 'bulk'">• Track weekly averages, not daily fluctuations</li>
            <li>• Adjust calories based on your actual progress over 2-4 weeks</li>
          </ul>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About Calorie Targets</h2>
      <div class="prose prose-gray max-w-none">
        <p>Your calorie target is based on your TDEE (Total Daily Energy Expenditure) plus or minus an adjustment based on your goal.</p>

        <h3 class="text-lg font-medium mt-4 mb-2">How It Works</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li><strong>Weight Loss:</strong> Eat below TDEE to create a calorie deficit</li>
          <li><strong>Maintenance:</strong> Eat at TDEE to maintain current weight</li>
          <li><strong>Muscle Gain:</strong> Eat above TDEE to provide surplus for growth</li>
          <li><strong>1 kg body fat ≈ 7,700 calories</strong> of energy stored</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">Safe Deficit Guidelines</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Slow cut (-250 cal): ~0.25 kg/week loss, easiest to maintain</li>
          <li>Moderate cut (-500 cal): ~0.5 kg/week loss, balanced approach</li>
          <li>Aggressive cut (-750 cal): ~0.75 kg/week loss, harder to sustain</li>
          <li>Never go below 1200 kcal (women) or 1500 kcal (men) daily</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">Bulking Guidelines</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Lean bulk (+250 cal): ~0.25 kg/week gain, minimal fat gain</li>
          <li>Standard bulk (+500 cal): ~0.5 kg/week gain, faster muscle growth</li>
          <li>Combine with resistance training for best results</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">Important Notes</h3>
        <p class="text-sm text-gray-600">These are starting estimates. Monitor your actual weight change over 2-4 weeks and adjust calories by 100-200 if progress stalls. Weight fluctuates daily due to water retention, so track weekly averages.</p>
      </div>
    </template>
  </CalculatorPage>
</template>
