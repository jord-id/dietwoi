<script setup lang="ts">
import type { BmrResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate - the calories your body burns at rest',
    shortDescription: 'Basal Metabolic Rate (BMR) is the number of calories your body needs to maintain basic functions while at rest.',
    path: '/bmr',
    color: 'orange',
    contentPath: 'calculators/bmr',
  },
  seo: {
    title: 'BMR Calculator - Calculate Your Basal Metabolic Rate',
    description: 'Free BMR calculator using the Mifflin-St Jeor equation. Find out how many calories your body burns at rest to plan your diet effectively.',
    path: '/bmr',
  },
  schema: {
    name: 'BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate (BMR) - the calories your body burns at rest',
    url: '/bmr',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'BMR Calculator', url: '/bmr' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
    { key: 'age', label: 'Age', type: 'slider', min: 15, max: 100, default: 30, unit: 'years' },
  ],
}

// Calculator setup using shared composable
const { calculate, activityMultipliers } = useBmr()

const { inputs, result } = useCalculatorSetup<BmrResult>(
  config,
  (i) => calculate({
    weight: Number(i.weight),
    height: Number(i.height),
    age: Number(i.age),
    gender: String(i.gender) as 'male' | 'female',
  })
)

// Activity level descriptions and colors
const activityDescriptions: Record<string, { name: string; description: string }> = {
  sedentary: { name: 'Sedentary', description: 'Little or no exercise' },
  light: { name: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  moderate: { name: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  active: { name: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  athlete: { name: 'Athlete', description: 'Very hard exercise, physical job' },
}

// Colors for activity levels (progression from low to high)
const activityColors: Record<string, { border: string; bar: string; value: string }> = {
  sedentary: { border: 'border-gray-200', bar: 'bg-gray-400', value: 'text-gray-600' },
  light: { border: 'border-blue-200', bar: 'bg-blue-500', value: 'text-blue-600' },
  moderate: { border: 'border-green-200', bar: 'bg-green-500', value: 'text-green-600' },
  active: { border: 'border-amber-200', bar: 'bg-amber-500', value: 'text-amber-600' },
  athlete: { border: 'border-orange-200', bar: 'bg-orange-500', value: 'text-orange-600' },
}
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- BMR Display -->
        <div class="relative text-center p-6 border-2 border-orange-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR BASAL METABOLIC RATE</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              {{ result.bmr.toLocaleString() }}
            </span>
            <span class="font-game text-lg text-gray-500">kcal/day</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">Calories burned at complete rest</p>
        </div>

        <!-- TDEE by Activity Level -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-orange-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">DAILY CALORIES BY ACTIVITY</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="space-y-2">
            <div
              v-for="(multiplier, level) in activityMultipliers"
              :key="level"
              class="relative flex items-center justify-between p-3 border-2 bg-white"
              :class="activityColors[level]?.border"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1" :class="activityColors[level]?.bar" />
              <div class="pl-2">
                <p class="font-pixel text-[10px] sm:text-xs text-gray-900 tracking-wide">{{ activityDescriptions[level].name.toUpperCase() }}</p>
                <p class="font-game text-sm text-gray-500">{{ activityDescriptions[level].description }}</p>
              </div>
              <div class="text-right">
                <p class="font-game text-xl font-bold" :class="activityColors[level]?.value">{{ result.tdee[level].toLocaleString() }}</p>
                <p class="font-game text-xs text-gray-400">kcal/day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT BMR</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Your BMR represents the minimum calories needed for basic body functions like breathing, circulation, and cell production while at complete rest.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">MIFFLIN-ST JEOR FORMULA</h3>
          <div class="relative p-4 border-2 border-orange-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
            <div class="font-mono text-sm sm:text-base text-orange-700 space-y-1">
              <p><strong>Men:</strong> (10 × weight) + (6.25 × height) - (5 × age) + 5</p>
              <p><strong>Women:</strong> (10 × weight) + (6.25 × height) - (5 × age) - 161</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FACTORS THAT AFFECT BMR</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span><strong>Age:</strong> BMR decreases with age</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span><strong>Muscle mass:</strong> More muscle = higher BMR</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span><strong>Gender:</strong> Men typically have higher BMR</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span><strong>Genetics:</strong> Individual variation exists</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
