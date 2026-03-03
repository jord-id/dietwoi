<script setup lang="ts">
import type { BpResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Blood Pressure Calculator',
    description: 'Check your blood pressure category based on ACC/AHA guidelines',
    shortDescription: 'Enter your systolic and diastolic readings to see your blood pressure category and get personalized recommendations.',
    path: '/blood-pressure',
    color: 'red',
    contentPath: 'calculators/blood-pressure',
  },
  seo: {
    title: 'Blood Pressure Calculator - Check Your BP Category',
    description: 'Free blood pressure calculator based on ACC/AHA 2017 guidelines. Check if your blood pressure is normal, elevated, or hypertensive.',
    path: '/blood-pressure',
  },
  schema: {
    name: 'Blood Pressure Calculator',
    description: 'Check your blood pressure category based on ACC/AHA 2017 guidelines',
    url: '/blood-pressure',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Blood Pressure Calculator', url: '/blood-pressure' },
  ],
  inputs: [
    { key: 'systolic', label: 'Systolic (top)', type: 'slider', min: 70, max: 200, default: 120, unit: 'mmHg' },
    { key: 'diastolic', label: 'Diastolic (bottom)', type: 'slider', min: 40, max: 130, default: 80, unit: 'mmHg' },
  ],
}

const { calculate } = useBloodPressure()

const { inputs, result, error } = useCalculatorSetup<BpResult>(
  config,
  (i) => calculate({ systolic: Number(i.systolic), diastolic: Number(i.diastolic) })
)

const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  normal: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', gradient: 'from-green-500 to-emerald-500' },
  elevated: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300', gradient: 'from-yellow-500 to-amber-500' },
  stage1: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', gradient: 'from-orange-500 to-amber-500' },
  stage2: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', gradient: 'from-red-500 to-rose-500' },
  crisis: { bg: 'bg-red-100', text: 'text-red-900', border: 'border-red-500', gradient: 'from-red-700 to-rose-700' },
}

const currentColor = computed(() => {
  if (!result.value) return categoryColors.normal
  return categoryColors[result.value.category]
})

const bpRanges = [
  { label: 'Normal', systolic: '< 120', diastolic: '< 80', color: 'green' },
  { label: 'Elevated', systolic: '120-129', diastolic: '< 80', color: 'yellow' },
  { label: 'Stage 1', systolic: '130-139', diastolic: '80-89', color: 'orange' },
  { label: 'Stage 2', systolic: '140+', diastolic: '90+', color: 'red' },
  { label: 'Crisis', systolic: '> 180', diastolic: '> 120', color: 'red' },
]

const rangeColors: Record<string, { border: string; bar: string; text: string }> = {
  green: { border: 'border-green-200', bar: 'bg-green-500', text: 'text-green-700' },
  yellow: { border: 'border-yellow-200', bar: 'bg-yellow-500', text: 'text-yellow-700' },
  orange: { border: 'border-orange-200', bar: 'bg-orange-500', text: 'text-orange-700' },
  red: { border: 'border-red-200', bar: 'bg-red-500', text: 'text-red-700' },
}
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #reference>
      <div class="mt-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-3 h-3 bg-red-500" />
          <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">BP CATEGORIES</span>
          <div class="flex-1 h-px bg-gray-200" />
        </div>
        <div class="space-y-2">
          <div
            v-for="range in bpRanges"
            :key="range.label"
            class="relative p-3 border-2 bg-white flex items-center justify-between"
            :class="rangeColors[range.color]?.border"
          >
            <div class="absolute top-0 left-0 bottom-0 w-1" :class="rangeColors[range.color]?.bar" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide pl-2" :class="rangeColors[range.color]?.text">
              {{ range.label.toUpperCase() }}
            </span>
            <span class="font-game text-xs sm:text-sm text-gray-600">
              {{ range.systolic }} / {{ range.diastolic }}
            </span>
          </div>
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
        <!-- Reading Display -->
        <div class="relative text-center p-6 border-2 bg-white" :class="currentColor.border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="currentColor.gradient" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">YOUR READING</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent" :class="currentColor.gradient">
              {{ result.systolic }}
            </span>
            <span class="font-game text-2xl text-gray-400">/</span>
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent" :class="currentColor.gradient">
              {{ result.diastolic }}
            </span>
            <span class="font-game text-lg text-gray-500">mmHg</span>
          </div>
        </div>

        <!-- Category -->
        <div class="relative p-4 border-2 bg-white" :class="currentColor.border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="currentColor.gradient" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 tracking-wide mb-1">CATEGORY</p>
          <p class="font-pixel text-base sm:text-lg tracking-wide" :class="currentColor.text">
            {{ result.categoryLabel.toUpperCase() }}
          </p>
        </div>

        <!-- Recommendation -->
        <div class="relative p-4 border-2 border-red-200 bg-white">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 tracking-wide mb-2 pl-2">RECOMMENDATION</p>
          <p class="font-game text-sm sm:text-base text-gray-700 pl-2">{{ result.recommendation }}</p>
        </div>

        <!-- Individual values -->
        <div class="grid grid-cols-2 gap-4">
          <CalculatorResultCard title="Systolic" :value="result.systolic" unit="mmHg" color="red" size="sm" />
          <CalculatorResultCard title="Diastolic" :value="result.diastolic" unit="mmHg" color="red" size="sm" />
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT BLOOD PRESSURE</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
          Blood pressure is the force of blood pushing against artery walls. It is measured in millimeters of mercury (mmHg) with two numbers: systolic (heart beating) over diastolic (heart resting).
        </p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">ACC/AHA 2017 CLASSIFICATION</h3>
          <div class="relative p-4 border-2 border-red-300 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
            <ul class="font-game text-sm sm:text-base text-gray-600 space-y-2">
              <li><strong class="text-green-700">Normal:</strong> Systolic &lt; 120 AND Diastolic &lt; 80</li>
              <li><strong class="text-yellow-700">Elevated:</strong> Systolic 120-129 AND Diastolic &lt; 80</li>
              <li><strong class="text-orange-700">Stage 1:</strong> Systolic 130-139 OR Diastolic 80-89</li>
              <li><strong class="text-red-700">Stage 2:</strong> Systolic 140+ OR Diastolic 90+</li>
              <li><strong class="text-red-900">Crisis:</strong> Systolic &gt; 180 OR Diastolic &gt; 120</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HOW TO MEASURE</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Rest for 5 minutes before measuring</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Sit with feet flat, arm supported at heart level</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Take 2-3 readings, 1 minute apart, and average them</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Avoid caffeine, exercise, and smoking 30 min before</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
