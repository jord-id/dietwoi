<script setup lang="ts">
import type { BmiResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index to assess your weight category',
    shortDescription: 'Body Mass Index (BMI) is a measure of body fat based on height and weight. It applies to adult men and women.',
    path: '/bmi',
    color: 'purple',
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
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config" inputs-title="Your Measurements">
    <template #reference>
      <div class="mt-8 grid grid-cols-2 gap-3">
        <div
          v-for="(range, key) in ranges"
          :key="key"
          class="p-3 rounded-xl"
          :class="categoryColors[key].bg"
        >
          <p class="text-xs font-medium" :class="categoryColors[key].text">
            {{ range.label }}
          </p>
          <p class="text-sm text-gray-600 mt-1">
            <template v-if="key === 'underweight'">Below 18.5</template>
            <template v-else-if="key === 'normal'">18.5 - 24.9</template>
            <template v-else-if="key === 'overweight'">25.0 - 29.9</template>
            <template v-else>30.0 and above</template>
          </p>
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
          <div class="inline-flex items-baseline gap-2 px-6 py-3 rounded-2xl" :class="currentColor.bg">
            <span class="text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent" :class="currentColor.gradient">
              {{ result.bmi }}
            </span>
            <span class="text-gray-500">BMI</span>
          </div>
          <p class="mt-3 text-lg font-medium" :class="currentColor.text">
            {{ ranges[result.category].label }}
          </p>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard title="Your Weight" :value="inputs.weight as number" unit="kg" color="purple" size="sm" />
          <CalculatorResultCard title="Your Height" :value="inputs.height as number" unit="cm" color="purple" size="sm" />
        </div>

        <!-- Healthy Range -->
        <div class="p-4 bg-green-50 rounded-xl">
          <p class="text-sm text-green-700">
            <span class="font-medium">Healthy weight range for your height:</span>
            <br >
            {{ result.healthyRange.min }} - {{ result.healthyRange.max }} kg
          </p>
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About BMI</h2>
      <div class="prose prose-gray max-w-none">
        <p>BMI is a useful screening tool, but it doesn't directly measure body fat. Muscular individuals may have a high BMI without excess fat.</p>
        <h3 class="text-lg font-medium mt-4 mb-2">Formula</h3>
        <p class="font-mono text-sm bg-gray-50 p-3 rounded-lg">BMI = weight (kg) / height (m)²</p>
        <h3 class="text-lg font-medium mt-4 mb-2">Limitations</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Does not distinguish between fat and muscle mass</li>
          <li>May not be accurate for athletes or elderly</li>
          <li>Different ethnic groups may have different risk thresholds</li>
        </ul>
      </div>
    </template>
  </CalculatorPage>
</template>
