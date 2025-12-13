<script setup lang="ts">
import type { BodyFatResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Body Fat Calculator',
    description: 'Estimate your body fat percentage using the Deurenberg formula',
    shortDescription: 'Estimate your body fat percentage to understand your body composition and set realistic fitness goals.',
    path: '/body-fat',
    color: 'teal',
    contentPath: 'calculators/body-fat',
  },
  seo: {
    title: 'Body Fat Calculator - Estimate Your Body Fat Percentage',
    description: 'Free body fat percentage calculator using the Deurenberg formula. Find out your body fat percentage, fat mass, and lean mass based on your measurements.',
    path: '/body-fat',
  },
  schema: {
    name: 'Body Fat Calculator',
    description: 'Estimate your body fat percentage using the Deurenberg formula',
    url: '/body-fat',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Body Fat Calculator', url: '/body-fat' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
    { key: 'age', label: 'Age', type: 'slider', min: 15, max: 100, default: 30, unit: 'years' },
  ],
}

// Calculator
const { calculate, getRanges } = useBodyFat()

const inputs = ref<Record<string, number | string>>({
  gender: 'male',
  weight: 70,
  height: 170,
  age: 30,
})

const result = ref<BodyFatResult | null>(null)

const calculateBodyFat = () => {
  result.value = calculate({
    weight: inputs.value.weight as number,
    height: inputs.value.height as number,
    age: inputs.value.age as number,
    gender: inputs.value.gender as 'male' | 'female',
  })
}

onMounted(calculateBodyFat)
watch(inputs, calculateBodyFat, { deep: true })

// Category colors
const categoryColors: Record<string, { bg: string; text: string; bar: string }> = {
  'Essential Fat': { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
  'Athletes': { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' },
  'Fitness': { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  'Average': { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500' },
  'Obese': { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
}

const currentColor = computed(() => {
  if (!result.value) return categoryColors['Average']
  return categoryColors[result.value.category] || categoryColors['Average']
})

const ranges = computed(() => getRanges(inputs.value.gender as 'male' | 'female'))
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #reference>
      <div class="mt-8">
        <h3 class="text-sm font-medium text-gray-700 mb-3">
          Body Fat Categories ({{ inputs.gender === 'male' ? 'Men' : 'Women' }})
        </h3>
        <div class="space-y-2">
          <div
            v-for="range in ranges"
            :key="range.label"
            class="flex items-center justify-between p-2 rounded-lg text-sm"
            :class="categoryColors[range.label]?.bg || 'bg-gray-50'"
          >
            <span :class="categoryColors[range.label]?.text || 'text-gray-700'">
              {{ range.label }}
            </span>
            <span class="text-gray-500">
              {{ range.max < 100 ? `< ${range.max}%` : '> 25%' }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Body Fat Display -->
        <div class="text-center p-6 rounded-2xl" :class="currentColor.bg">
          <p class="text-sm text-gray-500 mb-2">Your Body Fat Percentage</p>
          <div class="flex items-baseline justify-center gap-1">
            <span class="text-5xl font-bold" :class="currentColor.text">
              {{ result.percentage }}
            </span>
            <span class="text-2xl" :class="currentColor.text">%</span>
          </div>
          <p class="mt-2 font-medium" :class="currentColor.text">
            {{ result.category }}
          </p>
        </div>

        <!-- Visual Bar -->
        <div>
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>0%</span>
            <span>50%</span>
          </div>
          <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-500 rounded-full"
              :class="currentColor.bar"
              :style="{ width: `${Math.min(result.percentage * 2, 100)}%` }"
            />
          </div>
        </div>

        <!-- Composition -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Body Composition</h3>
          <div class="h-8 bg-gray-100 rounded-full overflow-hidden flex">
            <div
              class="h-full bg-orange-400 transition-all duration-500"
              :style="{ width: `${result.percentage}%` }"
            />
            <div
              class="h-full bg-teal-400 transition-all duration-500"
              :style="{ width: `${100 - result.percentage}%` }"
            />
          </div>
          <div class="flex justify-between mt-2 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-orange-400" />
              <span class="text-gray-600">Fat: {{ result.percentage }}%</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-teal-400" />
              <span class="text-gray-600">Lean: {{ (100 - result.percentage).toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <!-- Mass Values -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard title="Fat Mass" :value="result.fatMass" unit="kg" color="orange" size="sm" />
          <CalculatorResultCard title="Lean Mass" :value="result.leanMass" unit="kg" color="teal" size="sm" />
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About Body Fat Percentage</h2>
      <div class="prose prose-gray max-w-none">
        <p>This calculator uses the Deurenberg formula to estimate body fat percentage based on BMI, age, and gender.</p>
        <h3 class="text-lg font-medium mt-4 mb-2">Deurenberg Formula</h3>
        <div class="font-mono text-sm bg-gray-50 p-3 rounded-lg space-y-1">
          <p><strong>Men:</strong> (1.20 × BMI) + (0.23 × age) - 16.2</p>
          <p><strong>Women:</strong> (1.20 × BMI) + (0.23 × age) - 5.4</p>
        </div>
        <h3 class="text-lg font-medium mt-4 mb-2">Limitations</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>This is an estimate based on BMI, not direct measurement</li>
          <li>For more accurate results, consider DEXA scan or calipers</li>
          <li>Athletes may have inaccurate results due to muscle mass</li>
        </ul>
      </div>
    </template>
  </CalculatorPage>
</template>
