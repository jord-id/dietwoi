<script setup lang="ts">
import type { CalculatorConfig } from '~/types/calculator'
import type { ActivityLevel, WeightGoal } from '~/composables/useCalculations'

const config: CalculatorConfig = {
  meta: {
    title: 'Calorie Deficit Calculator',
    description: 'Calculate your target calories for weight loss or gain with safe deficit recommendations',
    shortDescription: 'Find your optimal calorie target based on TDEE and weight goals. Includes safety minimums and weekly weight change projections.',
    path: '/calorie-deficit',
    color: 'green',
    contentPath: 'calculators/calorie-deficit',
  },
  seo: {
    title: 'Calorie Deficit Calculator - Safe Weight Loss & Gain Targets',
    description: 'Calculate your calorie deficit or surplus for safe weight management. Get personalized targets with weekly projections based on your TDEE.',
    path: '/calorie-deficit',
  },
  schema: {
    name: 'Calorie Deficit Calculator',
    description: 'Calculate target calories for weight loss or gain goals',
    url: '/calorie-deficit',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Calorie Deficit Calculator', url: '/calorie-deficit' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
    { key: 'age', label: 'Age', type: 'slider', min: 15, max: 100, default: 30, unit: 'years' },
    { key: 'activityLevel', label: 'Activity Level', type: 'activity', default: 'moderate' },
  ],
}

// Goal options
const GOALS: { value: WeightGoal; label: string; description: string }[] = [
  { value: 'slow-loss', label: 'Slow Loss', description: '-250 cal' },
  { value: 'moderate-loss', label: 'Moderate Loss', description: '-500 cal' },
  { value: 'aggressive-loss', label: 'Aggressive Loss', description: '-750 cal' },
  { value: 'slow-gain', label: 'Slow Gain', description: '+250 cal' },
  { value: 'standard-gain', label: 'Standard Gain', description: '+500 cal' },
]

// State
const { calculate } = useCalorieDeficit()

const inputs = ref<Record<string, number | string>>({
  gender: 'male',
  weight: 70,
  height: 170,
  age: 30,
  activityLevel: 'moderate',
})

// Type-safe accessors
const weight = computed(() => Number(inputs.value.weight))
const height = computed(() => Number(inputs.value.height))
const age = computed(() => Number(inputs.value.age))
const gender = computed(() => inputs.value.gender as 'male' | 'female')
const activityLevel = computed(() => inputs.value.activityLevel as ActivityLevel)

const selectedGoal = ref<WeightGoal>('moderate-loss')

// Calculations
const result = computed(() => {
  return calculate({
    weight: weight.value,
    height: height.value,
    age: age.value,
    gender: gender.value,
    activityLevel: activityLevel.value,
    goal: selectedGoal.value,
  })
})

const monthlyChange = computed(() => {
  return Math.round(result.value.weeklyChange * 4.33 * 100) / 100
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Goal Selection -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">WEIGHT GOAL</label>
        <div class="grid grid-cols-3 gap-2 mb-2">
          <button
            v-for="goal in GOALS.slice(0, 3)"
            :key="goal.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="selectedGoal === goal.value
              ? 'border-green-500'
              : 'border-gray-200 hover:border-gray-300'"
            @click="selectedGoal = goal.value"
          >
            <div v-if="selectedGoal === goal.value" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="block font-pixel text-[10px] sm:text-xs tracking-wide" :class="selectedGoal === goal.value ? 'text-green-700' : 'text-gray-600'">{{ goal.label.toUpperCase() }}</span>
            <span class="block font-game text-xs text-gray-400 mt-1">{{ goal.description }}</span>
          </button>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="goal in GOALS.slice(3)"
            :key="goal.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="selectedGoal === goal.value
              ? 'border-green-500'
              : 'border-gray-200 hover:border-gray-300'"
            @click="selectedGoal = goal.value"
          >
            <div v-if="selectedGoal === goal.value" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="block font-pixel text-[10px] sm:text-xs tracking-wide" :class="selectedGoal === goal.value ? 'text-green-700' : 'text-gray-600'">{{ goal.label.toUpperCase() }}</span>
            <span class="block font-game text-xs text-gray-400 mt-1">{{ goal.description }}</span>
          </button>
        </div>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- TDEE Reference -->
        <div class="relative p-4 border-2 border-green-200 bg-white">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
          <p class="pl-2 font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">YOUR TDEE</p>
          <p class="pl-2 font-game text-2xl sm:text-3xl font-bold text-green-700">{{ result.tdee.toLocaleString() }} <span class="text-sm text-gray-500">kcal</span></p>
        </div>

        <!-- Target Calories (prominent) -->
        <div class="relative text-center p-6 border-2 border-green-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">DAILY CALORIE TARGET</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              {{ result.targetCalories.toLocaleString() }}
            </span>
            <span class="font-game text-lg text-gray-500">kcal</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">
            <span class="text-green-600">
              {{ result.deficit > 0 ? `-${result.deficit}` : `+${Math.abs(result.deficit)}` }} from TDEE
            </span>
          </p>
        </div>

        <!-- Safety Warning -->
        <div v-if="result.isBelowMinimum" class="relative p-4 border-2 border-red-300 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="font-pixel text-[10px] sm:text-xs text-red-800 tracking-wide">MINIMUM CALORIE WARNING</p>
              <p class="font-game text-sm text-red-600 mt-1">
                Target raised to safe minimum of {{ result.minimumSafe }} kcal. Consider a smaller deficit or increasing activity.
              </p>
            </div>
          </div>
        </div>

        <!-- Weekly Weight Change -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-green-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">PROJECTED WEIGHT CHANGE</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="relative p-4 border-2 border-green-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">PER WEEK</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-green-700">
                {{ result.weeklyChange > 0 ? '+' : '' }}{{ result.weeklyChange }} kg
              </p>
            </div>
            <div class="relative p-4 border-2 border-green-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">PER MONTH</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-green-700">
                {{ monthlyChange > 0 ? '+' : '' }}{{ monthlyChange }} kg
              </p>
            </div>
          </div>
          <p class="font-game text-xs text-gray-500 mt-2 text-center">Based on 7,700 kcal per kg of body fat</p>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT CALORIE DEFICIT</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">A calorie deficit occurs when you consume fewer calories than your body burns. This forces your body to use stored energy (fat) for fuel, leading to weight loss.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HOW IT WORKS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Your TDEE is calculated using the Mifflin-St Jeor equation</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Approximately 7,700 kcal deficit = 1 kg fat loss</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>A 500 kcal/day deficit yields ~0.5 kg/week loss</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">SAFETY GUIDELINES</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Minimum 1,500 kcal/day for men, 1,200 kcal/day for women</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Deficits over 750 kcal increase muscle loss risk</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Aim for 0.5-1% of body weight per week (Hall et al., 2011)</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
