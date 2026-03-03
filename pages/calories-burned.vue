<script setup lang="ts">
import type { CaloriesBurnedResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Calories Burned Calculator',
    description: 'Calculate calories burned by activity using MET values',
    shortDescription: 'Estimate calories burned during exercise based on activity type, body weight, and duration using MET (Metabolic Equivalent of Task) values.',
    path: '/calories-burned',
    color: 'orange',
    contentPath: 'calculators/calories-burned',
  },
  seo: {
    title: 'Calories Burned Calculator - Exercise Calorie Estimator',
    description: 'Calculate calories burned during exercise using MET values. Choose from 15 activities including running, cycling, swimming, HIIT, and more.',
    path: '/calories-burned',
  },
  schema: {
    name: 'Calories Burned Calculator',
    description: 'Calculate calories burned by activity using MET values',
    url: '/calories-burned',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Calories Burned Calculator', url: '/calories-burned' },
  ],
  inputs: [],
}

// Manual state management since activity selection drives MET value
const { calculate, activities } = useCaloriesBurned()

const inputs = ref<Record<string, number | string>>({})

const selectedActivity = ref(activities[0].id)
const weight = ref(70)
const durationMin = ref(30)

const selectedMet = computed(() => {
  const activity = activities.find(a => a.id === selectedActivity.value)
  return activity?.met ?? activities[0].met
})

const selectedActivityName = computed(() => {
  const activity = activities.find(a => a.id === selectedActivity.value)
  return activity?.name ?? activities[0].name
})

const result = computed<CaloriesBurnedResult | null>(() => {
  try {
    return calculate({
      activityMet: selectedMet.value,
      weight: weight.value,
      durationMin: durationMin.value,
    })
  } catch {
    return null
  }
})

// Group activities by type for display
const activityGroups = computed(() => [
  { label: 'WALKING', items: activities.filter(a => a.id.startsWith('walking')) },
  { label: 'RUNNING', items: activities.filter(a => a.id.startsWith('running')) },
  { label: 'CYCLING', items: activities.filter(a => a.id.startsWith('cycling')) },
  { label: 'SWIMMING', items: activities.filter(a => a.id.startsWith('swimming')) },
  { label: 'STRENGTH', items: activities.filter(a => a.id.startsWith('weights')) },
  { label: 'OTHER', items: activities.filter(a => ['hiit', 'yoga', 'jump-rope'].includes(a.id)) },
])
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Activity Selector -->
      <div class="mb-4">
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">SELECT ACTIVITY</label>
        <div class="space-y-4">
          <div v-for="group in activityGroups" :key="group.label">
            <p class="font-pixel text-[10px] text-gray-500 tracking-wide mb-2">{{ group.label }}</p>
            <div class="grid grid-cols-1 gap-1">
              <button
                v-for="activity in group.items"
                :key="activity.id"
                class="relative flex items-center justify-between p-3 border-2 bg-white text-left"
                :class="selectedActivity === activity.id
                  ? 'border-orange-500'
                  : 'border-gray-200 hover:border-gray-300'"
                @click="selectedActivity = activity.id"
              >
                <div v-if="selectedActivity === activity.id" class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                <span class="font-game text-sm pl-2" :class="selectedActivity === activity.id ? 'text-orange-700' : 'text-gray-600'">{{ activity.name }}</span>
                <span class="font-game text-xs text-gray-400">MET {{ activity.met }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Weight Slider -->
      <div class="mb-4">
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">
          WEIGHT
          <span class="font-game text-orange-600 float-right">{{ weight }} kg</span>
        </label>
        <input
          v-model.number="weight"
          type="range"
          :min="30"
          :max="200"
          :step="1"
          class="w-full accent-orange-500"
        >
        <div class="flex justify-between font-game text-xs text-gray-400 mt-1">
          <span>30 kg</span>
          <span>200 kg</span>
        </div>
      </div>

      <!-- Duration Slider -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">
          DURATION
          <span class="font-game text-orange-600 float-right">{{ durationMin }} min</span>
        </label>
        <input
          v-model.number="durationMin"
          type="range"
          :min="1"
          :max="300"
          :step="1"
          class="w-full accent-orange-500"
        >
        <div class="flex justify-between font-game text-xs text-gray-400 mt-1">
          <span>1 min</span>
          <span>300 min</span>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Calories Burned (Large) -->
        <div class="relative text-center p-6 border-2 border-orange-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">CALORIES BURNED</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              {{ result.calories }}
            </span>
            <span class="font-game text-lg text-gray-500">kcal</span>
          </div>
          <p class="font-game text-xs text-gray-400 mt-2">{{ selectedActivityName }}</p>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-3">
          <CalculatorResultCard
            title="MET Value"
            :value="result.met"
            color="orange"
            size="sm"
            subtitle="Metabolic Equivalent"
          />
          <CalculatorResultCard
            title="Duration"
            :value="result.durationMin"
            unit="min"
            color="orange"
            size="sm"
          />
        </div>

        <!-- Calories per hour -->
        <div class="relative p-4 border-2 border-orange-200 bg-white flex items-center justify-between">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
          <div class="pl-2">
            <p class="font-pixel text-[10px] sm:text-xs text-gray-700 tracking-wide">CALORIES PER HOUR</p>
            <p class="font-game text-xs text-gray-500">At this intensity</p>
          </div>
          <div class="text-right">
            <span class="font-game text-2xl sm:text-3xl font-bold text-orange-700">{{ Math.round(result.calories * (60 / result.durationMin)) }}</span>
            <span class="font-game text-sm text-gray-500"> kcal/h</span>
          </div>
        </div>

        <!-- Accuracy Note -->
        <div class="relative p-4 border-2 border-amber-200 bg-amber-50">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
          <div class="pl-2">
            <p class="font-pixel text-[10px] sm:text-xs text-amber-700 tracking-wide mb-1">ACCURACY</p>
            <p class="font-game text-xs text-amber-600">MET-based estimates have a margin of error of 15-20%. Actual calories burned vary based on fitness level, body composition, and exercise intensity.</p>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT CALORIES BURNED</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Calories burned during exercise are estimated using MET (Metabolic Equivalent of Task) values from the Ainsworth 2011 Compendium of Physical Activities.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">WHAT IS MET?</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>1 MET = energy cost of sitting quietly (1 kcal/kg/hour)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Higher MET = more intense activity</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Calories = MET x weight (kg) x time (hours)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FORMULA</h3>
          <div class="relative p-4 border-2 border-orange-300 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
            <p class="font-mono text-base sm:text-lg text-orange-700">Calories = MET x Weight(kg) x Duration(h)</p>
            <p class="font-game text-sm text-gray-500 mt-2">Based on Ainsworth et al. (2011) Compendium</p>
          </div>
        </div>

        <div class="relative p-4 border-2 border-orange-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
          <p class="font-game text-sm sm:text-base text-orange-700"><strong>Note:</strong> These are estimates with 15-20% margin of error. For accurate tracking, use a heart rate monitor or fitness tracker.</p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
