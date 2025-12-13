<script setup lang="ts">
import type { WaterIntakeResult, ActivityLevel, ClimateLevel } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Water Intake Calculator',
    description: 'Calculate your daily water intake based on weight, activity, and lifestyle factors',
    shortDescription: 'Calculate your daily water intake needs based on your body weight, activity level, climate, and special conditions to stay properly hydrated.',
    path: '/water-intake',
    color: 'cyan',
    contentPath: 'calculators/water-intake',
  },
  seo: {
    title: 'Water Intake Calculator - Daily Hydration Needs',
    description: 'Calculate your daily water intake requirements based on weight, activity level, climate, and lifestyle factors. Get personalized hydration recommendations for optimal health.',
    path: '/water-intake',
  },
  schema: {
    name: 'Water Intake Calculator',
    description: 'Calculate your daily water intake based on weight, activity, and lifestyle factors',
    url: '/water-intake',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Water Intake Calculator', url: '/water-intake' },
  ],
  inputs: [
    { key: 'weight', label: 'Weight', type: 'slider', min: 30, max: 200, default: 70, unit: 'kg' },
    { key: 'activityLevel', label: 'Activity Level', type: 'activity', default: 'moderate' },
  ],
}

// Calculator
const { calculate } = useWaterIntake()

const inputs = ref<Record<string, number | string | boolean>>({
  weight: 70,
  activityLevel: 'moderate',
  climate: 'normal',
  highProtein: false,
  pregnant: false,
  breastfeeding: false,
})

const result = ref<WaterIntakeResult | null>(null)

const calculateWater = () => {
  result.value = calculate({
    weight: inputs.value.weight as number,
    activityLevel: inputs.value.activityLevel as ActivityLevel,
    climate: inputs.value.climate as ClimateLevel,
    highProtein: inputs.value.highProtein as boolean,
    pregnant: inputs.value.pregnant as boolean,
    breastfeeding: inputs.value.breastfeeding as boolean,
  })
}

onMounted(calculateWater)
watch(inputs, calculateWater, { deep: true })
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Climate Selector -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Climate</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            :class="[
              'px-4 py-3 rounded-xl border-2 transition-all',
              inputs.climate === 'normal'
                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
            ]"
            @click="inputs.climate = 'normal'"
          >
            <div class="text-sm font-medium">Normal</div>
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-3 rounded-xl border-2 transition-all',
              inputs.climate === 'hot'
                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300',
            ]"
            @click="inputs.climate = 'hot'"
          >
            <div class="text-sm font-medium">Hot</div>
          </button>
        </div>
      </div>

      <!-- Special Conditions -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Special Conditions</label>
        <div class="space-y-2">
          <label class="flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
            <input
              v-model="inputs.highProtein"
              type="checkbox"
              class="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
            >
            <span class="text-sm text-gray-700">High Protein Diet</span>
          </label>
          <label class="flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
            <input
              v-model="inputs.pregnant"
              type="checkbox"
              class="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
            >
            <span class="text-sm text-gray-700">Pregnant</span>
          </label>
          <label class="flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-all">
            <input
              v-model="inputs.breastfeeding"
              type="checkbox"
              class="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
            >
            <span class="text-sm text-gray-700">Breastfeeding</span>
          </label>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Total Water Display -->
        <div class="text-center p-6 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl">
          <p class="text-sm text-gray-500 mb-2">Daily Water Intake</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">
              {{ result.liters }}
            </span>
            <span class="text-gray-500 text-lg">liters</span>
          </div>
          <p class="text-sm text-gray-500 mt-2">{{ result.total.toLocaleString() }} ml/day</p>
        </div>

        <!-- Glasses Visual -->
        <div class="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
          <h3 class="text-sm font-medium text-gray-700 mb-4 text-center">Glasses of Water (250ml each)</h3>
          <div class="flex flex-wrap gap-2 justify-center">
            <div
              v-for="glass in result.glasses"
              :key="glass"
              class="w-8 h-10 rounded-lg bg-gradient-to-b from-cyan-400 to-blue-500 flex items-center justify-center"
              title="250ml glass"
            >
              <div class="text-white text-xs font-bold">{{ glass }}</div>
            </div>
          </div>
          <p class="text-center text-sm text-gray-600 mt-4">
            {{ result.glasses }} glasses per day
          </p>
        </div>

        <!-- Recommendation -->
        <div class="p-4 rounded-xl bg-cyan-50 border-2 border-cyan-200">
          <p class="text-sm font-medium text-cyan-900">{{ result.recommendation }}</p>
        </div>

        <!-- Breakdown -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Water Intake Breakdown</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-600">Baseline ({{ inputs.weight }}kg)</span>
              <span class="text-sm font-semibold text-gray-900">{{ result.baseline }} ml</span>
            </div>
            <div v-if="result.adjustments.exercise > 0" class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span class="text-sm text-gray-600">Exercise</span>
              <span class="text-sm font-semibold text-blue-600">+{{ result.adjustments.exercise }} ml</span>
            </div>
            <div v-if="result.adjustments.climate > 0" class="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span class="text-sm text-gray-600">Hot Climate</span>
              <span class="text-sm font-semibold text-orange-600">+{{ result.adjustments.climate }} ml</span>
            </div>
            <div v-if="result.adjustments.highProtein > 0" class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span class="text-sm text-gray-600">High Protein Diet</span>
              <span class="text-sm font-semibold text-purple-600">+{{ result.adjustments.highProtein }} ml</span>
            </div>
            <div v-if="result.adjustments.pregnancy > 0" class="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
              <span class="text-sm text-gray-600">Pregnancy</span>
              <span class="text-sm font-semibold text-pink-600">+{{ result.adjustments.pregnancy }} ml</span>
            </div>
            <div v-if="result.adjustments.breastfeeding > 0" class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span class="text-sm text-gray-600">Breastfeeding</span>
              <span class="text-sm font-semibold text-green-600">+{{ result.adjustments.breastfeeding }} ml</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About Water Intake</h2>
      <div class="prose prose-gray max-w-none">
        <p>Proper hydration is essential for optimal health. Your daily water needs depend on several factors including body weight, activity level, climate, and special conditions.</p>

        <h3 class="text-lg font-medium mt-4 mb-2">Formula</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li><strong>Baseline:</strong> weight (kg) × 33 ml</li>
          <li><strong>Exercise:</strong> +250-1000 ml based on activity level</li>
          <li><strong>Hot Climate:</strong> +750 ml</li>
          <li><strong>High Protein Diet:</strong> +375 ml</li>
          <li><strong>Pregnancy:</strong> +300 ml</li>
          <li><strong>Breastfeeding:</strong> +700 ml</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">General Guidelines</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li><strong>Men:</strong> ~3 liters/day of drinking water</li>
          <li><strong>Women:</strong> ~2.2 liters/day of drinking water</li>
          <li>Listen to your body - thirst is a good indicator</li>
          <li>Urine color should be pale yellow</li>
          <li>Drink more during hot weather or intense exercise</li>
        </ul>

        <h3 class="text-lg font-medium mt-4 mb-2">Tips for Staying Hydrated</h3>
        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Start your day with a glass of water</li>
          <li>Keep a water bottle with you throughout the day</li>
          <li>Drink water before, during, and after exercise</li>
          <li>Eat water-rich foods like fruits and vegetables</li>
          <li>Set reminders if you often forget to drink water</li>
        </ul>
      </div>
    </template>
  </CalculatorPage>
</template>
