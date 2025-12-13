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
        <div class="relative text-center p-6 border-2 border-blue-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR DAILY CALORIE NEEDS</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {{ result.tdee.toLocaleString() }}
            </span>
            <span class="font-game text-lg text-gray-500">kcal/day</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">BMR: {{ result.bmr.toLocaleString() }} kcal</p>
        </div>

        <!-- Calorie Goals -->
        <div v-if="calorieGoals">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-blue-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">CALORIE GOALS</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="relative p-4 border-2 border-sky-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
              <p class="font-pixel text-[10px] text-sky-700 mb-1 tracking-wide">LOSS</p>
              <p class="font-game text-lg sm:text-xl font-bold text-sky-600">{{ calorieGoals.loss.toLocaleString() }}</p>
              <p class="font-game text-xs text-gray-400">-500 deficit</p>
            </div>
            <div class="relative p-4 border-2 border-green-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
              <p class="font-pixel text-[10px] text-green-700 mb-1 tracking-wide">MAINTAIN</p>
              <p class="font-game text-lg sm:text-xl font-bold text-green-600">{{ calorieGoals.maintain.toLocaleString() }}</p>
              <p class="font-game text-xs text-gray-400">current</p>
            </div>
            <div class="relative p-4 border-2 border-amber-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <p class="font-pixel text-[10px] text-amber-700 mb-1 tracking-wide">GAIN</p>
              <p class="font-game text-lg sm:text-xl font-bold text-amber-600">{{ calorieGoals.gain.toLocaleString() }}</p>
              <p class="font-game text-xs text-gray-400">+300 surplus</p>
            </div>
          </div>
        </div>

        <!-- Macros -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-blue-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">RECOMMENDED MACROS</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="relative p-4 border-2 border-red-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              <p class="font-pixel text-[10px] text-red-700 mb-1 tracking-wide">PROTEIN</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-red-600">{{ result.macros.protein.grams }}g</p>
              <p class="font-game text-xs text-gray-400">{{ result.macros.protein.percentage }}%</p>
            </div>
            <div class="relative p-4 border-2 border-amber-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <p class="font-pixel text-[10px] text-amber-700 mb-1 tracking-wide">CARBS</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-amber-600">{{ result.macros.carbs.grams }}g</p>
              <p class="font-game text-xs text-gray-400">{{ result.macros.carbs.percentage }}%</p>
            </div>
            <div class="relative p-4 border-2 border-purple-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
              <p class="font-pixel text-[10px] text-purple-700 mb-1 tracking-wide">FAT</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-purple-600">{{ result.macros.fat.grams }}g</p>
              <p class="font-game text-xs text-gray-400">{{ result.macros.fat.percentage }}%</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT TDEE</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">TDEE is calculated by multiplying your BMR by an activity factor. It represents all the calories you burn in a day.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FORMULA</h3>
          <div class="relative p-4 border-2 border-blue-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
            <p class="font-mono text-base sm:text-lg text-blue-700">TDEE = BMR × Activity Multiplier</p>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HOW TO USE TDEE</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Weight Loss:</strong> Eat 500 calories below TDEE for ~0.5kg/week loss</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Maintenance:</strong> Eat at your TDEE to maintain weight</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Weight Gain:</strong> Eat 300-500 above TDEE for muscle gain</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
