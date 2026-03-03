<script setup lang="ts">
import type { CaffeineResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Caffeine Calculator',
    description: 'Track your daily caffeine intake from common sources',
    shortDescription: 'Calculate your total daily caffeine consumption from coffee, tea, energy drinks, and more. Check if you are within safe limits.',
    path: '/caffeine',
    color: 'orange',
    contentPath: 'calculators/caffeine',
  },
  seo: {
    title: 'Caffeine Calculator - Daily Intake Tracker',
    description: 'Track your daily caffeine intake from coffee, tea, energy drinks, and chocolate. Check against EFSA safe limits for adults and pregnant women.',
    path: '/caffeine',
  },
  schema: {
    name: 'Caffeine Calculator',
    description: 'Calculate daily caffeine intake from common sources',
    url: '/caffeine',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Caffeine Calculator', url: '/caffeine' },
  ],
  inputs: [],
}

// Manual state management (like macros.vue) since inputs are custom
const { calculate, sources } = useCaffeine()

const inputs = ref<Record<string, number | string>>({})

const servings = ref<Record<string, number>>(
  Object.fromEntries(sources.map(s => [s.id, 0]))
)

const isPregnant = ref(false)

const result = computed<CaffeineResult>(() => {
  return calculate({
    servings: servings.value,
    isPregnant: isPregnant.value,
  })
})

const increment = (id: string) => {
  if (servings.value[id] < 10) servings.value[id]++
}

const decrement = (id: string) => {
  if (servings.value[id] > 0) servings.value[id]--
}

// Percentage bar color
const barColor = computed(() => {
  if (result.value.percentOfLimit <= 50) return 'bg-green-500'
  if (result.value.percentOfLimit <= 80) return 'bg-amber-500'
  return 'bg-red-500'
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Caffeine Source Grid -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">CAFFEINE SOURCES</label>
        <div class="space-y-2">
          <div
            v-for="source in sources"
            :key="source.id"
            class="relative flex items-center justify-between p-3 border-2 bg-white"
            :class="servings[source.id] > 0 ? 'border-orange-400' : 'border-gray-200'"
          >
            <div v-if="servings[source.id] > 0" class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
            <div class="pl-2">
              <p class="font-game text-sm text-gray-700">{{ source.name }}</p>
              <p class="font-game text-xs text-gray-400">{{ source.caffeineMg }}mg per serving</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="w-8 h-8 border-2 border-gray-300 bg-white font-game text-lg text-gray-600 hover:border-orange-400 hover:text-orange-600 flex items-center justify-center"
                @click="decrement(source.id)"
              >
                -
              </button>
              <span class="w-8 text-center font-game text-sm font-bold" :class="servings[source.id] > 0 ? 'text-orange-700' : 'text-gray-400'">
                {{ servings[source.id] }}
              </span>
              <button
                type="button"
                class="w-8 h-8 border-2 border-gray-300 bg-white font-game text-lg text-gray-600 hover:border-orange-400 hover:text-orange-600 flex items-center justify-center"
                @click="increment(source.id)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pregnant Toggle -->
      <div>
        <label
          class="relative flex items-center gap-3 p-3 border-2 cursor-pointer transition-all"
          :class="isPregnant ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300 bg-white'"
        >
          <div v-if="isPregnant" class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
          <input
            v-model="isPregnant"
            type="checkbox"
            class="w-4 h-4 accent-orange-500"
          >
          <div>
            <span class="font-game text-sm" :class="isPregnant ? 'text-orange-700' : 'text-gray-700'">Pregnant / Breastfeeding</span>
            <p class="font-game text-xs text-gray-400">Reduces safe limit to 200mg</p>
          </div>
        </label>
      </div>
    </template>

    <template #results>
      <div class="space-y-6">
        <!-- Total Caffeine -->
        <div class="relative text-center p-6 border-2 bg-white" :class="result.isOverLimit ? 'border-red-300' : 'border-orange-200'">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="result.isOverLimit ? 'from-red-500 to-rose-500' : 'from-orange-500 to-amber-500'" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">TOTAL CAFFEINE</p>
          <div class="flex items-baseline justify-center gap-2">
            <span
              class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent"
              :class="result.isOverLimit ? 'from-red-500 to-rose-500' : 'from-orange-500 to-amber-500'"
            >
              {{ result.totalMg }}
            </span>
            <span class="font-game text-lg text-gray-500">mg</span>
          </div>
          <p class="font-game text-sm text-gray-500 mt-2">Daily limit: {{ result.limit }}mg</p>
        </div>

        <!-- Over Limit Warning -->
        <div v-if="result.isOverLimit" class="relative p-4 border-2 border-red-300 bg-red-50">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
          <div class="pl-2">
            <p class="font-pixel text-[10px] sm:text-xs text-red-700 tracking-wide mb-1">OVER LIMIT</p>
            <p class="font-game text-sm text-red-600">
              You are {{ result.totalMg - result.limit }}mg over the {{ isPregnant ? 'pregnancy' : 'adult' }} safe limit. Consider reducing your intake.
            </p>
          </div>
        </div>

        <!-- Percentage Bar -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-orange-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">DAILY LIMIT USAGE</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="h-6 border-2 border-gray-200 bg-gray-50 relative">
            <div
              class="h-full transition-all duration-300"
              :class="barColor"
              :style="{ width: `${Math.min(result.percentOfLimit, 100)}%` }"
            />
            <span class="absolute inset-0 flex items-center justify-center font-game text-xs font-bold" :class="result.percentOfLimit > 50 ? 'text-white' : 'text-gray-600'">
              {{ result.percentOfLimit }}%
            </span>
          </div>
          <div class="flex justify-between font-game text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <!-- Breakdown -->
        <div v-if="result.breakdown.length > 0">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-orange-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">BREAKDOWN</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="space-y-2">
            <div
              v-for="item in result.breakdown"
              :key="item.name"
              class="relative flex justify-between items-center p-3 border-2 border-orange-200 bg-white"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
              <div class="pl-2">
                <span class="font-game text-sm text-gray-600">{{ item.name }}</span>
                <span class="font-game text-xs text-gray-400 ml-2">x{{ item.servings }}</span>
              </div>
              <span class="font-game text-sm font-semibold text-orange-700">{{ item.mg }}mg</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center p-6 border-2 border-gray-200 bg-gray-50">
          <p class="font-game text-sm text-gray-400">Add servings above to see your caffeine breakdown</p>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT CAFFEINE</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Caffeine is the most widely consumed psychoactive substance. The EFSA (2015) considers up to 400mg/day safe for most adults.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">SAFE LIMITS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span><strong>Adults:</strong> up to 400mg/day</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span><strong>Pregnant:</strong> up to 200mg/day</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span><strong>Single dose:</strong> up to 200mg at once</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HALF-LIFE</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Caffeine half-life is 3-5 hours on average</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Full elimination takes 10-12 hours</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0" />
              <span>Avoid caffeine at least 6 hours before sleep</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
