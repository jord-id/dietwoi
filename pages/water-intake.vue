<script setup lang="ts">
import type { WaterIntakeResult, ActivityLevel, ClimateLevel } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Water Intake Calculator',
    description: 'Calculate your daily water intake based on weight, activity, and lifestyle factors',
    shortDescription: 'Calculate your daily water intake needs based on your body weight, activity level, climate, and special conditions to stay properly hydrated.',
    path: '/water-intake',
    color: 'cyan',
    contentPath: 'calculators/water-intake',
  },
  seo: {
    title: 'Water Intake Calculator - Daily Hydration Needs',
    description: 'Calculate your daily water intake requirements based on weight, activity level, climate, and lifestyle factors. Get personalized hydration recommendations for optimal health.',
    path: '/water-intake',
  },
  schema: {
    name: 'Water Intake Calculator',
    description: 'Calculate your daily water intake based on weight, activity, and lifestyle factors',
    url: '/water-intake',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Water Intake Calculator', url: '/water-intake' },
  ],
  inputs: [
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'activityLevel', label: 'Activity Level', type: 'activity', default: 'moderate' },
  ],
}

// Calculator
const { calculate } = useWaterIntake()

const inputs = ref<Record<string, number | string | boolean>>({
  weight: 70,
  activityLevel: 'moderate',
  climate: 'normal',
  highProtein: false,
  pregnant: false,
  breastfeeding: false,
})

// Type-safe accessors (centralized type narrowing)
const weight = computed(() => Number(inputs.value.weight))
const activityLevel = computed(() => inputs.value.activityLevel as ActivityLevel)
const climate = computed(() => inputs.value.climate as ClimateLevel)
const highProtein = computed(() => Boolean(inputs.value.highProtein))
const pregnant = computed(() => Boolean(inputs.value.pregnant))
const breastfeeding = computed(() => Boolean(inputs.value.breastfeeding))

const result = ref<WaterIntakeResult | null>(null)

const calculateWater = () => {
  result.value = calculate({
    weight: weight.value,
    activityLevel: activityLevel.value,
    climate: climate.value,
    highProtein: highProtein.value,
    pregnant: pregnant.value,
    breastfeeding: breastfeeding.value,
  })
}

onMounted(calculateWater)
watch(inputs, calculateWater, { deep: true })
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Climate Selector -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">CLIMATE</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="relative p-3 border-2 bg-white text-center transition-all"
            :class="inputs.climate === 'normal' ? 'border-cyan-500' : 'border-gray-200 hover:border-gray-300'"
            @click="inputs.climate = 'normal'"
          >
            <div v-if="inputs.climate === 'normal'" class="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="inputs.climate === 'normal' ? 'text-cyan-700' : 'text-gray-600'">NORMAL</span>
          </button>
          <button
            type="button"
            class="relative p-3 border-2 bg-white text-center transition-all"
            :class="inputs.climate === 'hot' ? 'border-cyan-500' : 'border-gray-200 hover:border-gray-300'"
            @click="inputs.climate = 'hot'"
          >
            <div v-if="inputs.climate === 'hot'" class="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="inputs.climate === 'hot' ? 'text-cyan-700' : 'text-gray-600'">HOT</span>
          </button>
        </div>
      </div>

      <!-- Special Conditions -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">SPECIAL CONDITIONS</label>
        <div class="space-y-2">
          <label class="relative flex items-center gap-3 p-3 border-2 cursor-pointer transition-all" :class="inputs.highProtein ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-300 bg-white'">
            <div v-if="inputs.highProtein" class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
            <input
              v-model="inputs.highProtein"
              type="checkbox"
              class="w-4 h-4 accent-cyan-500"
            >
            <span class="font-game text-sm" :class="inputs.highProtein ? 'text-cyan-700' : 'text-gray-700'">High Protein Diet</span>
          </label>
          <label class="relative flex items-center gap-3 p-3 border-2 cursor-pointer transition-all" :class="inputs.pregnant ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-300 bg-white'">
            <div v-if="inputs.pregnant" class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
            <input
              v-model="inputs.pregnant"
              type="checkbox"
              class="w-4 h-4 accent-cyan-500"
            >
            <span class="font-game text-sm" :class="inputs.pregnant ? 'text-cyan-700' : 'text-gray-700'">Pregnant</span>
          </label>
          <label class="relative flex items-center gap-3 p-3 border-2 cursor-pointer transition-all" :class="inputs.breastfeeding ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-300 bg-white'">
            <div v-if="inputs.breastfeeding" class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
            <input
              v-model="inputs.breastfeeding"
              type="checkbox"
              class="w-4 h-4 accent-cyan-500"
            >
            <span class="font-game text-sm" :class="inputs.breastfeeding ? 'text-cyan-700' : 'text-gray-700'">Breastfeeding</span>
          </label>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Total Water Display -->
        <div class="relative text-center p-6 border-2 border-cyan-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-sky-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">DAILY WATER INTAKE</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">
              {{ result.liters }}
            </span>
            <span class="font-game text-lg text-gray-500">liters</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">{{ result.total.toLocaleString() }} ml/day</p>
        </div>

        <!-- Glasses Visual -->
        <div class="relative p-6 border-2 border-cyan-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-cyan-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">GLASSES OF WATER (250ML EACH)</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="flex flex-wrap gap-2 justify-center">
            <div
              v-for="glass in result.glasses"
              :key="glass"
              class="w-8 h-10 border-2 border-cyan-400 bg-cyan-500 flex items-center justify-center"
              title="250ml glass"
            >
              <div class="text-white font-game text-xs font-bold">{{ glass }}</div>
            </div>
          </div>
          <p class="text-center font-game text-sm text-gray-600 mt-4">
            {{ result.glasses }} glasses per day
          </p>
        </div>

        <!-- Recommendation -->
        <div class="relative p-4 border-2 border-cyan-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
          <p class="font-game text-sm sm:text-base text-cyan-800">{{ result.recommendation }}</p>
        </div>

        <!-- Breakdown -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-cyan-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">WATER INTAKE BREAKDOWN</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="space-y-2">
            <div class="relative flex justify-between items-center p-3 border-2 border-cyan-200 bg-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
              <span class="pl-2 font-game text-sm text-gray-600">Baseline ({{ weight }}kg)</span>
              <span class="font-game text-sm font-semibold text-cyan-700">{{ result.baseline }} ml</span>
            </div>
            <div v-if="result.adjustments.exercise > 0" class="relative flex justify-between items-center p-3 border-2 border-cyan-200 bg-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
              <span class="pl-2 font-game text-sm text-gray-600">Exercise</span>
              <span class="font-game text-sm font-semibold text-cyan-700">+{{ result.adjustments.exercise }} ml</span>
            </div>
            <div v-if="result.adjustments.climate > 0" class="relative flex justify-between items-center p-3 border-2 border-cyan-200 bg-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
              <span class="pl-2 font-game text-sm text-gray-600">Hot Climate</span>
              <span class="font-game text-sm font-semibold text-cyan-700">+{{ result.adjustments.climate }} ml</span>
            </div>
            <div v-if="result.adjustments.highProtein > 0" class="relative flex justify-between items-center p-3 border-2 border-cyan-200 bg-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
              <span class="pl-2 font-game text-sm text-gray-600">High Protein Diet</span>
              <span class="font-game text-sm font-semibold text-cyan-700">+{{ result.adjustments.highProtein }} ml</span>
            </div>
            <div v-if="result.adjustments.pregnancy > 0" class="relative flex justify-between items-center p-3 border-2 border-cyan-200 bg-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
              <span class="pl-2 font-game text-sm text-gray-600">Pregnancy</span>
              <span class="font-game text-sm font-semibold text-cyan-700">+{{ result.adjustments.pregnancy }} ml</span>
            </div>
            <div v-if="result.adjustments.breastfeeding > 0" class="relative flex justify-between items-center p-3 border-2 border-cyan-200 bg-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
              <span class="pl-2 font-game text-sm text-gray-600">Breastfeeding</span>
              <span class="font-game text-sm font-semibold text-cyan-700">+{{ result.adjustments.breastfeeding }} ml</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT WATER INTAKE</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Proper hydration is essential for optimal health. Your daily water needs depend on several factors.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FORMULA</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>Baseline:</strong> weight (kg) × 33 ml</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>Exercise:</strong> +250-1000 ml based on activity</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>Hot Climate:</strong> +750 ml</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">GENERAL GUIDELINES</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>Men:</strong> ~3 liters/day</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>Women:</strong> ~2.2 liters/day</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span>Urine color should be pale yellow</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
