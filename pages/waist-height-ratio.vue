<script setup lang="ts">
import type { WhtRResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Waist-to-Height Ratio Calculator',
    description: 'Calculate your waist-to-height ratio for a simple body composition screening',
    shortDescription: 'Waist-to-Height Ratio (WHtR) is a simple screening tool: keep your waist circumference to less than half your height.',
    path: '/waist-height-ratio',
    color: 'teal',
    contentPath: 'calculators/waist-height-ratio',
  },
  seo: {
    title: 'WHtR Calculator - Waist-to-Height Ratio',
    description: 'Free waist-to-height ratio calculator. A simple, evidence-based measure of central obesity and health risk.',
    path: '/waist-height-ratio',
  },
  schema: {
    name: 'Waist-to-Height Ratio Calculator',
    description: 'Calculate your waist-to-height ratio for body composition screening',
    url: '/waist-height-ratio',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'WHtR Calculator', url: '/waist-height-ratio' },
  ],
  inputs: [
    { key: 'waist', label: 'Waist Circumference', type: 'slider', min: 50, max: 150, default: 80, unit: 'cm' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
  ],
}

const { calculate } = useWaistHeightRatio()

const { inputs, result, error, num } = useCalculatorSetup<WhtRResult>(
  config,
  (i) => calculate({
    waist: Number(i.waist),
    height: Number(i.height),
  })
)

const waist = num('waist')
const height = num('height')

// Half-height target
const halfHeight = computed(() => Math.round(height.value / 2))

// Category color coding
const categoryColors: Record<string, { bg: string; text: string; gradient: string; border: string }> = {
  underweight: { bg: 'bg-blue-50', text: 'text-blue-700', gradient: 'from-blue-500 to-cyan-500', border: 'border-blue-200' },
  healthy: { bg: 'bg-green-50', text: 'text-green-700', gradient: 'from-green-500 to-emerald-500', border: 'border-green-200' },
  increased: { bg: 'bg-yellow-50', text: 'text-yellow-700', gradient: 'from-yellow-500 to-amber-500', border: 'border-yellow-200' },
  high: { bg: 'bg-red-50', text: 'text-red-700', gradient: 'from-red-500 to-rose-500', border: 'border-red-200' },
}

const currentColor = computed(() => {
  if (!result.value) return categoryColors.healthy
  return categoryColors[result.value.category]
})

// Range definitions
const ranges = [
  { label: 'UNDERWEIGHT RISK', range: '< 0.40', color: 'blue' },
  { label: 'HEALTHY', range: '0.40 - 0.49', color: 'green' },
  { label: 'INCREASED RISK', range: '0.50 - 0.59', color: 'yellow' },
  { label: 'HIGH RISK', range: '0.60+', color: 'red' },
]

const rangeColors: Record<string, { border: string; bar: string; text: string }> = {
  blue: { border: 'border-blue-200', bar: 'bg-blue-500', text: 'text-blue-700' },
  green: { border: 'border-green-200', bar: 'bg-green-500', text: 'text-green-700' },
  yellow: { border: 'border-yellow-200', bar: 'bg-yellow-500', text: 'text-yellow-700' },
  red: { border: 'border-red-200', bar: 'bg-red-500', text: 'text-red-700' },
}
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config" inputs-title="Your Measurements">
    <template #reference>
      <div class="mt-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-3 h-3 bg-teal-500" />
          <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">WHtR RANGES</span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>
        <div class="space-y-2">
          <div
            v-for="r in ranges"
            :key="r.label"
            class="relative flex items-center justify-between p-3 border-2 bg-white"
            :class="rangeColors[r.color]?.border"
          >
            <div class="absolute left-0 top-0 bottom-0 w-1" :class="rangeColors[r.color]?.bar" />
            <span class="pl-2 font-pixel text-[10px] sm:text-xs tracking-wide" :class="rangeColors[r.color]?.text">
              {{ r.label }}
            </span>
            <span class="font-game text-sm sm:text-base text-gray-600">{{ r.range }}</span>
          </div>
        </div>
      </div>
    </template>

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
        <!-- WHtR Value -->
        <div class="relative text-center p-6 border-2 bg-white" :class="currentColor.border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="currentColor.gradient" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR WAIST-TO-HEIGHT RATIO</p>
          <div class="flex items-baseline justify-center gap-2">
            <span
              class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
              :class="currentColor.gradient"
            >
              {{ result.ratio }}
            </span>
          </div>
          <p class="mt-3 font-pixel text-xs sm:text-sm tracking-wide" :class="currentColor.text">
            {{ result.categoryLabel.toUpperCase() }}
          </p>
        </div>

        <!-- Half-height rule -->
        <div class="relative p-4 border-2 border-teal-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-teal-700 tracking-wide mb-2">THE GOLDEN RULE</p>
          <p class="font-game text-lg sm:text-xl text-teal-700 font-semibold">
            Keep your waist under {{ halfHeight }} cm
          </p>
          <p class="font-game text-sm text-gray-500 mt-1">
            Half your height ({{ height }} cm / 2)
          </p>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard title="Waist" :value="waist" unit="cm" color="teal" size="sm" />
          <CalculatorResultCard title="Height" :value="height" unit="cm" color="teal" size="sm" />
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT WHtR</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
          Waist-to-Height Ratio is one of the simplest and most effective screening tools for central obesity. The key message is straightforward: keep your waist circumference to less than half your height.
        </p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FORMULA</h3>
          <div class="relative p-4 border-2 border-teal-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
            <p class="font-mono text-base sm:text-lg text-teal-700">
              WHtR = waist (cm) / height (cm)
            </p>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">WHY BETTER THAN BMI?</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span>Accounts for fat distribution, not just total weight</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span>Same threshold (0.5) works across gender, age, and ethnicity</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span>Better predictor of cardiometabolic risk (Ashwell et al., 2012)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">SOURCE</h3>
          <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
            Ashwell M, Gunn P, Gibson S. "Waist-to-height ratio is a better screening tool than waist circumference and BMI for adult cardiometabolic risk factors." BMC Medicine, 2012.
          </p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
