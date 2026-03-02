<script setup lang="ts">
import type { CalculatorConfig } from '~/types/calculator'
import type { ProteinGoal } from '~/composables/useCalculations'

const config: CalculatorConfig = {
  meta: {
    title: 'Protein Calculator',
    description: 'Calculate your optimal daily protein intake based on body weight and fitness goals',
    shortDescription: 'Find your ideal protein range for sedentary life, sports, muscle gain, or cutting. Based on ISSN position stand recommendations.',
    path: '/protein',
    color: 'red',
    contentPath: 'calculators/protein',
  },
  seo: {
    title: 'Protein Calculator - Daily Intake for Your Goals',
    description: 'Calculate optimal protein intake based on your weight and goals. Get personalized daily and per-meal protein targets backed by ISSN research.',
    path: '/protein',
  },
  schema: {
    name: 'Protein Calculator',
    description: 'Calculate optimal daily protein intake for fitness goals',
    url: '/protein',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Protein Calculator', url: '/protein' },
  ],
  inputs: [
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
  ],
}

// Goal options
const GOALS: { value: ProteinGoal; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'recreational', label: 'Recreational' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'strength-maintain', label: 'Strength Maintain' },
  { value: 'strength-gain', label: 'Strength Gain' },
  { value: 'deficit', label: 'Caloric Deficit' },
  { value: 'elderly', label: 'Elderly (65+)' },
]

// State
const { calculate } = useProtein()

const inputs = ref<Record<string, number | string>>({
  weight: 70,
})

const weight = computed(() => Number(inputs.value.weight))

const selectedGoal = ref<ProteinGoal>('recreational')

// Calculations
const result = computed(() => {
  return calculate({
    weight: weight.value,
    goal: selectedGoal.value,
  })
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Goal Selection -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">YOUR GOAL</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="goal in GOALS"
            :key="goal.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="selectedGoal === goal.value
              ? 'border-red-500'
              : 'border-gray-200 hover:border-gray-300'"
            @click="selectedGoal = goal.value"
          >
            <div v-if="selectedGoal === goal.value" class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="selectedGoal === goal.value ? 'text-red-700' : 'text-gray-600'">{{ goal.label.toUpperCase() }}</span>
          </button>
        </div>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- Goal Label -->
        <div class="relative p-4 border-2 border-red-200 bg-white">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
          <p class="pl-2 font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">SELECTED GOAL</p>
          <p class="pl-2 font-game text-lg sm:text-xl font-bold text-red-700">{{ result.goalLabel }}</p>
        </div>

        <!-- Daily Grams (prominent) -->
        <div class="relative text-center p-6 border-2 border-red-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">DAILY PROTEIN TARGET</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              {{ result.dailyGrams.min === result.dailyGrams.max ? result.dailyGrams.min : `${result.dailyGrams.min}-${result.dailyGrams.max}` }}
            </span>
            <span class="font-game text-lg text-gray-500">g/day</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">
            {{ result.perKg.min === result.perKg.max ? result.perKg.min : `${result.perKg.min}-${result.perKg.max}` }} g/kg body weight
          </p>
        </div>

        <!-- Per Meal & Per Kg Breakdown -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-red-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">BREAKDOWN</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="relative p-4 border-2 border-red-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">PER MEAL (4 MEALS)</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-red-700">
                {{ result.perMeal.min === result.perMeal.max ? result.perMeal.min : `${result.perMeal.min}-${result.perMeal.max}` }}g
              </p>
            </div>
            <div class="relative p-4 border-2 border-red-200 bg-white text-center">
              <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">PER KG BODY WEIGHT</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-red-700">
                {{ result.perKg.min === result.perKg.max ? result.perKg.min : `${result.perKg.min}-${result.perKg.max}` }}g
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT PROTEIN INTAKE</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Protein is essential for muscle repair, immune function, and satiety. Your optimal intake depends on your activity level and goals.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">ISSN POSITION STAND</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Sedentary adults: 0.8 g/kg/day (RDA minimum)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Active individuals: 1.4-2.0 g/kg/day</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>During caloric deficit: up to 2.4 g/kg/day to preserve muscle</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">TIMING RECOMMENDATIONS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Spread intake across 3-4 meals for optimal absorption</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>20-40g per meal maximizes muscle protein synthesis</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>No practical upper limit for healthy individuals with adequate hydration</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
