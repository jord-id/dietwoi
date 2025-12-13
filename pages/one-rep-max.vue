<script setup lang="ts">
import type { OneRepMaxResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'One Rep Max Calculator',
    description: 'Calculate your one-rep max (1RM) using multiple proven formulas',
    shortDescription: 'One Rep Max (1RM) is the maximum weight you can lift for one repetition. Calculate yours using multiple formulas.',
    path: '/one-rep-max',
    color: 'red',
    contentPath: 'calculators/one-rep-max',
  },
  seo: {
    title: 'One Rep Max Calculator (1RM) - Strength Training Tool',
    description: 'Calculate your one-rep max (1RM) using Epley, Brzycki, Lombardi, and O\'Conner formulas. Get weight percentages for all rep ranges to optimize your strength training.',
    path: '/one-rep-max',
  },
  schema: {
    name: 'One Rep Max Calculator',
    description: 'Calculate your one-rep max (1RM) using multiple proven formulas',
    url: '/one-rep-max',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'One Rep Max Calculator', url: '/one-rep-max' },
  ],
  inputs: [
    { key: 'weight', label: 'Weight Lifted', type: 'slider', min: 5, max: 300, default: 80, unit: 'kg' },
    { key: 'reps', label: 'Reps Performed', type: 'slider', min: 1, max: 15, default: 5, unit: 'reps' },
  ],
}

// Calculator
const { calculate } = useOneRepMax()

const inputs = ref<Record<string, number | string>>({
  weight: 80,
  reps: 5,
})

const result = ref<OneRepMaxResult | null>(null)

const calculateOneRepMax = () => {
  result.value = calculate({
    weight: inputs.value.weight as number,
    reps: inputs.value.reps as number,
  })
}

onMounted(calculateOneRepMax)
watch(inputs, calculateOneRepMax, { deep: true })
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Average 1RM Display -->
        <div class="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl">
          <p class="text-sm text-gray-500 mb-2">Your Estimated 1RM</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="text-5xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              {{ result.average }}
            </span>
            <span class="text-gray-500 text-lg">kg</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">Average of 4 formulas</p>
        </div>

        <!-- Individual Formulas -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Formula Results</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-4 rounded-xl bg-red-50">
              <p class="text-xs text-gray-500 mb-1">Epley</p>
              <p class="text-xl font-bold text-red-600">{{ result.epley }} kg</p>
            </div>
            <div class="p-4 rounded-xl bg-rose-50">
              <p class="text-xs text-gray-500 mb-1">Brzycki</p>
              <p class="text-xl font-bold text-rose-600">{{ result.brzycki }} kg</p>
            </div>
            <div class="p-4 rounded-xl bg-pink-50">
              <p class="text-xs text-gray-500 mb-1">Lombardi</p>
              <p class="text-xl font-bold text-pink-600">{{ result.lombardi }} kg</p>
            </div>
            <div class="p-4 rounded-xl bg-red-100">
              <p class="text-xs text-gray-500 mb-1">O'Conner</p>
              <p class="text-xl font-bold text-red-700">{{ result.oconner }} kg</p>
            </div>
          </div>
        </div>

        <!-- Training Percentages -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Training Weights by Rep Range</h3>
          <div class="space-y-2">
            <div
              v-for="item in result.percentages"
              :key="item.reps"
              class="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-50 to-transparent hover:from-red-100 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <span class="text-lg font-bold text-red-600">{{ item.reps }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ item.weight }} kg</p>
                  <p class="text-xs text-gray-500">{{ item.percentage }}% of 1RM</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-400">{{ item.reps === 1 ? '1 rep' : `${item.reps} reps` }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About One Rep Max (1RM)</h2>
      <div class="prose prose-gray max-w-none">
        <p>Your 1RM is the maximum weight you can lift for a single repetition with proper form. It's a fundamental metric in strength training for tracking progress and programming workouts.</p>

        <h3 class="text-lg font-medium mt-4 mb-2">Formulas Used</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li><strong>Epley:</strong> 1RM = weight × (1 + reps/30)</li>
          <li><strong>Brzycki:</strong> 1RM = weight × (36 / (37 - reps))</li>
          <li><strong>Lombardi:</strong> 1RM = weight × reps<sup>0.10</sup></li>
          <li><strong>O'Conner:</strong> 1RM = weight × (1 + 0.025 × reps)</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">How to Use This Calculator</h3>
        <ol class="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li>Enter the weight you lifted</li>
          <li>Enter how many reps you completed with good form</li>
          <li>Your estimated 1RM is shown as an average of 4 formulas</li>
          <li>Use the percentage chart to plan your training weights</li>
        </ol>

        <h3 class="text-lg font-medium mt-4 mb-2">Training Guidelines</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li><strong>1-3 reps (90-100%):</strong> Strength and power</li>
          <li><strong>4-6 reps (85-90%):</strong> Strength with some size</li>
          <li><strong>8-12 reps (70-80%):</strong> Hypertrophy (muscle growth)</li>
          <li><strong>15+ reps (&lt;65%):</strong> Muscular endurance</li>
        </ul>

        <div class="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p class="text-sm text-amber-800"><strong>Safety Note:</strong> Always use proper form and have a spotter when testing heavy weights. These are estimates - actual 1RM may vary.</p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
