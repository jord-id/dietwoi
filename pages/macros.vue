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
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">YOUR GOAL</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="goal in GOALS"
            :key="goal.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="selectedGoal === goal.value
              ? 'border-pink-500'
              : 'border-gray-200 hover:border-gray-300'"
            @click="selectedGoal = goal.value"
          >
            <div v-if="selectedGoal === goal.value" class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
            <span class="block font-pixel text-[10px] sm:text-xs tracking-wide" :class="selectedGoal === goal.value ? 'text-pink-700' : 'text-gray-600'">{{ goal.label.toUpperCase() }}</span>
            <span class="block font-game text-xs text-gray-400 mt-1">{{ goal.description }}</span>
          </button>
        </div>
      </div>

      <!-- Diet Type Selection -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">DIET TYPE</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="diet in DIET_TYPES"
            :key="diet.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="selectedDiet === diet.value
              ? 'border-pink-500'
              : 'border-gray-200 hover:border-gray-300'"
            @click="selectedDiet = diet.value"
          >
            <div v-if="selectedDiet === diet.value" class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="selectedDiet === diet.value ? 'text-pink-700' : 'text-gray-600'">{{ diet.label.toUpperCase() }}</span>
          </button>
        </div>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- Calorie Target -->
        <div class="relative text-center p-6 border-2 border-pink-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">DAILY CALORIE TARGET</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {{ targetCalories.toLocaleString() }}
            </span>
            <span class="font-game text-lg text-gray-500">kcal</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">
            TDEE: {{ tdeeResult.tdee.toLocaleString() }} kcal
            <span v-if="currentPreset.calorieAdjust !== 0" class="text-pink-600">
              ({{ currentPreset.calorieAdjust > 0 ? '+' : '' }}{{ currentPreset.calorieAdjust }})
            </span>
          </p>
        </div>

        <!-- Macro Breakdown -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-pink-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">YOUR DAILY MACROS</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="relative p-4 border-2 border-red-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              <p class="font-pixel text-[10px] text-red-700 mb-1 tracking-wide">PROTEIN</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-red-600">{{ macros.protein.grams }}g</p>
              <p class="font-game text-xs text-gray-400">{{ macros.protein.percentage }}%</p>
            </div>
            <div class="relative p-4 border-2 border-amber-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <p class="font-pixel text-[10px] text-amber-700 mb-1 tracking-wide">CARBS</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-amber-600">{{ macros.carbs.grams }}g</p>
              <p class="font-game text-xs text-gray-400">{{ macros.carbs.percentage }}%</p>
            </div>
            <div class="relative p-4 border-2 border-purple-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
              <p class="font-pixel text-[10px] text-purple-700 mb-1 tracking-wide">FAT</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-purple-600">{{ macros.fat.grams }}g</p>
              <p class="font-game text-xs text-gray-400">{{ macros.fat.percentage }}%</p>
            </div>
          </div>
        </div>

        <!-- Protein per kg -->
        <div class="relative p-4 border-2 border-pink-200 bg-white flex items-center justify-between">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-pink-500" />
          <div class="pl-2">
            <p class="font-pixel text-[10px] sm:text-xs text-gray-700 tracking-wide">PROTEIN PER KG</p>
            <p class="font-game text-xs text-gray-500">Recommended: 1.6-2.2g/kg</p>
          </div>
          <div class="text-right">
            <span class="font-game text-2xl sm:text-3xl font-bold text-pink-700">{{ proteinPerKg }}</span>
            <span class="font-game text-sm text-gray-500">g/kg</span>
          </div>
        </div>

        <!-- Visual Bar -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-pink-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">MACRO SPLIT</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="h-6 border border-gray-300 flex">
            <div
              class="bg-red-500 flex items-center justify-center font-game text-xs text-white font-medium"
              :style="{ width: `${macros.protein.percentage}%` }"
            >
              {{ macros.protein.percentage }}%
            </div>
            <div
              class="bg-amber-500 flex items-center justify-center font-game text-xs text-white font-medium"
              :style="{ width: `${macros.carbs.percentage}%` }"
            >
              {{ macros.carbs.percentage }}%
            </div>
            <div
              class="bg-purple-500 flex items-center justify-center font-game text-xs text-white font-medium"
              :style="{ width: `${macros.fat.percentage}%` }"
            >
              {{ macros.fat.percentage }}%
            </div>
          </div>
          <div class="flex justify-between font-game text-xs mt-2">
            <span class="text-red-600">Protein</span>
            <span class="text-amber-600">Carbs</span>
            <span class="text-purple-600">Fat</span>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT MACROS</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Macronutrients (protein, carbs, fat) are the building blocks of your diet.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-red-700 mb-3 tracking-wide">PROTEIN</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>4 calories per gram</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Builds and repairs muscle</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-amber-700 mb-3 tracking-wide">CARBOHYDRATES</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span>4 calories per gram</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span>Primary energy source</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-purple-700 mb-3 tracking-wide">FAT</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span>9 calories per gram</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span>Essential for hormones</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
