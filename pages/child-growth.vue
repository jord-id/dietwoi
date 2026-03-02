<script setup lang="ts">
import type { ChildGrowthResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Child Growth Calculator',
    description: 'Check growth percentiles for children aged 0-20 years',
    shortDescription: 'Enter your child\'s age, weight, height, and gender to estimate growth percentiles based on WHO median data.',
    path: '/child-growth',
    color: 'cyan',
    contentPath: 'calculators/child-growth',
  },
  seo: {
    title: 'Child Growth Calculator - Weight & Height Percentiles',
    description: 'Free child growth calculator using WHO growth standards. Check weight and height percentiles for children aged 0-20 years.',
    path: '/child-growth',
  },
  schema: {
    name: 'Child Growth Calculator',
    description: 'Check growth percentiles for children aged 0-20 years using WHO standards',
    url: '/child-growth',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Child Growth Calculator', url: '/child-growth' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'ageMonths', label: 'Age', type: 'slider', min: 0, max: 240, default: 36, unit: 'months' },
    { key: 'weight', label: 'Weight', type: 'slider', min: 1, max: 100, default: 14, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 30, max: 200, default: 96, unit: 'cm' },
  ],
}

const { calculate } = useChildGrowth()

const { inputs, result, error } = useCalculatorSetup<ChildGrowthResult>(
  config,
  (i) => calculate({
    ageMonths: Number(i.ageMonths),
    weight: Number(i.weight),
    height: Number(i.height),
    gender: i.gender as 'male' | 'female',
  })
)

const percentileColors: Record<string, { text: string; border: string; bg: string }> = {
  'Below 3rd': { text: 'text-red-700', border: 'border-red-300', bg: 'bg-red-50' },
  '3rd-15th': { text: 'text-yellow-700', border: 'border-yellow-300', bg: 'bg-yellow-50' },
  '15th-85th (Normal)': { text: 'text-green-700', border: 'border-green-300', bg: 'bg-green-50' },
  '85th-97th': { text: 'text-yellow-700', border: 'border-yellow-300', bg: 'bg-yellow-50' },
  'Above 97th': { text: 'text-red-700', border: 'border-red-300', bg: 'bg-red-50' },
}

const getPercentileColor = (percentile: string) => {
  return percentileColors[percentile] || percentileColors['15th-85th (Normal)']
}

const ageDisplay = computed(() => {
  const months = Number(inputs.value.ageMonths)
  if (months < 24) return `${months} months`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years}y ${rem}m` : `${years} years`
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #results>
      <CalculatorDisclaimer />

      <!-- Error -->
      <div v-if="error" class="p-4 border-2 border-red-300 bg-red-50 mb-6">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-red-500" />
          <span class="font-pixel text-xs text-red-700">ERROR</span>
        </div>
        <p class="font-game text-sm text-red-600 mt-2">{{ error }}</p>
      </div>

      <div v-if="result" class="space-y-6">
        <!-- Age Display -->
        <div class="relative text-center p-4 border-2 border-cyan-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-sky-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-1 tracking-wide">CHILD AGE</p>
          <p class="font-game text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">
            {{ ageDisplay }}
          </p>
        </div>

        <!-- Weight Percentile -->
        <div class="relative p-4 border-2 bg-white" :class="getPercentileColor(result.weightPercentile).border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 tracking-wide mb-2">WEIGHT PERCENTILE</p>
          <p class="font-pixel text-base sm:text-lg tracking-wide" :class="getPercentileColor(result.weightPercentile).text">
            {{ result.weightPercentile.toUpperCase() }}
          </p>
          <p class="font-game text-sm text-gray-600 mt-2">{{ result.weightInterpretation }}</p>
        </div>

        <!-- Height Percentile -->
        <div class="relative p-4 border-2 bg-white" :class="getPercentileColor(result.heightPercentile).border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 tracking-wide mb-2">HEIGHT PERCENTILE</p>
          <p class="font-pixel text-base sm:text-lg tracking-wide" :class="getPercentileColor(result.heightPercentile).text">
            {{ result.heightPercentile.toUpperCase() }}
          </p>
          <p class="font-game text-sm text-gray-600 mt-2">{{ result.heightInterpretation }}</p>
        </div>

        <!-- Input Summary -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard
            title="Weight"
            :value="Number(inputs.weight)"
            unit="kg"
            color="cyan"
            size="sm"
          />
          <CalculatorResultCard
            title="Height"
            :value="Number(inputs.height)"
            unit="cm"
            color="cyan"
            size="sm"
          />
        </div>

        <!-- Note -->
        <div class="relative p-4 border-2 border-cyan-200 bg-cyan-50">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
          <p class="font-game text-xs sm:text-sm text-cyan-700 pl-2">
            Uses simplified percentile estimation based on WHO median values. For clinical use, consult official WHO/CDC growth charts with your pediatrician.
          </p>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT CHILD GROWTH</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
          Growth charts are used to track a child's growth over time. Percentiles compare your child's measurements to other children of the same age and gender.
        </p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">WHO GROWTH STANDARDS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span>WHO standards cover ages 0-5 years (prescriptive)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span>WHO references cover ages 5-19 years (descriptive)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span>Based on data from healthy, breastfed children worldwide</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">UNDERSTANDING PERCENTILES</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>15th-85th percentile:</strong> Normal growth range</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>Below 3rd percentile:</strong> May indicate undernutrition</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>Above 97th percentile:</strong> May indicate overnutrition</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span>The trend matters more than a single measurement</span>
            </li>
          </ul>
        </div>

        <div class="relative p-4 border-2 border-cyan-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          <p class="font-game text-sm sm:text-base text-cyan-700">
            <strong>Source:</strong> WHO Child Growth Standards (2006) and WHO Reference 2007 for school-age children and adolescents.
          </p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
