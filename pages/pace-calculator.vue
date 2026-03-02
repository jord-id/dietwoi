<script setup lang="ts">
import type { PaceResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Pace Calculator',
    description: 'Convert between pace, speed, and get race time predictions',
    shortDescription: 'Calculate your running pace in min/km and min/mile, speed in km/h and mph, plus race time predictions for 5K, 10K, Half Marathon, and Marathon.',
    path: '/pace-calculator',
    color: 'blue',
    contentPath: 'calculators/pace-calculator',
  },
  seo: {
    title: 'Pace Calculator - Running Pace, Speed & Race Predictions',
    description: 'Calculate your running pace, speed, and get race time predictions for 5K, 10K, Half Marathon, and Marathon using the Riegel formula.',
    path: '/pace-calculator',
  },
  schema: {
    name: 'Pace Calculator',
    description: 'Calculate running pace, speed, and race predictions',
    url: '/pace-calculator',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Pace Calculator', url: '/pace-calculator' },
  ],
  inputs: [],
}

// Manual state management since we use custom time input
const { calculate } = usePaceCalculator()

const inputs = ref<Record<string, number | string>>({})

const distanceKm = ref(5)
const timeMinutes = ref(25)

const result = computed<PaceResult | null>(() => {
  try {
    return calculate({
      distanceKm: distanceKm.value,
      timeSeconds: timeMinutes.value * 60,
    })
  } catch {
    return null
  }
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Distance Slider -->
      <div class="mb-4">
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">
          DISTANCE
          <span class="font-game text-blue-600 float-right">{{ distanceKm }} km</span>
        </label>
        <input
          v-model.number="distanceKm"
          type="range"
          :min="0.1"
          :max="50"
          :step="0.1"
          class="w-full accent-blue-500"
        >
        <div class="flex justify-between font-game text-xs text-gray-400 mt-1">
          <span>0.1 km</span>
          <span>50 km</span>
        </div>
      </div>

      <!-- Time Slider -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">
          TIME
          <span class="font-game text-blue-600 float-right">
            {{ Math.floor(timeMinutes / 60) > 0 ? `${Math.floor(timeMinutes / 60)}h ` : '' }}{{ timeMinutes % 60 }} min
          </span>
        </label>
        <input
          v-model.number="timeMinutes"
          type="range"
          :min="1"
          :max="300"
          :step="1"
          class="w-full accent-blue-500"
        >
        <div class="flex justify-between font-game text-xs text-gray-400 mt-1">
          <span>1 min</span>
          <span>5 hours</span>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Pace Display -->
        <div class="grid grid-cols-2 gap-3">
          <div class="relative text-center p-4 border-2 border-blue-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">PACE</p>
            <p class="font-game text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">{{ result.paceMinKm }}</p>
            <p class="font-game text-xs text-gray-400 mt-1">min/km</p>
          </div>
          <div class="relative text-center p-4 border-2 border-blue-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-blue-400" />
            <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">PACE</p>
            <p class="font-game text-3xl sm:text-4xl font-bold text-blue-600">{{ result.paceMinMile }}</p>
            <p class="font-game text-xs text-gray-400 mt-1">min/mile</p>
          </div>
        </div>

        <!-- Speed Display -->
        <div class="grid grid-cols-2 gap-3">
          <CalculatorResultCard
            title="Speed"
            :value="result.speedKmh"
            unit="km/h"
            color="blue"
            size="sm"
          />
          <CalculatorResultCard
            title="Speed"
            :value="result.speedMph"
            unit="mph"
            color="blue"
            size="sm"
          />
        </div>

        <!-- Race Predictions -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-blue-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">RACE PREDICTIONS</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="space-y-2">
            <div
              v-for="prediction in result.predictions"
              :key="prediction.race"
              class="relative flex items-center justify-between p-3 border-2 border-blue-200 bg-white"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
              <div class="pl-2">
                <p class="font-game text-sm sm:text-base font-medium text-gray-900">{{ prediction.race }}</p>
                <p class="font-game text-xs text-gray-400">{{ prediction.distance }}</p>
              </div>
              <span class="font-game text-lg sm:text-xl font-bold text-blue-600">{{ prediction.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT PACE CALCULATOR</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Running pace is the time it takes to cover a given distance. This calculator converts between pace and speed, and predicts race times using the Riegel formula.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">RIEGEL FORMULA</h3>
          <div class="relative p-4 border-2 border-blue-300 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
            <p class="font-mono text-base sm:text-lg text-blue-700">T2 = T1 x (D2 / D1)^1.06</p>
            <p class="font-game text-sm text-gray-500 mt-2">Predicts race time based on a known performance at a different distance</p>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">RACE PACE GUIDELINES</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span>Predictions are most accurate for distances close to your input distance</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span>The 1.06 exponent accounts for fatigue in longer distances</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span>Terrain, weather, and training can significantly affect actual race times</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
