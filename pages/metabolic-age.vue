<script setup lang="ts">
import type { MetabolicAgeResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Metabolic Age Calculator',
    description: 'Estimate your metabolic age based on your Basal Metabolic Rate',
    shortDescription: 'Metabolic age compares your BMR to population averages to estimate how old your body acts metabolically.',
    path: '/metabolic-age',
    color: 'orange',
    contentPath: 'calculators/metabolic-age',
  },
  seo: {
    title: 'Metabolic Age Calculator - Estimate Your Metabolic Age',
    description: 'Free metabolic age calculator. Compare your Basal Metabolic Rate to age-group averages and find out if your metabolism is younger or older than your actual age.',
    path: '/metabolic-age',
  },
  schema: {
    name: 'Metabolic Age Calculator',
    description: 'Estimate your metabolic age based on your Basal Metabolic Rate',
    url: '/metabolic-age',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Metabolic Age Calculator', url: '/metabolic-age' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
    { key: 'age', label: 'Age', type: 'slider', min: 15, max: 100, default: 30, unit: 'years' },
  ],
}

const { calculate } = useMetabolicAge()

const { inputs, result, error, num } = useCalculatorSetup<MetabolicAgeResult>(
  config,
  (i) => calculate({
    weight: Number(i.weight),
    height: Number(i.height),
    age: Number(i.age),
    gender: String(i.gender) as 'male' | 'female',
  })
)

const age = num('age')

// Color based on difference
const diffColor = computed(() => {
  if (!result.value) return { text: 'text-gray-600', gradient: 'from-gray-500 to-gray-500', border: 'border-gray-200' }
  const diff = result.value.difference
  if (diff <= -5) return { text: 'text-green-700', gradient: 'from-green-500 to-emerald-500', border: 'border-green-200' }
  if (diff < 0) return { text: 'text-green-600', gradient: 'from-green-500 to-teal-500', border: 'border-green-200' }
  if (diff === 0) return { text: 'text-blue-600', gradient: 'from-blue-500 to-indigo-500', border: 'border-blue-200' }
  if (diff <= 5) return { text: 'text-yellow-700', gradient: 'from-yellow-500 to-amber-500', border: 'border-yellow-200' }
  return { text: 'text-red-700', gradient: 'from-red-500 to-rose-500', border: 'border-red-200' }
})

// Difference display text
const differenceText = computed(() => {
  if (!result.value) return ''
  const d = result.value.difference
  if (d === 0) return 'Same as actual age'
  if (d > 0) return `${d} year${d !== 1 ? 's' : ''} older`
  return `${Math.abs(d)} year${Math.abs(d) !== 1 ? 's' : ''} younger`
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config" inputs-title="Your Details">
    <template #results>
      <!-- Error Display -->
      <div v-if="error" class="p-4 border-2 border-red-300 bg-red-50 mb-6">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-red-500" />
          <span class="font-pixel text-xs text-red-700">ERROR</span>
        </div>
        <p class="font-game text-sm text-red-600 mt-2">{{ error }}</p>
      </div>

      <div v-if="result" class="space-y-6">
        <!-- Metabolic Age Display -->
        <div class="relative text-center p-6 border-2 bg-white" :class="diffColor.border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="diffColor.gradient" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR METABOLIC AGE</p>
          <div class="flex items-baseline justify-center gap-2">
            <span
              class="font-game text-6xl sm:text-7xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
              :class="diffColor.gradient"
            >
              {{ result.metabolicAge }}
            </span>
            <span class="font-game text-lg text-gray-500">years</span>
          </div>
          <p class="mt-3 font-pixel text-xs sm:text-sm tracking-wide" :class="diffColor.text">
            {{ differenceText.toUpperCase() }}
          </p>
        </div>

        <!-- Comparison: Actual vs Metabolic -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard title="Actual Age" :value="age" unit="years" color="orange" size="sm" />
          <CalculatorResultCard title="BMR" :value="result.bmr.toLocaleString()" unit="kcal/day" color="orange" size="sm" />
        </div>

        <!-- Assessment -->
        <div class="relative p-4 border-2 border-orange-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-orange-700 tracking-wide mb-2">ASSESSMENT</p>
          <p class="font-game text-base sm:text-lg text-gray-700">{{ result.assessment }}</p>
        </div>

        <!-- Warning Note -->
        <div class="relative p-4 border-2 border-amber-300 bg-amber-50">
          <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div class="flex items-start gap-3">
            <div class="w-3 h-3 bg-amber-500 mt-1 flex-shrink-0" />
            <div>
              <p class="font-pixel text-[10px] sm:text-xs text-amber-800 tracking-wide mb-1">NOTE</p>
              <p class="font-game text-sm text-amber-700">
                Metabolic age is an estimate with no clinical validation. It is a motivational tool, not a medical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT METABOLIC AGE</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
          Metabolic age is estimated by calculating your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation and comparing it to average BMR values for different age groups. If your BMR matches that of a younger age group, your metabolic age will be lower than your actual age.
        </p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HOW IT WORKS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Your BMR is calculated using the Mifflin-St Jeor equation</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Your BMR is compared against average values for each age group</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>The age group whose average BMR matches yours is your metabolic age</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">MIFFLIN-ST JEOR FORMULA</h3>
          <div class="relative p-4 border-2 border-orange-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
            <div class="font-mono text-sm sm:text-base text-orange-700 space-y-1">
              <p><strong>Men:</strong> (10 x weight) + (6.25 x height) - (5 x age) + 5</p>
              <p><strong>Women:</strong> (10 x weight) + (6.25 x height) - (5 x age) - 161</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">IMPORTANT</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Metabolic age is not a clinically validated metric</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Average BMR tables are population estimates and vary by source</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Use it as a motivational benchmark, not a medical indicator</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
