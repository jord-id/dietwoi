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
      <div class="mt-8">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Formula Reference</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p><strong>Devine (1974):</strong> Most widely used, developed for drug dosing</p>
          <p><strong>Robinson (1983):</strong> Refinement of Devine formula</p>
          <p><strong>Miller (1983):</strong> Based on mortality data</p>
          <p><strong>Hamwi (1964):</strong> Quick estimation method</p>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Average Ideal Weight -->
        <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100">
          <p class="text-sm text-gray-500 mb-2">Average Ideal Weight</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="text-5xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
              {{ average }}
            </span>
            <span class="text-2xl text-gray-600">kg</span>
          </div>
          <p class="mt-2 text-xs text-gray-500">Based on 4 medical formulas</p>
        </div>

        <!-- Individual Formulas -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Individual Formulas</h3>
          <div class="grid grid-cols-2 gap-3">
            <CalculatorResultCard
              v-for="formula in formulas"
              :key="formula.key"
              :title="formula.label"
              :value="result[formula.key as keyof typeof result] as number"
              unit="kg"
              :color="formula.color"
              size="sm"
            />
          </div>
        </div>

        <!-- Healthy BMI Range -->
        <div class="p-4 bg-green-50 rounded-xl border border-green-100">
          <p class="text-sm font-medium text-green-700 mb-1">Healthy BMI Weight Range</p>
          <p class="text-sm text-gray-600">
            For your height ({{ inputs.height }}cm), a healthy weight (BMI 18.5-24.9) is:
          </p>
          <p class="text-lg font-semibold text-green-700 mt-1">
            {{ result.bmiRange.min }} - {{ result.bmiRange.max }} kg
          </p>
        </div>

        <!-- Current Weight Comparison -->
        <div v-if="showComparison" class="p-4 rounded-xl border" :class="weightDifference === 0 ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'">
          <p class="text-sm font-medium mb-1" :class="weightStatus.color">
            You are {{ Math.abs(weightDifference) }}kg {{ weightStatus.label }} average ideal weight
          </p>
          <div class="flex items-center gap-2 mt-2">
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-500"
                :style="{ width: `${Math.min((average / (inputs.currentWeight as number)) * 100, 100)}%` }"
              />
            </div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Current: {{ inputs.currentWeight }}kg</span>
            <span>Ideal: {{ average }}kg</span>
          </div>
        </div>

        <!-- Formula Range -->
        <div class="text-center text-sm text-gray-500">
          <p>Formula range: {{ Math.min(result.devine, result.robinson, result.miller, result.hamwi) }}kg - {{ Math.max(result.devine, result.robinson, result.miller, result.hamwi) }}kg</p>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About Ideal Weight</h2>
      <div class="prose prose-gray max-w-none">
        <p>This calculator uses four established medical formulas to estimate ideal body weight. Each formula was developed for different purposes and may give slightly different results.</p>

        <h3 class="text-lg font-medium mt-4 mb-2">Formulas Used</h3>
        <div class="space-y-2 text-sm">
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="font-medium">Men:</p>
            <ul class="list-disc list-inside ml-2 space-y-1 text-gray-600">
              <li><strong>Devine:</strong> 50 + 2.3 × (height in inches - 60)</li>
              <li><strong>Robinson:</strong> 52 + 1.9 × (height in inches - 60)</li>
              <li><strong>Miller:</strong> 56.2 + 1.41 × (height in inches - 60)</li>
              <li><strong>Hamwi:</strong> 48 + 2.7 × (height in inches - 60)</li>
            </ul>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="font-medium">Women:</p>
            <ul class="list-disc list-inside ml-2 space-y-1 text-gray-600">
              <li><strong>Devine:</strong> 45.5 + 2.3 × (height in inches - 60)</li>
              <li><strong>Robinson:</strong> 49 + 1.7 × (height in inches - 60)</li>
              <li><strong>Miller:</strong> 53.1 + 1.36 × (height in inches - 60)</li>
              <li><strong>Hamwi:</strong> 45.5 + 2.2 × (height in inches - 60)</li>
            </ul>
          </div>
        </div>

        <h3 class="text-lg font-medium mt-4 mb-2">Important Limitations</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li><strong>Frame size:</strong> These formulas don't account for bone structure or body frame</li>
          <li><strong>Muscle mass:</strong> Athletes and muscular individuals may have healthy weights above these ranges</li>
          <li><strong>Age:</strong> Ideal weight may vary with age, especially for elderly individuals</li>
          <li><strong>Ethnicity:</strong> Different populations may have different healthy weight ranges</li>
          <li><strong>Individual variation:</strong> These are general guidelines, not absolute targets</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">How to Use This Information</h3>
        <p class="text-sm text-gray-600">
          Use these results as a general guideline rather than an absolute target. The healthy BMI weight range (18.5-24.9) is often more reliable for general health assessment. Consult with healthcare professionals for personalized weight recommendations based on your overall health, body composition, and medical history.
        </p>
      </div>
    </template>
  </CalculatorPage>
</template>
