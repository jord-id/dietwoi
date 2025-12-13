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

// Category colors for result display
const categoryColors: Record<string, { bg: string; text: string; bar: string }> = {
  'Essential Fat': { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
  'Athletes': { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' },
  'Fitness': { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  'Average': { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500' },
  'Obese': { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
}

// Range colors for body fat categories in reference section
const rangeColors: Record<string, { border: string; bar: string; text: string }> = {
  'Essential Fat': { border: 'border-blue-200', bar: 'bg-blue-500', text: 'text-blue-700' },
  'Athletes': { border: 'border-green-200', bar: 'bg-green-500', text: 'text-green-700' },
  'Fitness': { border: 'border-emerald-200', bar: 'bg-emerald-500', text: 'text-emerald-700' },
  'Average': { border: 'border-yellow-200', bar: 'bg-yellow-500', text: 'text-yellow-700' },
  'Obese': { border: 'border-red-200', bar: 'bg-red-500', text: 'text-red-700' },
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
      <div class="mt-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-3 h-3 bg-teal-500" />
          <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">
            BODY FAT CATEGORIES ({{ inputs.gender === 'male' ? 'MEN' : 'WOMEN' }})
          </span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>
        <div class="space-y-2">
          <div
            v-for="range in ranges"
            :key="range.label"
            class="relative flex items-center justify-between p-3 border-2 bg-white"
            :class="rangeColors[range.label]?.border"
          >
            <div class="absolute left-0 top-0 bottom-0 w-1" :class="rangeColors[range.label]?.bar" />
            <span class="pl-2 font-pixel text-[10px] sm:text-xs tracking-wide" :class="rangeColors[range.label]?.text">
              {{ range.label.toUpperCase() }}
            </span>
            <span class="font-game text-sm sm:text-base text-gray-600">
              {{ range.max < 100 ? `< ${range.max}%` : '> 25%' }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Body Fat Display -->
        <div class="relative text-center p-6 border-2 border-teal-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR BODY FAT PERCENTAGE</p>
          <div class="flex items-baseline justify-center gap-1">
            <span class="font-game text-5xl sm:text-6xl font-bold text-teal-600">
              {{ result.percentage }}
            </span>
            <span class="font-game text-2xl text-teal-600">%</span>
          </div>
          <p class="mt-2 font-pixel text-xs sm:text-sm tracking-wide text-teal-700">
            {{ result.category.toUpperCase() }}
          </p>
        </div>

        <!-- Visual Bar -->
        <div>
          <div class="flex justify-between font-pixel text-[10px] text-gray-500 mb-1">
            <span>0%</span>
            <span>50%</span>
          </div>
          <div class="h-4 bg-gray-200 border border-gray-300">
            <div
              class="h-full bg-teal-500"
              :style="{ width: `${Math.min(result.percentage * 2, 100)}%` }"
            />
          </div>
        </div>

        <!-- Composition -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-teal-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">BODY COMPOSITION</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="h-8 bg-gray-200 border border-gray-300 flex">
            <div
              class="h-full bg-teal-400"
              :style="{ width: `${result.percentage}%` }"
            />
            <div
              class="h-full bg-teal-600"
              :style="{ width: `${100 - result.percentage}%` }"
            />
          </div>
          <div class="flex justify-between mt-2">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-teal-400" />
              <span class="font-game text-sm text-gray-600">Fat: {{ result.percentage }}%</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-teal-600" />
              <span class="font-game text-sm text-gray-600">Lean: {{ (100 - result.percentage).toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <!-- Mass Values -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard title="Fat Mass" :value="result.fatMass" unit="kg" color="teal" size="sm" />
          <CalculatorResultCard title="Lean Mass" :value="result.leanMass" unit="kg" color="teal" size="sm" />
        </div>
      </div>
    </template>
    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT BODY FAT PERCENTAGE</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">This calculator uses the Deurenberg formula to estimate body fat percentage based on BMI, age, and gender.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">DEURENBERG FORMULA</h3>
          <div class="relative p-4 border-2 border-teal-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
            <div class="font-mono text-sm sm:text-base text-teal-700 space-y-1">
              <p><strong>Men:</strong> (1.20 × BMI) + (0.23 × age) - 16.2</p>
              <p><strong>Women:</strong> (1.20 × BMI) + (0.23 × age) - 5.4</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">LIMITATIONS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span>This is an estimate based on BMI, not direct measurement</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span>For more accurate results, consider DEXA scan or calipers</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span>Athletes may have inaccurate results due to muscle mass</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
