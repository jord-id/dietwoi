<script setup lang="ts">
import type { BmiResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index to assess your weight category',
    shortDescription: 'Body Mass Index (BMI) is a measure of body fat based on height and weight. It applies to adult men and women.',
    path: '/bmi',
    color: 'teal',
    contentPath: 'calculators/bmi',
  },
  seo: {
    title: 'BMI Calculator - Calculate Your Body Mass Index',
    description: 'Free BMI calculator to find your Body Mass Index. Enter your weight and height to see if you\'re underweight, normal weight, overweight, or obese.',
    path: '/bmi',
  },
  schema: {
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) to assess your weight category',
    url: '/bmi',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'BMI Calculator', url: '/bmi' },
  ],
  inputs: [
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
  ],
}

// Calculator
const { calculate, ranges } = useBmi()

const inputs = ref<Record<string, number | string>>({
  weight: 70,
  height: 170,
})

const result = ref<BmiResult | null>(null)

const calculateBmi = () => {
  result.value = calculate({
    weight: inputs.value.weight as number,
    height: inputs.value.height as number,
  })
}

onMounted(calculateBmi)
watch(inputs, calculateBmi, { deep: true })

// Category colors
const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
  underweight: { bg: 'bg-blue-50', text: 'text-blue-700', gradient: 'from-blue-500 to-cyan-500' },
  normal: { bg: 'bg-green-50', text: 'text-green-700', gradient: 'from-green-500 to-emerald-500' },
  overweight: { bg: 'bg-yellow-50', text: 'text-yellow-700', gradient: 'from-yellow-500 to-orange-500' },
  obese: { bg: 'bg-red-50', text: 'text-red-700', gradient: 'from-red-500 to-rose-500' },
}

const currentColor = computed(() => {
  if (!result.value) return categoryColors.normal
  return categoryColors[result.value.category]
})

// Gauge rotation (BMI 15-40 mapped to 0-180 degrees)
const gaugeRotation = computed(() => {
  if (!result.value) return 0
  const bmi = Math.min(40, Math.max(15, result.value.bmi))
  return ((bmi - 15) / 25) * 180
})

// Range colors for BMI categories
const rangeColors: Record<string, { border: string; bar: string; text: string }> = {
  underweight: { border: 'border-blue-200', bar: 'bg-blue-500', text: 'text-blue-700' },
  normal: { border: 'border-green-200', bar: 'bg-green-500', text: 'text-green-700' },
  overweight: { border: 'border-yellow-200', bar: 'bg-yellow-500', text: 'text-yellow-700' },
  obese: { border: 'border-red-200', bar: 'bg-red-500', text: 'text-red-700' },
}
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config" inputs-title="Your Measurements">
    <template #reference>
      <div class="mt-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-3 h-3 bg-teal-500" />
          <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">BMI RANGES</span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(range, key) in ranges"
            :key="key"
            class="relative p-4 border-2 bg-white"
            :class="rangeColors[key]?.border"
          >
            <!-- Top accent bar -->
            <div class="absolute top-0 left-0 right-0 h-1" :class="rangeColors[key]?.bar" />
            <p class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="rangeColors[key]?.text">
              {{ range.label.toUpperCase() }}
            </p>
            <p class="font-game text-base sm:text-lg text-gray-700 mt-1 font-semibold">
              <template v-if="key === 'underweight'">&lt; 18.5</template>
              <template v-else-if="key === 'normal'">18.5 - 24.9</template>
              <template v-else-if="key === 'overweight'">25.0 - 29.9</template>
              <template v-else>30.0+</template>
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- BMI Gauge -->
        <div class="flex justify-center">
          <div class="relative w-48 h-24">
            <svg class="w-full h-full" viewBox="0 0 200 100">
              <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#e5e7eb" stroke-width="12" stroke-linecap="round" />
              <path d="M 10 100 A 90 90 0 0 1 45 30" fill="none" stroke="#3b82f6" stroke-width="12" stroke-linecap="round" />
              <path d="M 45 30 A 90 90 0 0 1 100 10" fill="none" stroke="#22c55e" stroke-width="12" />
              <path d="M 100 10 A 90 90 0 0 1 155 30" fill="none" stroke="#eab308" stroke-width="12" />
              <path d="M 155 30 A 90 90 0 0 1 190 100" fill="none" stroke="#ef4444" stroke-width="12" stroke-linecap="round" />
            </svg>
            <div
              class="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-500"
              :style="{ transform: `translateX(-50%) rotate(${gaugeRotation - 90}deg)` }"
            >
              <div class="w-1 h-20 bg-gray-800 rounded-full" />
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full" />
            </div>
          </div>
        </div>

        <!-- BMI Value -->
        <div class="text-center">
          <div class="inline-flex items-baseline gap-3 px-8 py-4 border-2 bg-white" :class="currentColor.bg.replace('bg-', 'border-')">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent" :class="currentColor.gradient">
              {{ result.bmi }}
            </span>
            <span class="font-game text-lg text-gray-500">BMI</span>
          </div>
          <p class="mt-4 font-pixel text-base sm:text-lg tracking-wide" :class="currentColor.text">
            {{ ranges[result.category].label.toUpperCase() }}
          </p>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard title="Your Weight" :value="inputs.weight as number" unit="kg" color="teal" size="sm" />
          <CalculatorResultCard title="Your Height" :value="inputs.height as number" unit="cm" color="teal" size="sm" />
        </div>

        <!-- Healthy Range -->
        <div class="relative p-4 border-2 border-teal-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-teal-700 tracking-wide mb-2">HEALTHY WEIGHT RANGE</p>
          <p class="font-game text-lg sm:text-xl text-teal-700 font-semibold">
            {{ result.healthyRange.min }} - {{ result.healthyRange.max }} kg
          </p>
          <p class="font-game text-sm text-gray-500 mt-1">Based on your height</p>
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT BMI</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">BMI is a useful screening tool, but it doesn't directly measure body fat. Muscular individuals may have a high BMI without excess fat.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FORMULA</h3>
          <div class="relative p-4 border-2 border-teal-300 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
            <p class="font-mono text-base sm:text-lg text-teal-700">BMI = weight (kg) / height (m)²</p>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">LIMITATIONS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span>Does not distinguish between fat and muscle mass</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span>May not be accurate for athletes or elderly</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span>Different ethnic groups may have different risk thresholds</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
