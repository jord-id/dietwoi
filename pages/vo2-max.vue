<script setup lang="ts">
import type { Vo2MaxResult, Vo2TestType } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'VO2 Max Calculator',
    description: 'Estimate your VO2 max using Cooper, 1.5 Mile Run, or Step Test methods',
    shortDescription: 'Estimate your aerobic fitness level (VO2 max) using the Cooper 12-min run, 1.5 mile run, or step test. Get a fitness classification based on your age and gender.',
    path: '/vo2-max',
    color: 'teal',
    contentPath: 'calculators/vo2-max',
  },
  seo: {
    title: 'VO2 Max Calculator - Cooper Test, 1.5 Mile Run & Step Test',
    description: 'Estimate your VO2 max and aerobic fitness level using the Cooper 12-min run test, 1.5 mile run, or step test. Get a fitness classification.',
    path: '/vo2-max',
  },
  schema: {
    name: 'VO2 Max Calculator',
    description: 'Estimate your VO2 max using multiple test methods',
    url: '/vo2-max',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'VO2 Max Calculator', url: '/vo2-max' },
  ],
  inputs: [],
}

// Manual state management since inputs change based on test type
const { calculate } = useVo2Max()

const inputs = ref<Record<string, number | string>>({})

const testType = ref<Vo2TestType>('cooper')
const distance = ref(2400)
const timeMin = ref(12)
const heartRate = ref(120)
const age = ref(30)
const gender = ref<'male' | 'female'>('male')

const TEST_TYPES: { value: Vo2TestType; label: string; description: string }[] = [
  { value: 'cooper', label: 'Cooper 12-min', description: 'Run as far as possible in 12 minutes' },
  { value: 'mile-run', label: '1.5 Mile Run', description: 'Run 1.5 miles as fast as possible' },
  { value: 'step-test', label: 'Step Test', description: '3-min step test, measure HR after' },
]

const result = computed<Vo2MaxResult | null>(() => {
  try {
    const input: any = {
      testType: testType.value,
      age: age.value,
      gender: gender.value,
    }
    if (testType.value === 'cooper') input.distanceM = distance.value
    else if (testType.value === 'mile-run') input.timeMin = timeMin.value
    else if (testType.value === 'step-test') input.heartRate = heartRate.value

    return calculate(input)
  } catch {
    return null
  }
})

// Classification colors
const classificationColor = computed(() => {
  if (!result.value) return 'text-gray-500'
  switch (result.value.classification) {
    case 'Excellent': return 'text-green-600'
    case 'Good': return 'text-blue-600'
    case 'Average': return 'text-yellow-600'
    case 'Below Average': return 'text-orange-600'
    case 'Poor': return 'text-red-600'
    default: return 'text-gray-600'
  }
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Test Type Selector -->
      <div class="mb-6">
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">TEST TYPE</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="test in TEST_TYPES"
            :key="test.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="testType === test.value
              ? 'border-teal-500'
              : 'border-gray-200 hover:border-gray-300'"
            @click="testType = test.value"
          >
            <div v-if="testType === test.value" class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
            <span class="block font-pixel text-[10px] sm:text-xs tracking-wide" :class="testType === test.value ? 'text-teal-700' : 'text-gray-600'">{{ test.label.toUpperCase() }}</span>
            <span class="block font-game text-[10px] sm:text-xs text-gray-400 mt-1">{{ test.description }}</span>
          </button>
        </div>
      </div>

      <!-- Conditional Inputs Based on Test Type -->
      <div v-if="testType === 'cooper'">
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">
          DISTANCE RUN IN 12 MIN
          <span class="font-game text-teal-600 float-right">{{ distance }} m</span>
        </label>
        <input
          v-model.number="distance"
          type="range"
          :min="400"
          :max="5000"
          :step="50"
          class="w-full accent-teal-500"
        >
        <div class="flex justify-between font-game text-xs text-gray-400 mt-1">
          <span>400m</span>
          <span>5000m</span>
        </div>
      </div>

      <div v-else-if="testType === 'mile-run'">
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">
          1.5 MILE RUN TIME
          <span class="font-game text-teal-600 float-right">{{ timeMin }} min</span>
        </label>
        <input
          v-model.number="timeMin"
          type="range"
          :min="5"
          :max="30"
          :step="0.5"
          class="w-full accent-teal-500"
        >
        <div class="flex justify-between font-game text-xs text-gray-400 mt-1">
          <span>5 min</span>
          <span>30 min</span>
        </div>
      </div>

      <div v-else-if="testType === 'step-test'">
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">
          HEART RATE AFTER TEST
          <span class="font-game text-teal-600 float-right">{{ heartRate }} bpm</span>
        </label>
        <input
          v-model.number="heartRate"
          type="range"
          :min="40"
          :max="200"
          :step="1"
          class="w-full accent-teal-500"
        >
        <div class="flex justify-between font-game text-xs text-gray-400 mt-1">
          <span>40 bpm</span>
          <span>200 bpm</span>
        </div>
      </div>

      <!-- Age and Gender for classification -->
      <div class="mt-4">
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">
          AGE
          <span class="font-game text-teal-600 float-right">{{ age }} years</span>
        </label>
        <input
          v-model.number="age"
          type="range"
          :min="10"
          :max="100"
          :step="1"
          class="w-full accent-teal-500"
        >
      </div>

      <div class="mt-4">
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">GENDER</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="gender === 'male' ? 'border-teal-500' : 'border-gray-200 hover:border-gray-300'"
            @click="gender = 'male'"
          >
            <div v-if="gender === 'male'" class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="gender === 'male' ? 'text-teal-700' : 'text-gray-600'">MALE</span>
          </button>
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="gender === 'female' ? 'border-teal-500' : 'border-gray-200 hover:border-gray-300'"
            @click="gender = 'female'"
          >
            <div v-if="gender === 'female'" class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="gender === 'female' ? 'text-teal-700' : 'text-gray-600'">FEMALE</span>
          </button>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- VO2 Max Value -->
        <div class="relative text-center p-6 border-2 border-teal-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR VO2 MAX</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              {{ result.vo2max }}
            </span>
            <span class="font-game text-lg text-gray-500">ml/kg/min</span>
          </div>
        </div>

        <!-- Classification -->
        <div class="relative p-4 border-2 border-teal-200 bg-white flex items-center justify-between">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
          <div class="pl-2">
            <p class="font-pixel text-[10px] sm:text-xs text-gray-700 tracking-wide">FITNESS LEVEL</p>
            <p class="font-game text-xs text-gray-500">For {{ gender }}, age {{ age }}</p>
          </div>
          <span class="font-game text-2xl sm:text-3xl font-bold" :class="classificationColor">{{ result.classification }}</span>
        </div>

        <!-- Test Info -->
        <div class="relative p-4 border-2 border-teal-200 bg-white">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
          <div class="pl-2">
            <p class="font-pixel text-[10px] sm:text-xs text-gray-700 tracking-wide">TEST METHOD</p>
            <p class="font-game text-sm text-gray-600 mt-1">
              <template v-if="testType === 'cooper'">Cooper 12-min Run ({{ distance }}m)</template>
              <template v-else-if="testType === 'mile-run'">1.5 Mile Run ({{ timeMin }} min)</template>
              <template v-else>Step Test ({{ heartRate }} bpm post-exercise)</template>
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT VO2 MAX</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">VO2 max measures the maximum amount of oxygen your body can use during exercise. It is the gold standard for aerobic fitness.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">TEST METHODS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Cooper (1968):</strong> Run as far as possible in 12 minutes on a flat surface. VO2 = (distance - 504.9) / 44.73</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>1.5 Mile Run:</strong> Run 1.5 miles as fast as possible. VO2 = 483 / time + 3.5</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-teal-500 mt-2 flex-shrink-0" />
              <span><strong>Step Test:</strong> Step up and down for 3 minutes, then measure heart rate for 1 minute. VO2 = 111.33 - 0.42 x HR</span>
            </li>
          </ul>
        </div>

        <div class="relative p-4 border-2 border-teal-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
          <p class="font-game text-sm sm:text-base text-teal-700"><strong>Note:</strong> These are field test estimates. Laboratory testing with a metabolic cart is the most accurate method. Estimates have a margin of error of 10-15%.</p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
