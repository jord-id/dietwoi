<script setup lang="ts">
import type { PregnancyWeightResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Pregnancy Weight Gain Calculator',
    description: 'Calculate recommended weight gain during pregnancy based on IOM guidelines',
    shortDescription: 'Enter your pre-pregnancy weight, height, and current week to see recommended weight gain based on IOM 2009 guidelines.',
    path: '/pregnancy-weight',
    color: 'pink',
    contentPath: 'calculators/pregnancy-weight',
  },
  seo: {
    title: 'Pregnancy Weight Gain Calculator - IOM 2009 Guidelines',
    description: 'Free pregnancy weight gain calculator based on IOM 2009 guidelines. Get recommended total and weekly weight gain for singleton and twin pregnancies.',
    path: '/pregnancy-weight',
  },
  schema: {
    name: 'Pregnancy Weight Gain Calculator',
    description: 'Calculate recommended weight gain during pregnancy based on IOM guidelines',
    url: '/pregnancy-weight',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Pregnancy Weight Calculator', url: '/pregnancy-weight' },
  ],
  inputs: [
    { key: 'prePregnancyWeight', label: 'Pre-Pregnancy Weight', type: 'slider', min: 30, max: 150, default: 60, unit: 'kg' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 200, default: 165, unit: 'cm' },
    { key: 'currentWeek', label: 'Current Week', type: 'slider', min: 1, max: 42, default: 20, unit: 'weeks' },
  ],
}

const { calculate } = usePregnancyWeight()

// Use useCalculatorSetup for the sliders, manage twins toggle separately
const { inputs, result, error } = useCalculatorSetup<PregnancyWeightResult>(
  config,
  (i) => calculate({
    prePregnancyWeight: Number(i.prePregnancyWeight),
    height: Number(i.height),
    currentWeek: Number(i.currentWeek),
    twins: twins.value,
  })
)

const twins = ref(false)

// Recalculate when twins changes
watch(twins, () => {
  try {
    result.value = calculate({
      prePregnancyWeight: Number(inputs.value.prePregnancyWeight),
      height: Number(inputs.value.height),
      currentWeek: Number(inputs.value.currentWeek),
      twins: twins.value,
    })
  } catch {
    // handled by useCalculatorSetup
  }
})

const bmiCategoryColors: Record<string, { text: string; border: string }> = {
  'Underweight': { text: 'text-blue-700', border: 'border-blue-300' },
  'Normal': { text: 'text-green-700', border: 'border-green-300' },
  'Overweight': { text: 'text-yellow-700', border: 'border-yellow-300' },
  'Obese': { text: 'text-red-700', border: 'border-red-300' },
}

const currentBmiColor = computed(() => {
  if (!result.value) return bmiCategoryColors['Normal']
  return bmiCategoryColors[result.value.bmiCategory] || bmiCategoryColors['Normal']
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Twins Toggle -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">PREGNANCY TYPE</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="!twins ? 'border-pink-500' : 'border-gray-200 hover:border-gray-300'"
            @click="twins = false"
          >
            <div v-if="!twins" class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="!twins ? 'text-pink-700' : 'text-gray-600'">SINGLETON</span>
          </button>
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="twins ? 'border-pink-500' : 'border-gray-200 hover:border-gray-300'"
            @click="twins = true"
          >
            <div v-if="twins" class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="twins ? 'text-pink-700' : 'text-gray-600'">TWINS</span>
          </button>
        </div>
      </div>
    </template>

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
        <!-- Pre-Pregnancy BMI -->
        <div class="relative text-center p-6 border-2 bg-white" :class="currentBmiColor.border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">PRE-PREGNANCY BMI</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              {{ result.preBmi }}
            </span>
            <span class="font-game text-lg text-gray-500">kg/m²</span>
          </div>
          <p class="mt-2 font-pixel text-xs tracking-wide" :class="currentBmiColor.text">
            {{ result.bmiCategory.toUpperCase() }}
          </p>
        </div>

        <!-- Recommended Total Gain -->
        <div class="relative p-4 border-2 border-pink-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 tracking-wide mb-2">RECOMMENDED TOTAL GAIN</p>
          <p class="font-game text-2xl sm:text-3xl font-bold text-pink-600">
            {{ result.recommendedTotal.min }} - {{ result.recommendedTotal.max }} kg
          </p>
          <p class="font-game text-xs text-gray-400 mt-1">For full pregnancy{{ twins ? ' (twins)' : '' }}</p>
        </div>

        <!-- Expected at Current Week -->
        <div class="relative p-4 border-2 border-pink-200 bg-white">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-pink-500" />
          <div class="pl-2">
            <p class="font-pixel text-[10px] sm:text-xs text-gray-500 tracking-wide mb-2">EXPECTED GAIN AT WEEK {{ Number(inputs.currentWeek) }}</p>
            <p class="font-game text-2xl sm:text-3xl font-bold text-pink-600">
              {{ result.expectedCurrent.min }} - {{ result.expectedCurrent.max }} kg
            </p>
          </div>
        </div>

        <!-- Weekly Rate -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard
            title="Weekly Rate (min)"
            :value="result.weeklyRate.min"
            unit="kg/week"
            color="pink"
            size="sm"
          />
          <CalculatorResultCard
            title="Weekly Rate (max)"
            :value="result.weeklyRate.max"
            unit="kg/week"
            color="pink"
            size="sm"
          />
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT PREGNANCY WEIGHT GAIN</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
          Weight gain during pregnancy is normal and necessary for a healthy baby. The recommended amount depends on your pre-pregnancy BMI.
        </p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">IOM 2009 GUIDELINES (SINGLETON)</h3>
          <div class="relative p-4 border-2 border-pink-300 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
            <ul class="font-game text-sm sm:text-base text-gray-600 space-y-2">
              <li><strong class="text-blue-700">Underweight (BMI &lt; 18.5):</strong> 12.5-18 kg</li>
              <li><strong class="text-green-700">Normal (BMI 18.5-24.9):</strong> 11.5-16 kg</li>
              <li><strong class="text-yellow-700">Overweight (BMI 25-29.9):</strong> 7-11.5 kg</li>
              <li><strong class="text-red-700">Obese (BMI 30+):</strong> 5-9 kg</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">TRIMESTER BREAKDOWN</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-pink-500 mt-2 flex-shrink-0" />
              <span><strong>1st Trimester (Weeks 1-13):</strong> 0.5-2 kg total</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-pink-500 mt-2 flex-shrink-0" />
              <span><strong>2nd & 3rd Trimester:</strong> Steady weekly gain based on BMI category</span>
            </li>
          </ul>
        </div>

        <div class="relative p-4 border-2 border-pink-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
          <p class="font-game text-sm sm:text-base text-pink-700">
            <strong>Source:</strong> Institute of Medicine (IOM). Weight Gain During Pregnancy: Reexamining the Guidelines. Washington, DC: National Academies Press; 2009.
          </p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
