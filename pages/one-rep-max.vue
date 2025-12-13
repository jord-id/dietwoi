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
        <div class="relative text-center p-6 border-2 border-red-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR ESTIMATED 1RM</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              {{ result.average }}
            </span>
            <span class="font-game text-lg text-gray-500">kg</span>
          </div>
          <p class="font-game text-xs text-gray-400 mt-2">Average of 4 formulas</p>
        </div>

        <!-- Individual Formulas -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-red-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">FORMULA RESULTS</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="relative p-4 border-2 border-red-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">EPLEY</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-red-600">{{ result.epley }} kg</p>
            </div>
            <div class="relative p-4 border-2 border-red-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">BRZYCKI</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-red-600">{{ result.brzycki }} kg</p>
            </div>
            <div class="relative p-4 border-2 border-red-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">LOMBARDI</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-red-600">{{ result.lombardi }} kg</p>
            </div>
            <div class="relative p-4 border-2 border-red-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">O'CONNER</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-red-600">{{ result.oconner }} kg</p>
            </div>
          </div>
        </div>

        <!-- Training Percentages -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-red-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">TRAINING WEIGHTS BY REP RANGE</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="space-y-2">
            <div
              v-for="item in result.percentages"
              :key="item.reps"
              class="relative flex items-center justify-between p-3 border-2 border-red-200 bg-white"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
              <div class="flex items-center gap-3 pl-2">
                <div class="w-10 h-10 border-2 border-red-300 bg-red-50 flex items-center justify-center">
                  <span class="font-game text-lg font-bold text-red-600">{{ item.reps }}</span>
                </div>
                <div>
                  <p class="font-game text-sm sm:text-base font-medium text-gray-900">{{ item.weight }} kg</p>
                  <p class="font-game text-xs text-gray-500">{{ item.percentage }}% of 1RM</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-game text-xs text-gray-400">{{ item.reps === 1 ? '1 rep' : `${item.reps} reps` }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT ONE REP MAX (1RM)</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Your 1RM is the maximum weight you can lift for a single repetition with proper form. It's a fundamental metric in strength training.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FORMULAS USED</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Epley:</strong> 1RM = weight × (1 + reps/30)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Brzycki:</strong> 1RM = weight × (36 / (37 - reps))</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>Lombardi:</strong> 1RM = weight × reps^0.10</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>O'Conner:</strong> 1RM = weight × (1 + 0.025 × reps)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">TRAINING GUIDELINES</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>1-3 reps (90-100%):</strong> Strength and power</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>4-6 reps (85-90%):</strong> Strength with some size</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>8-12 reps (70-80%):</strong> Hypertrophy</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span><strong>15+ reps (&lt;65%):</strong> Muscular endurance</span>
            </li>
          </ul>
        </div>

        <div class="relative p-4 border-2 border-red-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
          <p class="font-game text-sm sm:text-base text-red-700"><strong>Safety Note:</strong> Always use proper form and have a spotter when testing heavy weights. These are estimates.</p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
