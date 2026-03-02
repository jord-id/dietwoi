<script setup lang="ts">
import type { CholesterolResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Cholesterol Ratio Calculator',
    description: 'Assess your cardiovascular risk using cholesterol ratios',
    shortDescription: 'Enter your cholesterol values to calculate key ratios used to assess cardiovascular disease risk.',
    path: '/cholesterol',
    color: 'amber',
    contentPath: 'calculators/cholesterol',
  },
  seo: {
    title: 'Cholesterol Ratio Calculator - Total/HDL, LDL/HDL, Trig/HDL',
    description: 'Free cholesterol ratio calculator. Calculate Total/HDL, LDL/HDL, Triglyceride/HDL ratios and Non-HDL cholesterol to assess cardiovascular risk.',
    path: '/cholesterol',
  },
  schema: {
    name: 'Cholesterol Ratio Calculator',
    description: 'Assess cardiovascular risk using cholesterol ratios',
    url: '/cholesterol',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Cholesterol Calculator', url: '/cholesterol' },
  ],
  inputs: [
    { key: 'totalCholesterol', label: 'Total Cholesterol', type: 'slider', min: 50, max: 400, default: 200, unit: 'mg/dL' },
    { key: 'hdl', label: 'HDL (Good)', type: 'slider', min: 10, max: 120, default: 55, unit: 'mg/dL' },
    { key: 'ldl', label: 'LDL (Bad)', type: 'slider', min: 20, max: 300, default: 120, unit: 'mg/dL' },
    { key: 'triglycerides', label: 'Triglycerides', type: 'slider', min: 20, max: 800, default: 150, unit: 'mg/dL' },
  ],
}

const { calculate } = useCholesterol()

const { inputs, result, error } = useCalculatorSetup<CholesterolResult>(
  config,
  (i) => calculate({
    totalCholesterol: Number(i.totalCholesterol),
    hdl: Number(i.hdl),
    ldl: Number(i.ldl),
    triglycerides: Number(i.triglycerides),
  })
)

const riskColors: Record<string, { text: string; bg: string; border: string }> = {
  'Low Risk': { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300' },
  'Optimal': { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300' },
  'Ideal': { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300' },
  'Good': { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300' },
  'Near Optimal': { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300' },
  'Average': { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-300' },
  'Borderline': { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300' },
  'High Risk': { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300' },
  'High': { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300' },
}

const getRiskColor = (risk: string) => riskColors[risk] || riskColors['Average']
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
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
        <!-- Ratio Cards -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-amber-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">CHOLESTEROL RATIOS</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- Total/HDL Ratio -->
            <div class="relative p-4 border-2 bg-white" :class="getRiskColor(result.totalHdlRatio.risk).border">
              <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">TOTAL/HDL</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-amber-600">{{ result.totalHdlRatio.value }}</p>
              <p class="font-pixel text-[10px] mt-2 tracking-wide" :class="getRiskColor(result.totalHdlRatio.risk).text">
                {{ result.totalHdlRatio.risk.toUpperCase() }}
              </p>
            </div>

            <!-- LDL/HDL Ratio -->
            <div class="relative p-4 border-2 bg-white" :class="getRiskColor(result.ldlHdlRatio.risk).border">
              <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">LDL/HDL</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-amber-600">{{ result.ldlHdlRatio.value }}</p>
              <p class="font-pixel text-[10px] mt-2 tracking-wide" :class="getRiskColor(result.ldlHdlRatio.risk).text">
                {{ result.ldlHdlRatio.risk.toUpperCase() }}
              </p>
            </div>

            <!-- Trig/HDL Ratio -->
            <div class="relative p-4 border-2 bg-white" :class="getRiskColor(result.trigHdlRatio.risk).border">
              <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">TRIG/HDL</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-amber-600">{{ result.trigHdlRatio.value }}</p>
              <p class="font-pixel text-[10px] mt-2 tracking-wide" :class="getRiskColor(result.trigHdlRatio.risk).text">
                {{ result.trigHdlRatio.risk.toUpperCase() }}
              </p>
            </div>

            <!-- Non-HDL -->
            <div class="relative p-4 border-2 bg-white" :class="getRiskColor(result.nonHdl.risk).border">
              <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <p class="font-pixel text-[10px] text-gray-500 mb-1 tracking-wide">NON-HDL</p>
              <p class="font-game text-2xl sm:text-3xl font-bold text-amber-600">{{ result.nonHdl.value }}</p>
              <p class="font-game text-xs text-gray-400">mg/dL</p>
              <p class="font-pixel text-[10px] mt-2 tracking-wide" :class="getRiskColor(result.nonHdl.risk).text">
                {{ result.nonHdl.risk.toUpperCase() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT CHOLESTEROL RATIOS</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
          Cholesterol ratios are often more predictive of heart disease risk than individual cholesterol numbers alone. These ratios are based on NCEP ATP III guidelines.
        </p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">WHAT EACH RATIO MEANS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-3">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Total/HDL Ratio:</strong> Overall cardiovascular risk indicator. Below 4.5 is ideal.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>LDL/HDL Ratio:</strong> Balance between bad and good cholesterol. Below 2.0 is optimal.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Trig/HDL Ratio:</strong> Insulin resistance marker. Below 2.0 is ideal.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-amber-500 mt-2 flex-shrink-0" />
              <span><strong>Non-HDL:</strong> Total cholesterol minus HDL. Captures all atherogenic particles. Below 130 is optimal.</span>
            </li>
          </ul>
        </div>

        <div class="relative p-4 border-2 border-amber-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <p class="font-game text-sm sm:text-base text-amber-700">
            <strong>Source:</strong> National Cholesterol Education Program (NCEP) Adult Treatment Panel III guidelines.
          </p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
