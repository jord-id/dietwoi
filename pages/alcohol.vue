<script setup lang="ts">
import type { AlcoholResult, AlcoholUnitSystem } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Alcohol Unit Calculator',
    description: 'Calculate alcohol units, pure alcohol, and calories in your drink',
    shortDescription: 'Convert drink volume and ABV to alcohol units (UK, US, or AU), see pure alcohol content and calorie count.',
    path: '/alcohol',
    color: 'purple',
    contentPath: 'calculators/alcohol',
  },
  seo: {
    title: 'Alcohol Unit Calculator - Units, Calories & Weekly Limits',
    description: 'Calculate alcohol units (UK, US, AU), pure alcohol grams, and calories for any drink. Track against weekly guidelines for responsible drinking.',
    path: '/alcohol',
  },
  schema: {
    name: 'Alcohol Unit Calculator',
    description: 'Calculate alcohol units, pure alcohol, and calories in drinks',
    url: '/alcohol',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Alcohol Calculator', url: '/alcohol' },
  ],
  inputs: [
    { key: 'volumeMl', label: 'Volume', type: 'slider', min: 10, max: 2000, step: 10, default: 330, unit: 'ml' },
    { key: 'abvPercent', label: 'ABV', type: 'slider', min: 0.5, max: 80, step: 0.5, default: 5, unit: '%' },
  ],
}

const { calculate, systems } = useAlcohol()

const inputs = ref<Record<string, number | string>>({
  volumeMl: 330,
  abvPercent: 5,
})

const unitSystem = ref<AlcoholUnitSystem>('uk')

const volumeMl = computed(() => Number(inputs.value.volumeMl))
const abvPercent = computed(() => Number(inputs.value.abvPercent))

const result = ref<AlcoholResult | null>(null)

const calculateAlcohol = () => {
  result.value = calculate({
    volumeMl: volumeMl.value,
    abvPercent: abvPercent.value,
    unitSystem: unitSystem.value,
  })
}

onMounted(calculateAlcohol)
watch(inputs, calculateAlcohol, { deep: true })
watch(unitSystem, calculateAlcohol)

const SYSTEM_OPTIONS: { value: AlcoholUnitSystem; label: string }[] = [
  { value: 'uk', label: 'UK' },
  { value: 'us', label: 'US' },
  { value: 'au', label: 'AU' },
]

// Weekly percentage bar color
const weeklyBarColor = computed(() => {
  if (!result.value) return 'bg-green-500'
  if (result.value.percentOfWeekly <= 50) return 'bg-green-500'
  if (result.value.percentOfWeekly <= 80) return 'bg-amber-500'
  return 'bg-red-500'
})

// Common drink examples for reference
const COMMON_DRINKS = [
  { name: 'Beer (pint)', volume: 568, abv: 5 },
  { name: 'Wine (glass)', volume: 175, abv: 13 },
  { name: 'Spirit (single)', volume: 25, abv: 40 },
  { name: 'Cocktail', volume: 250, abv: 15 },
]
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Unit System Selector -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">UNIT SYSTEM</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="option in SYSTEM_OPTIONS"
            :key="option.value"
            type="button"
            class="relative p-3 border-2 bg-white text-center transition-all"
            :class="unitSystem === option.value
              ? 'border-purple-500'
              : 'border-gray-200 hover:border-gray-300'"
            @click="unitSystem = option.value"
          >
            <div v-if="unitSystem === option.value" class="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="unitSystem === option.value ? 'text-purple-700' : 'text-gray-600'">{{ option.label }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Presets -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">QUICK PRESETS</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="drink in COMMON_DRINKS"
            :key="drink.name"
            type="button"
            class="p-2 border-2 border-gray-200 bg-white hover:border-purple-300 text-left transition-all"
            @click="inputs.volumeMl = drink.volume; inputs.abvPercent = drink.abv"
          >
            <span class="font-game text-xs text-gray-700 block">{{ drink.name }}</span>
            <span class="font-game text-[10px] text-gray-400">{{ drink.volume }}ml / {{ drink.abv }}%</span>
          </button>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Units Display -->
        <div class="relative text-center p-6 border-2 border-purple-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">{{ result.unitLabel.toUpperCase() }}</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
              {{ result.units }}
            </span>
            <span class="font-game text-lg text-gray-500">{{ unitSystem === 'uk' ? 'units' : 'drinks' }}</span>
          </div>
        </div>

        <!-- Pure Alcohol & Calories -->
        <div class="grid grid-cols-2 gap-3">
          <div class="relative p-4 border-2 border-purple-200 bg-white text-center">
            <div class="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
            <p class="font-pixel text-[10px] text-purple-700 mb-1 tracking-wide">PURE ALCOHOL</p>
            <p class="font-game text-2xl sm:text-3xl font-bold text-purple-600">{{ result.pureAlcoholG }}g</p>
          </div>
          <div class="relative p-4 border-2 border-purple-200 bg-white text-center">
            <div class="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
            <p class="font-pixel text-[10px] text-purple-700 mb-1 tracking-wide">CALORIES</p>
            <p class="font-game text-2xl sm:text-3xl font-bold text-purple-600">{{ result.calories }}</p>
            <p class="font-game text-xs text-gray-400">kcal (alcohol only)</p>
          </div>
        </div>

        <!-- Weekly Limit -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-purple-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">WEEKLY LIMIT ({{ result.weeklyLimit }} {{ unitSystem === 'uk' ? 'UNITS' : 'DRINKS' }})</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="relative p-4 border-2 border-purple-200 bg-white">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
            <p class="font-game text-sm text-gray-600 mb-3 pl-2">This drink uses {{ result.percentOfWeekly }}% of your weekly allowance</p>
            <div class="h-5 border border-gray-200 bg-gray-50 relative ml-2">
              <div
                class="h-full transition-all duration-300"
                :class="weeklyBarColor"
                :style="{ width: `${Math.min(result.percentOfWeekly, 100)}%` }"
              />
              <span class="absolute inset-0 flex items-center justify-center font-game text-xs font-bold" :class="result.percentOfWeekly > 50 ? 'text-white' : 'text-gray-600'">
                {{ result.percentOfWeekly }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT ALCOHOL UNITS</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Different countries define a "standard drink" differently. This calculator converts your drink into the unit system of your choice.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">UNIT DEFINITIONS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>UK Unit:</strong> 8g pure alcohol</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>US Standard Drink:</strong> 14g pure alcohol</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>AU Standard Drink:</strong> 10g pure alcohol</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">WEEKLY GUIDELINES</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>UK:</strong> 14 units/week (men & women)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>US:</strong> 14 drinks/week (men), 7 drinks/week (women)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-purple-500 mt-2 flex-shrink-0" />
              <span><strong>AU:</strong> 10 standard drinks/week</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">FORMULA</h3>
          <div class="relative p-4 border-2 border-purple-300 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
            <p class="font-mono text-sm sm:text-base text-purple-700">Pure alcohol (g) = Volume (ml) x ABV (%) x 0.789</p>
            <p class="font-game text-sm text-gray-500 mt-2">0.789 g/ml is the density of ethanol</p>
          </div>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
