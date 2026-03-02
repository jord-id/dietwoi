<script setup lang="ts">
import type { CalculatorConfig } from '~/types/calculator'
import type { ActivityLevel, MealPattern } from '~/composables/useCalculations'

const config: CalculatorConfig = {
  meta: {
    title: 'Meal Calories Calculator',
    description: 'Distribute your daily calories across meals based on your preferred eating pattern',
    shortDescription: 'Split your TDEE into meal-by-meal calorie targets. Choose from traditional, large lunch, intermittent fasting, or 5-meal patterns.',
    path: '/meal-calories',
    color: 'amber',
    contentPath: 'calculators/meal-calories',
  },
  seo: {
    title: 'Meal Calories Calculator - Per-Meal Calorie Breakdown',
    description: 'Distribute your daily calories across meals. Get per-meal calorie targets for traditional, intermittent fasting, or multi-meal eating patterns.',
    path: '/meal-calories',
  },
  schema: {
    name: 'Meal Calories Calculator',
    description: 'Distribute daily calories across meals based on eating patterns',
    url: '/meal-calories',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Meal Calories Calculator', url: '/meal-calories' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
    { key: 'age', label: 'Age', type: 'slider', min: 15, max: 100, default: 30, unit: 'years' },
    { key: 'activityLevel', label: 'Activity Level', type: 'activity', default: 'moderate' },
  ],
}

// Pattern options
const PATTERN_OPTIONS: { value: MealPattern; label: string }[] = [
  { value: 'traditional', label: 'Traditional' },
  { value: 'large-lunch', label: 'Large Lunch' },
  { value: 'intermittent', label: 'Intermittent Fasting' },
  { value: 'five-meals', label: '5 Meals' },
]

// State
const { calculate, patterns } = useMealCalories()

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

const selectedPattern = ref<MealPattern>('traditional')

// Calculations
const result = computed(() => {
  return calculate({
    weight: weight.value,
    height: height.value,
    age: age.value,
    gender: gender.value,
    activityLevel: activityLevel.value,
    pattern: selectedPattern.value,
  })
})

const patternLabel = computed(() => {
  return patterns[selectedPattern.value].label
})

// Colors for meal cards
const mealColors = ['amber', 'orange', 'red', 'emerald', 'sky']
const getMealBorder = (index: number) => {
  const colors = ['border-amber-200', 'border-orange-200', 'border-red-200', 'border-emerald-200', 'border-sky-200']
  return colors[index % colors.length]
}
const getMealBar = (index: number) => {
  const colors = ['bg-amber-500', 'bg-orange-500', 'bg-red-500', 'bg-emerald-500', 'bg-sky-500']
  return colors[index % colors.length]
}
const getMealText = (index: number) => {
  const colors = ['text-amber-700', 'text-orange-700', 'text-red-700', 'text-emerald-700', 'text-sky-700']
  return colors[index % colors.length]
}
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Meal Pattern Selection -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">MEAL PATTERN</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="pattern in PATTERN_OPTIONS"
            :key="pattern.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="selectedPattern === pattern.value
              ? 'border-amber-500'
              : 'border-gray-200 hover:border-gray-300'"
            @click="selectedPattern = pattern.value"
          >
            <div v-if="selectedPattern === pattern.value" class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="selectedPattern === pattern.value ? 'text-amber-700' : 'text-gray-600'">{{ pattern.label.toUpperCase() }}</span>
          </button>
        </div>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- TDEE + Pattern -->
        <div class="relative text-center p-6 border-2 border-amber-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">DAILY CALORIES (TDEE)</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              {{ result.tdee.toLocaleString() }}
            </span>
            <span class="font-game text-lg text-gray-500">kcal</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">{{ patternLabel }}</p>
        </div>

        <!-- Per-Meal Breakdown Cards -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-amber-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">MEAL BREAKDOWN</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="space-y-3">
            <div
              v-for="(meal, index) in result.meals"
              :key="meal.name"
              class="relative p-4 border-2 bg-white flex items-center justify-between"
              :class="getMealBorder(index)"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1" :class="getMealBar(index)" />
              <div class="pl-2">
                <p class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="getMealText(index)">{{ meal.name.toUpperCase() }}</p>
                <p class="font-game text-xs text-gray-400">{{ meal.percentage }}% of daily</p>
              </div>
              <div class="text-right">
                <span class="font-game text-2xl sm:text-3xl font-bold" :class="getMealText(index)">{{ meal.calories }}</span>
                <span class="font-game text-sm text-gray-500 ml-1">kcal</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Visual Bar -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-amber-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">CALORIE SPLIT</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="h-6 border border-gray-300 flex">
            <div
              v-for="(meal, index) in result.meals"
              :key="meal.name"
              class="flex items-center justify-center font-game text-xs text-white font-medium"
              :class="getMealBar(index)"
              :style="{ width: `${meal.percentage}%` }"
            >
              {{ meal.percentage }}%
            </div>
          </div>
          <div class="flex justify-between font-game text-xs mt-2">
            <span
              v-for="(meal, index) in result.meals"
              :key="meal.name"
              :class="getMealText(index)"
            >
              {{ meal.name }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT MEAL CALORIES</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Distributing calories across meals helps with planning and portion control. The best pattern is the one you can stick to consistently.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">WHAT RESEARCH SAYS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span>Meal timing has minimal impact on weight loss when total calories are equal (Schoenfeld et al., 2015)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span>Total daily intake matters more than how you split it</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span>Consistency with your chosen pattern is key</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">PATTERN TIPS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Traditional:</strong> Balanced approach, good for most people</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Intermittent Fasting:</strong> Can help with appetite control</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>5 Meals:</strong> Good for athletes or those who prefer frequent eating</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
