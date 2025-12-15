<script setup lang="ts">
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Lean Body Mass Calculator',
    description: 'Calculate your lean body mass using multiple scientific formulas',
    shortDescription: 'Lean Body Mass (LBM) is your total weight minus fat mass. It includes muscles, bones, organs, and water.',
    path: '/lean-body-mass',
    color: 'green',
    contentPath: 'calculators/lean-body-mass',
  },
  seo: {
    title: 'Lean Body Mass Calculator - Estimate Your Muscle Mass',
    description: 'Calculate your lean body mass using Boer and Hume formulas. Track your muscle mass for body recomposition and fitness goals.',
    path: '/lean-body-mass',
  },
  schema: {
    name: 'Lean Body Mass Calculator',
    description: 'Calculate lean body mass using multiple scientific formulas',
    url: '/lean-body-mass',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Lean Body Mass Calculator', url: '/lean-body-mass' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
  ],
}

// Calculator
const { calculate } = useLeanBodyMass()

const inputs = ref<Record<string, number | string>>({
  gender: 'male',
  weight: 70,
  height: 170,
})

// Type-safe accessors (centralized type narrowing)
const weight = computed(() => Number(inputs.value.weight))
const height = computed(() => Number(inputs.value.height))
const gender = computed(() => inputs.value.gender as 'male' | 'female')

const bodyFatInput = ref<number | null>(null)

const result = computed(() => {
  return calculate({
    weight: weight.value,
    height: height.value,
    gender: gender.value,
    bodyFatPercentage: bodyFatInput.value ?? undefined,
  })
})

const lbmPercentage = computed(() => {
  return Math.round((result.value.average / weight.value) * 100)
})

const fatPercentage = computed(() => {
  return 100 - lbmPercentage.value
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Optional Body Fat Input -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-2 block">
          BODY FAT % (OPTIONAL)
        </label>
        <div class="flex items-center gap-3">
          <input
            v-model.number="bodyFatInput"
            type="number"
            min="3"
            max="60"
            step="0.1"
            placeholder="e.g. 20"
            class="w-24 px-3 py-2.5 border-2 border-green-300 bg-white font-game text-lg text-green-700 focus:outline-none focus:border-green-500"
          >
          <span class="font-game text-sm text-gray-500">%</span>
          <button
            v-if="bodyFatInput !== null"
            class="font-game text-sm text-gray-400 hover:text-gray-600"
            @click="bodyFatInput = null"
          >
            Clear
          </button>
        </div>
        <p class="mt-1 font-game text-xs text-gray-500">
          Enter for more accurate results
        </p>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- Main Result -->
        <div class="relative text-center p-6 border-2 border-green-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR LEAN BODY MASS</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              {{ result.average }}
            </span>
            <span class="font-game text-lg text-gray-500">kg</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">
            {{ lbmPercentage }}% of total body weight
          </p>
        </div>

        <!-- Visual Bar -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-green-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">BODY COMPOSITION</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="h-8 border border-gray-300 flex">
            <div
              class="bg-green-500 flex items-center justify-center font-game text-sm text-white font-medium"
              :style="{ width: `${lbmPercentage}%` }"
            >
              Lean {{ lbmPercentage }}%
            </div>
            <div
              class="bg-green-300 flex items-center justify-center font-game text-sm text-green-800 font-medium"
              :style="{ width: `${fatPercentage}%` }"
            >
              Fat {{ fatPercentage }}%
            </div>
          </div>
        </div>

        <!-- Breakdown -->
        <div class="grid grid-cols-2 gap-4">
          <div class="relative p-4 border-2 border-green-200 bg-white text-center">
            <div class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">LEAN MASS</p>
            <p class="font-game text-2xl sm:text-3xl font-bold text-green-600">{{ result.average }} kg</p>
            <p class="font-game text-xs text-gray-400">Muscle, bone, organs</p>
          </div>
          <div class="relative p-4 border-2 border-green-200 bg-white text-center">
            <div class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">FAT MASS</p>
            <p class="font-game text-2xl sm:text-3xl font-bold text-green-600">{{ result.fatMass }} kg</p>
            <p class="font-game text-xs text-gray-400">Body fat</p>
          </div>
        </div>

        <!-- Formula Results -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-green-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">BY FORMULA</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="space-y-2">
            <div class="relative flex justify-between items-center p-3 border-2 border-green-200 bg-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
              <span class="pl-2 font-game text-sm text-gray-600">Boer (1984)</span>
              <span class="font-game text-base font-semibold text-green-700">{{ result.boer }} kg</span>
            </div>
            <div class="relative flex justify-between items-center p-3 border-2 border-green-200 bg-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
              <span class="pl-2 font-game text-sm text-gray-600">Hume (1966)</span>
              <span class="font-game text-base font-semibold text-green-700">{{ result.hume }} kg</span>
            </div>
            <div v-if="result.fromBodyFat !== null" class="relative flex justify-between items-center p-3 border-2 border-green-200 bg-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
              <span class="pl-2 font-game text-sm text-gray-600">From Body Fat %</span>
              <span class="font-game text-base font-semibold text-green-700">{{ result.fromBodyFat }} kg</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT LEAN BODY MASS</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Lean Body Mass (LBM) is everything in your body except fat: muscles, bones, organs, skin, and water.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">USEFUL FOR</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Tracking muscle gain during bulking</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Monitoring muscle preservation during cutting</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Calculating protein needs (based on LBM)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FORMULAS</h3>
          <div class="relative p-4 border-2 border-green-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <div class="font-mono text-sm sm:text-base text-green-700 space-y-1">
              <p><strong>Boer:</strong> Men: 0.407×W + 0.267×H - 19.2</p>
              <p><strong>Hume:</strong> Men: 0.328×W + 0.339×H - 29.5</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
