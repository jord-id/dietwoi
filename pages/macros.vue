<script setup lang="ts">
import type { CalculatorConfig } from '~/types/calculator'
import type { ActivityLevel } from '~/composables/useCalculations'

const config: CalculatorConfig = {
  meta: {
    title: 'Macro Calculator',
    description: 'Calculate your optimal protein, carbs, and fat intake based on your goals',
    shortDescription: 'Find the right balance of macronutrients for weight loss, maintenance, or muscle gain.',
    path: '/macros',
    color: 'pink',
    contentPath: 'calculators/macros',
  },
  seo: {
    title: 'Macro Calculator - Protein, Carbs & Fat for Your Goals',
    description: 'Calculate your optimal macronutrient split. Get personalized protein, carbs, and fat targets for weight loss, maintenance, or muscle gain.',
    path: '/macros',
  },
  schema: {
    name: 'Macro Calculator',
    description: 'Calculate optimal macronutrient intake for your fitness goals',
    url: '/macros',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Macro Calculator', url: '/macros' },
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
type Goal = 'lose' | 'maintain' | 'gain'
type DietType = 'balanced' | 'highProtein' | 'lowCarb' | 'keto'

interface MacroPreset {
  label: string
  protein: number
  carbs: number
  fat: number
  calorieAdjust: number
}

const DIET_PRESETS: Record<DietType, Record<Goal, MacroPreset>> = {
  balanced: {
    lose: { label: 'Balanced', protein: 30, carbs: 40, fat: 30, calorieAdjust: -500 },
    maintain: { label: 'Balanced', protein: 25, carbs: 50, fat: 25, calorieAdjust: 0 },
    gain: { label: 'Balanced', protein: 25, carbs: 50, fat: 25, calorieAdjust: 300 },
  },
  highProtein: {
    lose: { label: 'High Protein', protein: 40, carbs: 30, fat: 30, calorieAdjust: -500 },
    maintain: { label: 'High Protein', protein: 35, carbs: 40, fat: 25, calorieAdjust: 0 },
    gain: { label: 'High Protein', protein: 35, carbs: 45, fat: 20, calorieAdjust: 300 },
  },
  lowCarb: {
    lose: { label: 'Low Carb', protein: 35, carbs: 20, fat: 45, calorieAdjust: -500 },
    maintain: { label: 'Low Carb', protein: 30, carbs: 25, fat: 45, calorieAdjust: 0 },
    gain: { label: 'Low Carb', protein: 30, carbs: 30, fat: 40, calorieAdjust: 300 },
  },
  keto: {
    lose: { label: 'Keto', protein: 25, carbs: 5, fat: 70, calorieAdjust: -500 },
    maintain: { label: 'Keto', protein: 20, carbs: 5, fat: 75, calorieAdjust: 0 },
    gain: { label: 'Keto', protein: 20, carbs: 10, fat: 70, calorieAdjust: 300 },
  },
}

const GOALS: { value: Goal; label: string; description: string }[] = [
  { value: 'lose', label: 'Lose Weight', description: '-500 cal deficit' },
  { value: 'maintain', label: 'Maintain', description: 'Stay at current' },
  { value: 'gain', label: 'Build Muscle', description: '+300 cal surplus' },
]

const DIET_TYPES: { value: DietType; label: string }[] = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'highProtein', label: 'High Protein' },
  { value: 'lowCarb', label: 'Low Carb' },
  { value: 'keto', label: 'Keto' },
]

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
const selectedDiet = ref<DietType>('balanced')

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

const currentPreset = computed(() => {
  return DIET_PRESETS[selectedDiet.value][selectedGoal.value]
})

const targetCalories = computed(() => {
  return tdeeResult.value.tdee + currentPreset.value.calorieAdjust
})

const macros = computed(() => {
  const cals = targetCalories.value
  const preset = currentPreset.value

  const proteinCals = cals * (preset.protein / 100)
  const carbsCals = cals * (preset.carbs / 100)
  const fatCals = cals * (preset.fat / 100)

  return {
    protein: {
      grams: Math.round(proteinCals / 4),
      calories: Math.round(proteinCals),
      percentage: preset.protein,
    },
    carbs: {
      grams: Math.round(carbsCals / 4),
      calories: Math.round(carbsCals),
      percentage: preset.carbs,
    },
    fat: {
      grams: Math.round(fatCals / 9),
      calories: Math.round(fatCals),
      percentage: preset.fat,
    },
  }
})

const proteinPerKg = computed(() => {
  const weight = inputs.value.weight as number
  return (macros.value.protein.grams / weight).toFixed(1)
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Goal Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">Your Goal</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="goal in GOALS"
            :key="goal.value"
            class="p-3 rounded-xl border-2 transition-all text-center"
            :class="selectedGoal === goal.value
              ? 'border-pink-400 bg-pink-50 text-pink-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'"
            @click="selectedGoal = goal.value"
          >
            <span class="block text-sm font-medium">{{ goal.label }}</span>
            <span class="block text-xs text-gray-400 mt-1">{{ goal.description }}</span>
          </button>
        </div>
      </div>

      <!-- Diet Type Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Diet Type</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="diet in DIET_TYPES"
            :key="diet.value"
            class="p-3 rounded-xl border-2 transition-all text-center"
            :class="selectedDiet === diet.value
              ? 'border-pink-400 bg-pink-50 text-pink-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'"
            @click="selectedDiet = diet.value"
          >
            <span class="text-sm font-medium">{{ diet.label }}</span>
          </button>
        </div>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- Calorie Target -->
        <div class="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl">
          <p class="text-sm text-gray-500 mb-2">Daily Calorie Target</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="text-5xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {{ targetCalories.toLocaleString() }}
            </span>
            <span class="text-gray-500 text-lg">kcal</span>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            TDEE: {{ tdeeResult.tdee.toLocaleString() }} kcal
            <span v-if="currentPreset.calorieAdjust !== 0" class="text-pink-600">
              ({{ currentPreset.calorieAdjust > 0 ? '+' : '' }}{{ currentPreset.calorieAdjust }})
            </span>
          </p>
        </div>

        <!-- Macro Breakdown -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Your Daily Macros</h3>
          <div class="grid grid-cols-3 gap-3">
            <div class="p-4 rounded-xl bg-red-50 text-center">
              <p class="text-xs text-gray-500 mb-1">Protein</p>
              <p class="text-2xl font-bold text-red-600">{{ macros.protein.grams }}g</p>
              <p class="text-xs text-gray-400">{{ macros.protein.percentage }}%</p>
            </div>
            <div class="p-4 rounded-xl bg-amber-50 text-center">
              <p class="text-xs text-gray-500 mb-1">Carbs</p>
              <p class="text-2xl font-bold text-amber-600">{{ macros.carbs.grams }}g</p>
              <p class="text-xs text-gray-400">{{ macros.carbs.percentage }}%</p>
            </div>
            <div class="p-4 rounded-xl bg-purple-50 text-center">
              <p class="text-xs text-gray-500 mb-1">Fat</p>
              <p class="text-2xl font-bold text-purple-600">{{ macros.fat.grams }}g</p>
              <p class="text-xs text-gray-400">{{ macros.fat.percentage }}%</p>
            </div>
          </div>
        </div>

        <!-- Protein per kg -->
        <div class="p-4 rounded-xl bg-gray-50 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700">Protein per kg body weight</p>
            <p class="text-xs text-gray-500">Recommended: 1.6-2.2g/kg for muscle building</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold text-gray-800">{{ proteinPerKg }}</span>
            <span class="text-sm text-gray-500">g/kg</span>
          </div>
        </div>

        <!-- Visual Bar -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Macro Split</h3>
          <div class="h-6 rounded-full overflow-hidden flex">
            <div
              class="bg-red-400 flex items-center justify-center text-xs text-white font-medium"
              :style="{ width: `${macros.protein.percentage}%` }"
            >
              {{ macros.protein.percentage }}%
            </div>
            <div
              class="bg-amber-400 flex items-center justify-center text-xs text-white font-medium"
              :style="{ width: `${macros.carbs.percentage}%` }"
            >
              {{ macros.carbs.percentage }}%
            </div>
            <div
              class="bg-purple-400 flex items-center justify-center text-xs text-white font-medium"
              :style="{ width: `${macros.fat.percentage}%` }"
            >
              {{ macros.fat.percentage }}%
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>Protein</span>
            <span>Carbs</span>
            <span>Fat</span>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About Macros</h2>
      <div class="prose prose-gray max-w-none">
        <p>Macronutrients (protein, carbs, fat) are the building blocks of your diet. The right balance depends on your goals.</p>

        <h3 class="text-lg font-medium mt-4 mb-2">Protein</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>4 calories per gram</li>
          <li>Builds and repairs muscle</li>
          <li>Aim for 1.6-2.2g/kg for muscle gain</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">Carbohydrates</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>4 calories per gram</li>
          <li>Primary energy source</li>
          <li>Important for high-intensity exercise</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">Fat</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>9 calories per gram</li>
          <li>Essential for hormones</li>
          <li>Minimum 0.5g/kg for health</li>
        </ul>
      </div>
    </template>
  </CalculatorPage>
</template>
