<script setup lang="ts">
import type { SleepResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Sleep Calculator',
    description: 'Find your recommended sleep duration based on age',
    shortDescription: 'Discover how many hours of sleep you need per night based on your age group, using National Sleep Foundation guidelines.',
    path: '/sleep-calculator',
    color: 'blue',
    contentPath: 'calculators/sleep-calculator',
  },
  seo: {
    title: 'Sleep Calculator - Recommended Sleep Duration by Age',
    description: 'Find out how many hours of sleep you need per night. Age-based sleep recommendations from the National Sleep Foundation for optimal health.',
    path: '/sleep-calculator',
  },
  schema: {
    name: 'Sleep Calculator',
    description: 'Calculate recommended sleep duration based on age group',
    url: '/sleep-calculator',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Sleep Calculator', url: '/sleep-calculator' },
  ],
  inputs: [
    { key: 'age', label: 'Age', type: 'slider', min: 0, max: 100, default: 30, unit: 'years' },
  ],
}

const { calculate } = useSleep()

const { inputs, result, error } = useCalculatorSetup<SleepResult>(
  config,
  (i) => calculate({ age: Number(i.age) })
)

const age = computed(() => Number(inputs.value.age))

// Visual bar width calculation
const recBarWidth = computed(() => {
  if (!result.value) return { left: '0%', width: '0%' }
  const min = result.value.recommended.min
  const max = result.value.recommended.max
  return {
    left: `${(min / 24) * 100}%`,
    width: `${((max - min) / 24) * 100}%`,
  }
})

const accBarWidth = computed(() => {
  if (!result.value) return { left: '0%', width: '0%' }
  const min = result.value.acceptable.min
  const max = result.value.acceptable.max
  return {
    left: `${(min / 24) * 100}%`,
    width: `${((max - min) / 24) * 100}%`,
  }
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #results>
      <div v-if="error" class="p-4 border-2 border-red-300 bg-red-50 mb-6">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-red-500" />
          <span class="font-pixel text-xs text-red-700">ERROR</span>
        </div>
        <p class="font-game text-sm text-red-600 mt-2">{{ error }}</p>
      </div>
      <div v-if="result" class="space-y-6">
        <!-- Age Group -->
        <div class="relative text-center p-4 border-2 border-blue-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-1 tracking-wide">AGE GROUP</p>
          <p class="font-game text-lg sm:text-xl font-bold text-blue-700">{{ result.ageGroup }}</p>
        </div>

        <!-- Recommended Hours -->
        <div class="relative text-center p-6 border-2 border-blue-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">RECOMMENDED SLEEP</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {{ result.recommended.min }}-{{ result.recommended.max }}
            </span>
            <span class="font-game text-lg text-gray-500">hours</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">per night for age {{ age }}</p>
        </div>

        <!-- Acceptable Range -->
        <div class="relative p-4 border-2 border-blue-200 bg-white flex items-center justify-between">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
          <div class="pl-2">
            <p class="font-pixel text-[10px] sm:text-xs text-gray-700 tracking-wide">ACCEPTABLE RANGE</p>
            <p class="font-game text-xs text-gray-500">May be appropriate for some individuals</p>
          </div>
          <div class="text-right">
            <span class="font-game text-2xl sm:text-3xl font-bold text-blue-700">{{ result.acceptable.min }}-{{ result.acceptable.max }}</span>
            <span class="font-game text-sm text-gray-500"> hrs</span>
          </div>
        </div>

        <!-- Visual Sleep Bar -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-blue-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">SLEEP RANGE VISUAL</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="relative h-10 border-2 border-gray-200 bg-gray-50">
            <!-- Acceptable range (wider, lighter) -->
            <div
              class="absolute top-0 bottom-0 bg-blue-100 border-l border-r border-blue-300"
              :style="{ left: accBarWidth.left, width: accBarWidth.width }"
            />
            <!-- Recommended range (narrower, darker) -->
            <div
              class="absolute top-0 bottom-0 bg-blue-500"
              :style="{ left: recBarWidth.left, width: recBarWidth.width }"
            />
          </div>
          <div class="flex justify-between font-game text-xs text-gray-400 mt-1">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
          <div class="flex items-center gap-4 mt-3">
            <div class="flex items-center gap-2">
              <div class="w-4 h-3 bg-blue-500" />
              <span class="font-game text-xs text-gray-600">Recommended</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-3 bg-blue-100 border border-blue-300" />
              <span class="font-game text-xs text-gray-600">Acceptable</span>
            </div>
          </div>
        </div>

        <!-- Not Recommended -->
        <div class="grid grid-cols-2 gap-3">
          <div class="relative p-3 border-2 border-red-200 bg-white text-center">
            <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
            <p class="font-pixel text-[10px] text-red-700 mb-1 tracking-wide">TOO LITTLE</p>
            <p class="font-game text-lg font-bold text-red-600">&lt; {{ result.notRecommended.below }}h</p>
          </div>
          <div class="relative p-3 border-2 border-red-200 bg-white text-center">
            <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
            <p class="font-pixel text-[10px] text-red-700 mb-1 tracking-wide">TOO MUCH</p>
            <p class="font-game text-lg font-bold text-red-600">&gt; {{ result.notRecommended.above }}h</p>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT SLEEP DURATION</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Sleep recommendations are based on the National Sleep Foundation's 2015 expert panel, which reviewed over 300 studies to establish age-specific guidelines.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HOW IT WORKS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span>Lookup-based table by age group</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Recommended:</strong> Ideal range for most people</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Acceptable:</strong> May suit some individuals</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">TIPS FOR BETTER SLEEP</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span>Keep a consistent sleep schedule</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span>Avoid screens 1 hour before bed</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-blue-500 mt-2 flex-shrink-0" />
              <span>Keep bedroom cool (18-20C) and dark</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
