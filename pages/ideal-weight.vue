<script setup lang="ts">
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Ideal Weight Calculator',
    description: 'Calculate your ideal body weight using multiple scientific formulas',
    shortDescription: 'Find your ideal body weight using four different medical formulas (Devine, Robinson, Miller, Hamwi) and compare with healthy BMI ranges.',
    path: '/ideal-weight',
    color: 'amber',
    contentPath: 'calculators/ideal-weight',
  },
  seo: {
    title: 'Ideal Weight Calculator - Find Your Healthy Body Weight',
    description: 'Free ideal weight calculator using Devine, Robinson, Miller, and Hamwi formulas. Calculate your ideal body weight and healthy BMI weight range based on your height and gender.',
    path: '/ideal-weight',
  },
  schema: {
    name: 'Ideal Weight Calculator',
    description: 'Calculate your ideal body weight using multiple scientific formulas',
    url: '/ideal-weight',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Ideal Weight Calculator', url: '/ideal-weight' },
  ],
  inputs: [
    { key: 'gender', label: 'Gender', type: 'gender', default: 'male' },
    { key: 'height', label: 'Height', type: 'slider', min: 100, max: 250, default: 170, unit: 'cm' },
  ],
}

// Calculator
const { calculate } = useIdealWeight()

const inputs = ref<Record<string, number | string>>({
  gender: 'male',
  height: 170,
  currentWeight: 0,
})

interface IdealWeightResult {
  devine: number
  robinson: number
  miller: number
  hamwi: number
  bmiRange: { min: number; max: number }
}

const result = ref<IdealWeightResult | null>(null)

const calculateIdealWeight = () => {
  result.value = calculate({
    height: inputs.value.height as number,
    gender: inputs.value.gender as 'male' | 'female',
  })
}

onMounted(calculateIdealWeight)
watch(inputs, calculateIdealWeight, { deep: true })

// Calculate average of all formulas
const average = computed(() => {
  if (!result.value) return 0
  const sum = result.value.devine + result.value.robinson + result.value.miller + result.value.hamwi
  return Math.round((sum / 4) * 10) / 10
})

// Formula descriptions
const formulas = [
  { key: 'devine', label: 'Devine Formula', color: 'amber' },
  { key: 'robinson', label: 'Robinson Formula', color: 'orange' },
  { key: 'miller', label: 'Miller Formula', color: 'yellow' },
  { key: 'hamwi', label: 'Hamwi Formula', color: 'amber' },
]

// Weight comparison if user provides current weight
const showComparison = computed(() => inputs.value.currentWeight && inputs.value.currentWeight > 0)
const weightDifference = computed(() => {
  if (!result.value || !inputs.value.currentWeight) return 0
  return Math.round(((inputs.value.currentWeight as number) - average.value) * 10) / 10
})
const weightStatus = computed(() => {
  if (weightDifference.value > 0) return { label: 'above', color: 'text-red-600' }
  if (weightDifference.value < 0) return { label: 'below', color: 'text-blue-600' }
  return { label: 'at', color: 'text-green-600' }
})
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Optional current weight input -->
      <div>
        <CalculatorInputSlider
          v-model="inputs.currentWeight as number"
          :min="0"
          :max="200"
          :step="0.1"
          label="Current Weight (Optional)"
          unit="kg"
          color="amber"
        />
        <p class="text-xs text-gray-500 mt-1">Enter your current weight to see comparison</p>
      </div>
    </template>

    <template #reference>
      <div class="mt-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-3 h-3 bg-amber-500" />
          <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">FORMULA REFERENCE</span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>
        <div class="space-y-2">
          <div class="relative p-3 border-2 border-amber-200 bg-white">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            <p class="pl-2 font-game text-sm sm:text-base text-gray-600"><strong class="text-amber-700">Devine (1974):</strong> Most widely used, developed for drug dosing</p>
          </div>
          <div class="relative p-3 border-2 border-amber-200 bg-white">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            <p class="pl-2 font-game text-sm sm:text-base text-gray-600"><strong class="text-amber-700">Robinson (1983):</strong> Refinement of Devine formula</p>
          </div>
          <div class="relative p-3 border-2 border-amber-200 bg-white">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            <p class="pl-2 font-game text-sm sm:text-base text-gray-600"><strong class="text-amber-700">Miller (1983):</strong> Based on mortality data</p>
          </div>
          <div class="relative p-3 border-2 border-amber-200 bg-white">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
            <p class="pl-2 font-game text-sm sm:text-base text-gray-600"><strong class="text-amber-700">Hamwi (1964):</strong> Quick estimation method</p>
          </div>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Average Ideal Weight -->
        <div class="relative text-center p-6 border-2 border-amber-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">AVERAGE IDEAL WEIGHT</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              {{ average }}
            </span>
            <span class="font-game text-xl text-gray-600">kg</span>
          </div>
          <p class="mt-2 font-game text-xs text-gray-500">Based on 4 medical formulas</p>
        </div>

        <!-- Individual Formulas -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-amber-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">INDIVIDUAL FORMULAS</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <CalculatorResultCard
              v-for="formula in formulas"
              :key="formula.key"
              :title="formula.label"
              :value="result[formula.key as keyof typeof result] as number"
              unit="kg"
              color="amber"
              size="sm"
            />
          </div>
        </div>

        <!-- Healthy BMI Range -->
        <div class="relative p-4 border-2 border-amber-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-amber-700 mb-1 tracking-wide">HEALTHY BMI WEIGHT RANGE</p>
          <p class="font-game text-sm text-gray-600">
            For your height ({{ inputs.height }}cm), a healthy weight (BMI 18.5-24.9) is:
          </p>
          <p class="font-game text-lg sm:text-xl font-semibold text-amber-700 mt-1">
            {{ result.bmiRange.min }} - {{ result.bmiRange.max }} kg
          </p>
        </div>

        <!-- Current Weight Comparison -->
        <div v-if="showComparison" class="relative p-4 border-2 border-amber-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <p class="font-game text-sm font-medium mb-1" :class="weightStatus.color">
            You are {{ Math.abs(weightDifference) }}kg {{ weightStatus.label }} average ideal weight
          </p>
          <div class="flex items-center gap-2 mt-2">
            <div class="flex-1 h-3 bg-gray-200 border border-gray-300">
              <div
                class="h-full bg-amber-500"
                :style="{ width: `${Math.min((average / (inputs.currentWeight as number)) * 100, 100)}%` }"
              />
            </div>
          </div>
          <div class="flex justify-between font-game text-xs text-gray-500 mt-1">
            <span>Current: {{ inputs.currentWeight }}kg</span>
            <span>Ideal: {{ average }}kg</span>
          </div>
        </div>

        <!-- Formula Range -->
        <div class="text-center font-game text-sm text-gray-500">
          <p>Formula range: {{ Math.min(result.devine, result.robinson, result.miller, result.hamwi) }}kg - {{ Math.max(result.devine, result.robinson, result.miller, result.hamwi) }}kg</p>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT IDEAL WEIGHT</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">This calculator uses four established medical formulas to estimate ideal body weight.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">IMPORTANT LIMITATIONS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Frame size:</strong> Doesn't account for bone structure</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Muscle mass:</strong> Athletes may have higher healthy weights</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Age:</strong> Ideal weight varies with age</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Individual:</strong> These are general guidelines</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
