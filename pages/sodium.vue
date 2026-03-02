<script setup lang="ts">
import type { SodiumResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Sodium Calculator',
    description: 'Assess your daily sodium intake against health guidelines',
    shortDescription: 'Check your daily sodium intake against WHO and AHA guidelines. See the salt equivalent and understand your risk level.',
    path: '/sodium',
    color: 'cyan',
    contentPath: 'calculators/sodium',
  },
  seo: {
    title: 'Sodium Calculator - Daily Intake Assessment',
    description: 'Assess your daily sodium intake against WHO and AHA guidelines. Convert sodium to salt equivalent and understand your cardiovascular risk.',
    path: '/sodium',
  },
  schema: {
    name: 'Sodium Calculator',
    description: 'Assess daily sodium intake against international health guidelines',
    url: '/sodium',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Sodium Calculator', url: '/sodium' },
  ],
  inputs: [
    { key: 'sodiumMg', label: 'Sodium Intake', type: 'slider', min: 0, max: 5000, step: 50, default: 2300, unit: 'mg' },
  ],
}

const { calculate } = useSodium()

const { inputs, result, error } = useCalculatorSetup<SodiumResult>(
  config,
  (i) => calculate({ sodiumMg: Number(i.sodiumMg) })
)

// WHO bar color
const whoBarColor = computed(() => {
  if (!result.value) return 'bg-green-500'
  if (result.value.percentOfWho <= 100) return 'bg-green-500'
  if (result.value.percentOfWho <= 115) return 'bg-amber-500'
  return 'bg-red-500'
})

// AHA bar color
const ahaBarColor = computed(() => {
  if (!result.value) return 'bg-green-500'
  if (result.value.percentOfAha <= 100) return 'bg-green-500'
  if (result.value.percentOfAha <= 153) return 'bg-amber-500'
  return 'bg-red-500'
})

// Category color
const whoCategoryColor = computed(() => {
  if (!result.value) return 'text-green-700'
  if (result.value.sodiumMg <= 2000) return 'text-green-700'
  if (result.value.sodiumMg <= 2300) return 'text-amber-700'
  return 'text-red-700'
})

const ahaCategoryColor = computed(() => {
  if (!result.value) return 'text-green-700'
  if (result.value.sodiumMg <= 1500) return 'text-green-700'
  if (result.value.sodiumMg <= 2300) return 'text-amber-700'
  return 'text-red-700'
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
        <!-- Sodium & Salt Display -->
        <div class="grid grid-cols-2 gap-3">
          <div class="relative text-center p-4 border-2 border-cyan-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-sky-500" />
            <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">SODIUM</p>
            <div class="flex items-baseline justify-center gap-1">
              <span class="font-game text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">
                {{ result.sodiumMg.toLocaleString() }}
              </span>
              <span class="font-game text-sm text-gray-500">mg</span>
            </div>
          </div>
          <div class="relative text-center p-4 border-2 border-cyan-200 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-sky-500" />
            <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">SALT EQUIVALENT</p>
            <div class="flex items-baseline justify-center gap-1">
              <span class="font-game text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">
                {{ result.saltG }}
              </span>
              <span class="font-game text-sm text-gray-500">g</span>
            </div>
          </div>
        </div>

        <!-- WHO Guideline -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-cyan-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">WHO GUIDELINE (2,000mg)</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="relative p-4 border-2 border-cyan-200 bg-white">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
            <p class="font-game text-sm font-semibold mb-3 pl-2" :class="whoCategoryColor">{{ result.whoCategory }}</p>
            <div class="h-5 border border-gray-200 bg-gray-50 relative ml-2">
              <div
                class="h-full transition-all duration-300"
                :class="whoBarColor"
                :style="{ width: `${Math.min(result.percentOfWho, 100)}%` }"
              />
              <span class="absolute inset-0 flex items-center justify-center font-game text-xs font-bold" :class="result.percentOfWho > 50 ? 'text-white' : 'text-gray-600'">
                {{ result.percentOfWho }}%
              </span>
            </div>
          </div>
        </div>

        <!-- AHA Guideline -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-cyan-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">AHA IDEAL (1,500mg)</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="relative p-4 border-2 border-cyan-200 bg-white">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
            <p class="font-game text-sm font-semibold mb-3 pl-2" :class="ahaCategoryColor">{{ result.ahaCategory }}</p>
            <div class="h-5 border border-gray-200 bg-gray-50 relative ml-2">
              <div
                class="h-full transition-all duration-300"
                :class="ahaBarColor"
                :style="{ width: `${Math.min(result.percentOfAha, 100)}%` }"
              />
              <span class="absolute inset-0 flex items-center justify-center font-game text-xs font-bold" :class="result.percentOfAha > 50 ? 'text-white' : 'text-gray-600'">
                {{ result.percentOfAha }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT SODIUM INTAKE</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Excess sodium raises blood pressure and increases cardiovascular risk. Most people consume far more sodium than recommended.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">GUIDELINES</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>WHO (2012):</strong> &lt; 2,000mg sodium/day</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>AHA Ideal:</strong> &lt; 1,500mg sodium/day</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span><strong>US Dietary Guidelines:</strong> &lt; 2,300mg sodium/day</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">SODIUM TO SALT CONVERSION</h3>
          <div class="relative p-4 border-2 border-cyan-300 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
            <p class="font-mono text-base sm:text-lg text-cyan-700">Salt (g) = Sodium (mg) x 0.0025</p>
            <p class="font-game text-sm text-gray-500 mt-2">1g sodium = 2.5g salt (sodium chloride)</p>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HIGH-SODIUM FOODS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span>Processed meats, canned soups, soy sauce</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-cyan-500 mt-2 flex-shrink-0" />
              <span>Bread, cheese, condiments, fast food</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
