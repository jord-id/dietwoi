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

const bodyFatInput = ref<number | null>(null)

const result = computed(() => {
  return calculate({
    weight: inputs.value.weight as number,
    height: inputs.value.height as number,
    gender: inputs.value.gender as 'male' | 'female',
    bodyFatPercentage: bodyFatInput.value ?? undefined,
  })
})

const lbmPercentage = computed(() => {
  const weight = inputs.value.weight as number
  return Math.round((result.value.average / weight) * 100)
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
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Body Fat % (Optional)
        </label>
        <div class="flex items-center gap-3">
          <input
            v-model.number="bodyFatInput"
            type="number"
            min="3"
            max="60"
            step="0.1"
            placeholder="e.g. 20"
            class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
          <span class="text-sm text-gray-500">%</span>
          <button
            v-if="bodyFatInput !== null"
            class="text-sm text-gray-400 hover:text-gray-600"
            @click="bodyFatInput = null"
          >
            Clear
          </button>
        </div>
        <p class="mt-1 text-xs text-gray-500">
          If you know your body fat %, enter it for more accurate results
        </p>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- Main Result -->
        <div class="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
          <p class="text-sm text-gray-500 mb-2">Your Lean Body Mass</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              {{ result.average }}
            </span>
            <span class="text-gray-500 text-lg">kg</span>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            {{ lbmPercentage }}% of total body weight
          </p>
        </div>

        <!-- Visual Bar -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Body Composition</h3>
          <div class="h-8 rounded-full overflow-hidden flex">
            <div
              class="bg-green-400 flex items-center justify-center text-sm text-white font-medium"
              :style="{ width: `${lbmPercentage}%` }"
            >
              Lean {{ lbmPercentage }}%
            </div>
            <div
              class="bg-amber-400 flex items-center justify-center text-sm text-white font-medium"
              :style="{ width: `${fatPercentage}%` }"
            >
              Fat {{ fatPercentage }}%
            </div>
          </div>
        </div>

        <!-- Breakdown -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-green-50 text-center">
            <p class="text-xs text-gray-500 mb-1">Lean Mass</p>
            <p class="text-2xl font-bold text-green-600">{{ result.average }} kg</p>
            <p class="text-xs text-gray-400">Muscle, bone, organs</p>
          </div>
          <div class="p-4 rounded-xl bg-amber-50 text-center">
            <p class="text-xs text-gray-500 mb-1">Fat Mass</p>
            <p class="text-2xl font-bold text-amber-600">{{ result.fatMass }} kg</p>
            <p class="text-xs text-gray-400">Body fat</p>
          </div>
        </div>

        <!-- Formula Results -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">By Formula</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-600">Boer (1984)</span>
              <span class="font-semibold text-gray-800">{{ result.boer }} kg</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-600">Hume (1966)</span>
              <span class="font-semibold text-gray-800">{{ result.hume }} kg</span>
            </div>
            <div v-if="result.fromBodyFat !== null" class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span class="text-sm text-gray-600">From Body Fat %</span>
              <span class="font-semibold text-green-700">{{ result.fromBodyFat }} kg</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About Lean Body Mass</h2>
      <div class="prose prose-gray max-w-none">
        <p>Lean Body Mass (LBM) is everything in your body except fat: muscles, bones, organs, skin, and water. It's useful for:</p>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
          <li>Tracking muscle gain during bulking</li>
          <li>Monitoring muscle preservation during cutting</li>
          <li>Calculating protein needs (based on LBM, not total weight)</li>
          <li>Drug dosing in medical settings</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">Formulas Used</h3>
        <div class="bg-gray-50 p-3 rounded-lg text-sm font-mono space-y-2">
          <p><strong>Boer:</strong> Men: 0.407×W + 0.267×H - 19.2</p>
          <p><strong>Hume:</strong> Men: 0.328×W + 0.339×H - 29.5</p>
        </div>

        <h3 class="text-lg font-medium mt-4 mb-2">Accuracy</h3>
        <p class="text-sm text-gray-600">
          These formulas provide estimates with ±5% accuracy. For precise measurements, consider DEXA scans or hydrostatic weighing. If you know your body fat percentage (from a scan or caliper test), enter it above for the most accurate result.
        </p>
      </div>
    </template>
  </CalculatorPage>
</template>
