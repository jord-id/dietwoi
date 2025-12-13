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

// Calculator
const { calculate, activityMultipliers } = useBmr()

const inputs = ref<Record<string, number | string>>({
  gender: 'male',
  weight: 70,
  height: 170,
  age: 30,
})

const result = ref<BmrResult | null>(null)

const calculateBmr = () => {
  result.value = calculate({
    weight: inputs.value.weight as number,
    height: inputs.value.height as number,
    age: inputs.value.age as number,
    gender: inputs.value.gender as 'male' | 'female',
  })
}

onMounted(calculateBmr)
watch(inputs, calculateBmr, { deep: true })

// Activity level descriptions
const activityDescriptions: Record<string, { name: string; description: string }> = {
  sedentary: { name: 'Sedentary', description: 'Little or no exercise' },
  light: { name: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  moderate: { name: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  active: { name: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  athlete: { name: 'Athlete', description: 'Very hard exercise, physical job' },
}
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- BMR Display -->
        <div class="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl">
          <p class="text-sm text-gray-500 mb-2">Your Basal Metabolic Rate</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="text-5xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              {{ result.bmr.toLocaleString() }}
            </span>
            <span class="text-gray-500 text-lg">kcal/day</span>
          </div>
          <p class="text-sm text-gray-500 mt-2">Calories burned at complete rest</p>
        </div>

        <!-- TDEE by Activity Level -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Daily Calories by Activity Level</h3>
          <div class="space-y-2">
            <div
              v-for="(multiplier, level) in activityMultipliers"
              :key="level"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors"
            >
              <div>
                <p class="font-medium text-gray-900 text-sm">{{ activityDescriptions[level].name }}</p>
                <p class="text-xs text-gray-500">{{ activityDescriptions[level].description }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-orange-600">{{ result.tdee[level].toLocaleString() }}</p>
                <p class="text-xs text-gray-400">kcal/day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About BMR</h2>
      <div class="prose prose-gray max-w-none">
        <p>Your BMR represents the minimum calories needed for basic body functions like breathing, circulation, and cell production while at complete rest.</p>
        <h3 class="text-lg font-medium mt-4 mb-2">Mifflin-St Jeor Formula</h3>
        <div class="font-mono text-sm bg-gray-50 p-3 rounded-lg space-y-1">
          <p><strong>Men:</strong> (10 × weight) + (6.25 × height) - (5 × age) + 5</p>
          <p><strong>Women:</strong> (10 × weight) + (6.25 × height) - (5 × age) - 161</p>
        </div>
        <h3 class="text-lg font-medium mt-4 mb-2">Factors That Affect BMR</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li><strong>Age:</strong> BMR decreases with age</li>
          <li><strong>Muscle mass:</strong> More muscle = higher BMR</li>
          <li><strong>Gender:</strong> Men typically have higher BMR</li>
          <li><strong>Genetics:</strong> Individual variation exists</li>
        </ul>
      </div>
    </template>
  </CalculatorPage>
</template>
