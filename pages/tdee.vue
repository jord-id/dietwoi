<script setup lang="ts">
import type { TdeeResult, ActivityLevel } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'TDEE Calculator',
    description: 'Calculate your Total Daily Energy Expenditure including activity level',
    shortDescription: 'Total Daily Energy Expenditure (TDEE) is the total calories you burn each day, including exercise and daily activities.',
    path: '/tdee',
    color: 'blue',
    contentPath: 'calculators/tdee',
  },
  seo: {
    title: 'TDEE Calculator - Total Daily Energy Expenditure',
    description: 'Calculate your Total Daily Energy Expenditure (TDEE) to find out how many calories you burn per day including exercise. Plan your diet for weight loss or muscle gain.',
    path: '/tdee',
  },
  schema: {
    name: 'TDEE Calculator',
    description: 'Calculate your Total Daily Energy Expenditure including activity level',
    url: '/tdee',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'TDEE Calculator', url: '/tdee' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
    { key: 'age', label: 'Age', type: 'slider', min: 15, max: 100, default: 30, unit: 'years' },
    { key: 'activityLevel', label: 'Activity Level', type: 'activity', default: 'moderate' },
  ],
}

// Calculator
const { calculate } = useTdee()

const inputs = ref<Record<string, number | string>>({
  gender: 'male',
  weight: 70,
  height: 170,
  age: 30,
  activityLevel: 'moderate',
})

const result = ref<TdeeResult | null>(null)

const calculateTdee = () => {
  result.value = calculate({
    weight: inputs.value.weight as number,
    height: inputs.value.height as number,
    age: inputs.value.age as number,
    gender: inputs.value.gender as 'male' | 'female',
    activityLevel: inputs.value.activityLevel as ActivityLevel,
  })
}

onMounted(calculateTdee)
watch(inputs, calculateTdee, { deep: true })

// Calorie goals
const calorieGoals = computed(() => {
  if (!result.value) return null
  return {
    loss: Math.round(result.value.tdee - 500),
    maintain: result.value.tdee,
    gain: Math.round(result.value.tdee + 300),
  }
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- TDEE Display -->
        <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
          <p class="text-sm text-gray-500 mb-2">Your Daily Calorie Needs</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {{ result.tdee.toLocaleString() }}
            </span>
            <span class="text-gray-500 text-lg">kcal/day</span>
          </div>
          <p class="text-sm text-gray-500 mt-2">BMR: {{ result.bmr.toLocaleString() }} kcal</p>
        </div>

        <!-- Calorie Goals -->
        <div v-if="calorieGoals">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Calorie Goals</h3>
          <div class="grid grid-cols-3 gap-3">
            <div class="p-4 rounded-xl bg-green-50 text-center">
              <p class="text-xs text-gray-500 mb-1">Weight Loss</p>
              <p class="text-lg font-bold text-green-600">{{ calorieGoals.loss.toLocaleString() }}</p>
              <p class="text-xs text-gray-400">-500 deficit</p>
            </div>
            <div class="p-4 rounded-xl bg-blue-50 text-center">
              <p class="text-xs text-gray-500 mb-1">Maintain</p>
              <p class="text-lg font-bold text-blue-600">{{ calorieGoals.maintain.toLocaleString() }}</p>
              <p class="text-xs text-gray-400">current</p>
            </div>
            <div class="p-4 rounded-xl bg-orange-50 text-center">
              <p class="text-xs text-gray-500 mb-1">Weight Gain</p>
              <p class="text-lg font-bold text-orange-600">{{ calorieGoals.gain.toLocaleString() }}</p>
              <p class="text-xs text-gray-400">+300 surplus</p>
            </div>
          </div>
        </div>

        <!-- Macros -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Recommended Macros</h3>
          <div class="grid grid-cols-3 gap-3">
            <div class="p-4 rounded-xl bg-red-50">
              <p class="text-xs text-gray-500 mb-1">Protein</p>
              <p class="text-xl font-bold text-red-600">{{ result.macros.protein.grams }}g</p>
              <p class="text-xs text-gray-400">{{ result.macros.protein.percentage }}%</p>
            </div>
            <div class="p-4 rounded-xl bg-amber-50">
              <p class="text-xs text-gray-500 mb-1">Carbs</p>
              <p class="text-xl font-bold text-amber-600">{{ result.macros.carbs.grams }}g</p>
              <p class="text-xs text-gray-400">{{ result.macros.carbs.percentage }}%</p>
            </div>
            <div class="p-4 rounded-xl bg-purple-50">
              <p class="text-xs text-gray-500 mb-1">Fat</p>
              <p class="text-xl font-bold text-purple-600">{{ result.macros.fat.grams }}g</p>
              <p class="text-xs text-gray-400">{{ result.macros.fat.percentage }}%</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About TDEE</h2>
      <div class="prose prose-gray max-w-none">
        <p>TDEE is calculated by multiplying your BMR by an activity factor. It represents all the calories you burn in a day.</p>
        <h3 class="text-lg font-medium mt-4 mb-2">Formula</h3>
        <p class="font-mono text-sm bg-gray-50 p-3 rounded-lg">TDEE = BMR × Activity Multiplier</p>
        <h3 class="text-lg font-medium mt-4 mb-2">How to Use TDEE</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li><strong>Weight Loss:</strong> Eat 500 calories below TDEE for ~0.5kg/week loss</li>
          <li><strong>Maintenance:</strong> Eat at your TDEE to maintain weight</li>
          <li><strong>Weight Gain:</strong> Eat 300-500 above TDEE for muscle gain</li>
        </ul>
      </div>
    </template>
  </CalculatorPage>
</template>
