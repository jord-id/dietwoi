<script setup lang="ts">
import type { WhrResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Waist-to-Hip Ratio Calculator',
    description: 'Calculate your waist-to-hip ratio to assess cardiovascular health risk',
    shortDescription: 'Waist-to-Hip Ratio (WHR) compares waist circumference to hip circumference as an indicator of cardiovascular and metabolic health risk.',
    path: '/waist-hip-ratio',
    color: 'purple',
    contentPath: 'calculators/waist-hip-ratio',
  },
  seo: {
    title: 'WHR Calculator - Waist-to-Hip Ratio',
    description: 'Free waist-to-hip ratio calculator. Measure your WHR to assess cardiovascular health risk based on WHO guidelines.',
    path: '/waist-hip-ratio',
  },
  schema: {
    name: 'Waist-to-Hip Ratio Calculator',
    description: 'Calculate your waist-to-hip ratio to assess cardiovascular health risk',
    url: '/waist-hip-ratio',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'WHR Calculator', url: '/waist-hip-ratio' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'waist', label: 'Waist Circumference', type: 'slider', min: 50, max: 150, default: 80, unit: 'cm' },
    { key: 'hip', label: 'Hip Circumference', type: 'slider', min: 50, max: 150, default: 95, unit: 'cm' },
  ],
}

const { calculate } = useWaistHipRatio()

const { inputs, result, error, num, str } = useCalculatorSetup<WhrResult>(
  config,
  (i) => calculate({
    waist: Number(i.waist),
    hip: Number(i.hip),
    gender: String(i.gender) as 'male' | 'female',
  })
)

const waist = num('waist')
const hip = num('hip')
const gender = computed(() => str('gender').value as 'male' | 'female')

// Category color coding
const categoryColors: Record<string, { bg: string; text: string; gradient: string; border: string }> = {
  low: { bg: 'bg-green-50', text: 'text-green-700', gradient: 'from-green-500 to-emerald-500', border: 'border-green-200' },
  moderate: { bg: 'bg-yellow-50', text: 'text-yellow-700', gradient: 'from-yellow-500 to-amber-500', border: 'border-yellow-200' },
  high: { bg: 'bg-red-50', text: 'text-red-700', gradient: 'from-red-500 to-rose-500', border: 'border-red-200' },
}

const currentColor = computed(() => {
  if (!result.value) return categoryColors.low
  return categoryColors[result.value.category]
})

// WHO threshold ranges by gender
const thresholds = computed(() => {
  if (gender.value === 'male') {
    return [
      { label: 'LOW RISK', range: '< 0.90', color: 'green' },
      { label: 'MODERATE RISK', range: '0.90 - 0.99', color: 'yellow' },
      { label: 'HIGH RISK', range: '1.00+', color: 'red' },
    ]
  }
  return [
    { label: 'LOW RISK', range: '< 0.80', color: 'green' },
    { label: 'MODERATE RISK', range: '0.80 - 0.84', color: 'yellow' },
    { label: 'HIGH RISK', range: '0.85+', color: 'red' },
  ]
})

const rangeColors: Record<string, { border: string; bar: string; text: string }> = {
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
          <div class="w-3 h-3 bg-purple-500" />
          <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">
            WHR RANGES ({{ gender === 'male' ? 'MEN' : 'WOMEN' }})
          </span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>
        <div class="space-y-2">
          <div
            v-for="t in thresholds"
            :key="t.label"
            class="relative flex items-center justify-between p-3 border-2 bg-white"
            :class="rangeColors[t.color]?.border"
          >
            <div class="absolute left-0 top-0 bottom-0 w-1" :class="rangeColors[t.color]?.bar" />
            <span class="pl-2 font-pixel text-[10px] sm:text-xs tracking-wide" :class="rangeColors[t.color]?.text">
              {{ t.label }}
            </span>
            <span class="font-game text-sm sm:text-base text-gray-600">{{ t.range }}</span>
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
        <!-- WHR Value -->
        <div class="relative text-center p-6 border-2 bg-white" :class="currentColor.border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="currentColor.gradient" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR WAIST-TO-HIP RATIO</p>
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

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard title="Waist" :value="waist" unit="cm" color="purple" size="sm" />
          <CalculatorResultCard title="Hip" :value="hip" unit="cm" color="purple" size="sm" />
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT WHR</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
          Waist-to-Hip Ratio is a quick way to gauge how fat is distributed around your body. Central (abdominal) fat is associated with higher cardiovascular and metabolic risk.
        </p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FORMULA</h3>
          <div class="relative p-4 border-2 border-purple-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
            <p class="font-mono text-base sm:text-lg text-purple-700">
              WHR = waist (cm) / hip (cm)
            </p>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">SOURCE</h3>
          <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
            Risk thresholds are based on World Health Organization (WHO) guidelines for waist-to-hip ratio classification.
          </p>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">LIMITATIONS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span>Does not account for overall body size or muscle mass</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span>Measurement accuracy depends on correct technique</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span>Thresholds may vary across ethnic groups and age</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
