<script setup lang="ts">
import type { MaxHrResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Max Heart Rate Calculator',
    description: 'Estimate your maximum heart rate using multiple proven formulas',
    shortDescription: 'Calculate your maximum heart rate using Tanaka, Gellish, and traditional formulas. The Gulati formula is included for women.',
    path: '/max-heart-rate',
    color: 'pink',
    contentPath: 'calculators/max-heart-rate',
  },
  seo: {
    title: 'Max Heart Rate Calculator - Tanaka, Gellish & Gulati Formulas',
    description: 'Estimate your maximum heart rate using multiple proven formulas including Tanaka (2001), Gellish, traditional 220-age, and Gulati for women.',
    path: '/max-heart-rate',
  },
  schema: {
    name: 'Max Heart Rate Calculator',
    description: 'Estimate your maximum heart rate using multiple proven formulas',
    url: '/max-heart-rate',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Max Heart Rate Calculator', url: '/max-heart-rate' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'age', label: 'Age', type: 'slider', min: 10, max: 100, default: 30, unit: 'years' },
  ],
}

const { calculate } = useMaxHeartRate()

const { inputs, result } = useCalculatorSetup<MaxHrResult>(
  config,
  (i) => calculate({
    age: Number(i.age),
    gender: i.gender as 'male' | 'female',
  })
)
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Recommended Max HR -->
        <div class="relative text-center p-6 border-2 border-pink-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">RECOMMENDED MAX HR</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {{ result.recommended }}
            </span>
            <span class="font-game text-lg text-gray-500">bpm</span>
          </div>
          <p class="font-game text-xs text-gray-400 mt-2">
            {{ inputs.gender === 'female' ? 'Gulati formula (women)' : 'Tanaka formula' }}
          </p>
        </div>

        <!-- All Formula Results -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-pink-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">ALL FORMULAS</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="relative p-4 border-2 border-pink-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-pink-400" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">TRADITIONAL</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-pink-600">{{ result.traditional }} bpm</p>
              <p class="font-game text-xs text-gray-400 mt-1">220 - age</p>
            </div>
            <div class="relative p-4 border-2 border-pink-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">TANAKA</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-pink-600">{{ result.tanaka }} bpm</p>
              <p class="font-game text-xs text-gray-400 mt-1">208 - 0.7 x age</p>
            </div>
            <div class="relative p-4 border-2 border-pink-200 bg-white">
              <div class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">GELLISH</p>
              <p class="font-game text-xl sm:text-2xl font-bold text-pink-600">{{ result.gellish }} bpm</p>
              <p class="font-game text-xs text-gray-400 mt-1">207 - 0.7 x age</p>
            </div>
            <div class="relative p-4 border-2 bg-white" :class="result.gulati !== null ? 'border-pink-200' : 'border-gray-200'">
              <div class="absolute top-0 left-0 right-0 h-1" :class="result.gulati !== null ? 'bg-pink-500' : 'bg-gray-300'" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">GULATI</p>
              <template v-if="result.gulati !== null">
                <p class="font-game text-xl sm:text-2xl font-bold text-pink-600">{{ result.gulati }} bpm</p>
                <p class="font-game text-xs text-gray-400 mt-1">206 - 0.88 x age</p>
              </template>
              <template v-else>
                <p class="font-game text-lg text-gray-400">Women only</p>
                <p class="font-game text-xs text-gray-400 mt-1">206 - 0.88 x age</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT MAX HEART RATE</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Maximum heart rate (MHR) is the highest number of beats per minute your heart can achieve during maximum effort. It is used to set training intensity zones.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">WHY 220-AGE IS LESS ACCURATE</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-pink-500 mt-2 flex-shrink-0" />
              <span>The traditional 220-age formula has no known scientific origin and large standard deviation (10-12 bpm)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-pink-500 mt-2 flex-shrink-0" />
              <span><strong>Tanaka et al. (2001)</strong> meta-analysis of 351 studies found 208 - 0.7 x age to be more accurate</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-pink-500 mt-2 flex-shrink-0" />
              <span><strong>Gulati (2010)</strong> formula was developed specifically for women, who tend to have different max HR patterns</span>
            </li>
          </ul>
        </div>

        <div class="relative p-4 border-2 border-pink-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
          <p class="font-game text-sm sm:text-base text-pink-700"><strong>Note:</strong> These are population-based estimates. Individual max HR can vary by 10-20 bpm. A supervised max HR test is the most accurate method.</p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
