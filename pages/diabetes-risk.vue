<script setup lang="ts">
import type { FindriscResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Diabetes Risk Calculator',
    description: 'Assess your 10-year type 2 diabetes risk using the FINDRISC questionnaire',
    shortDescription: 'Answer 8 simple questions to estimate your 10-year risk of developing type 2 diabetes using the validated FINDRISC score.',
    path: '/diabetes-risk',
    color: 'green',
    contentPath: 'calculators/diabetes-risk',
  },
  seo: {
    title: 'Diabetes Risk Calculator - FINDRISC Score Assessment',
    description: 'Free FINDRISC diabetes risk calculator. Answer 8 questions to estimate your 10-year risk of developing type 2 diabetes.',
    path: '/diabetes-risk',
  },
  schema: {
    name: 'Diabetes Risk Calculator',
    description: 'Assess your 10-year type 2 diabetes risk using the FINDRISC questionnaire',
    url: '/diabetes-risk',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Diabetes Risk Calculator', url: '/diabetes-risk' },
  ],
  inputs: [],
}

const { calculate } = useDiabetesRisk()

// Manage state manually (questionnaire format)
const inputs = ref<Record<string, number | string | Record<string, string>>>({})

const ageGroup = ref<'under45' | '45-54' | '55-64' | 'over64'>('under45')
const bmiGroup = ref<'under25' | '25-30' | 'over30'>('under25')
const waistGroup = ref<'low' | 'medium' | 'high'>('low')
const dailyActivity = ref(true)
const dailyVegetables = ref(true)
const bpMedication = ref(false)
const highGlucoseHistory = ref(false)
const familyHistory = ref(false)

const result = ref<FindriscResult | null>(null)

const doCalculate = () => {
  result.value = calculate({
    ageGroup: ageGroup.value,
    bmiGroup: bmiGroup.value,
    waistGroup: waistGroup.value,
    dailyActivity: dailyActivity.value,
    dailyVegetables: dailyVegetables.value,
    bpMedication: bpMedication.value,
    highGlucoseHistory: highGlucoseHistory.value,
    familyHistory: familyHistory.value,
  })
}

onMounted(doCalculate)
watch([ageGroup, bmiGroup, waistGroup, dailyActivity, dailyVegetables, bpMedication, highGlucoseHistory, familyHistory], doCalculate)

const riskColors: Record<string, { text: string; gradient: string; border: string }> = {
  'Low': { text: 'text-green-700', gradient: 'from-green-500 to-emerald-500', border: 'border-green-300' },
  'Slightly Elevated': { text: 'text-yellow-700', gradient: 'from-yellow-500 to-amber-500', border: 'border-yellow-300' },
  'Moderate': { text: 'text-orange-700', gradient: 'from-orange-500 to-amber-500', border: 'border-orange-300' },
  'High': { text: 'text-red-600', gradient: 'from-red-500 to-rose-500', border: 'border-red-300' },
  'Very High': { text: 'text-red-800', gradient: 'from-red-700 to-rose-700', border: 'border-red-500' },
}

const currentRiskColor = computed(() => {
  if (!result.value) return riskColors['Low']
  return riskColors[result.value.riskCategory] || riskColors['Low']
})

const ageOptions = [
  { value: 'under45' as const, label: 'Under 45' },
  { value: '45-54' as const, label: '45-54' },
  { value: '55-64' as const, label: '55-64' },
  { value: 'over64' as const, label: '65+' },
]

const bmiOptions = [
  { value: 'under25' as const, label: 'Under 25' },
  { value: '25-30' as const, label: '25-30' },
  { value: 'over30' as const, label: 'Over 30' },
]

const waistOptions = [
  { value: 'low' as const, label: 'Low', desc: 'M: < 94cm / F: < 80cm' },
  { value: 'medium' as const, label: 'Medium', desc: 'M: 94-102cm / F: 80-88cm' },
  { value: 'high' as const, label: 'High', desc: 'M: > 102cm / F: > 88cm' },
]
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #extra-inputs>
      <!-- Q1: Age Group -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">1. AGE GROUP</label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="opt in ageOptions"
            :key="opt.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="ageGroup === opt.value ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="ageGroup = opt.value"
          >
            <div v-if="ageGroup === opt.value" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="ageGroup === opt.value ? 'text-green-700' : 'text-gray-600'">
              {{ opt.label.toUpperCase() }}
            </span>
          </button>
        </div>
      </div>

      <!-- Q2: BMI Group -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">2. BMI GROUP</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="opt in bmiOptions"
            :key="opt.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="bmiGroup === opt.value ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="bmiGroup = opt.value"
          >
            <div v-if="bmiGroup === opt.value" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="bmiGroup === opt.value ? 'text-green-700' : 'text-gray-600'">
              {{ opt.label.toUpperCase() }}
            </span>
          </button>
        </div>
      </div>

      <!-- Q3: Waist Circumference -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">3. WAIST CIRCUMFERENCE</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="opt in waistOptions"
            :key="opt.value"
            class="relative p-3 border-2 bg-white text-center"
            :class="waistGroup === opt.value ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="waistGroup = opt.value"
          >
            <div v-if="waistGroup === opt.value" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="block font-pixel text-[10px] sm:text-xs tracking-wide" :class="waistGroup === opt.value ? 'text-green-700' : 'text-gray-600'">
              {{ opt.label.toUpperCase() }}
            </span>
            <span class="block font-game text-[10px] text-gray-400 mt-1">{{ opt.desc }}</span>
          </button>
        </div>
      </div>

      <!-- Q4: Daily Activity -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">4. 30+ MIN DAILY PHYSICAL ACTIVITY?</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="dailyActivity ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="dailyActivity = true"
          >
            <div v-if="dailyActivity" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="dailyActivity ? 'text-green-700' : 'text-gray-600'">YES</span>
          </button>
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="!dailyActivity ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="dailyActivity = false"
          >
            <div v-if="!dailyActivity" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="!dailyActivity ? 'text-green-700' : 'text-gray-600'">NO</span>
          </button>
        </div>
      </div>

      <!-- Q5: Daily Vegetables -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">5. DAILY FRUITS/VEGETABLES?</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="dailyVegetables ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="dailyVegetables = true"
          >
            <div v-if="dailyVegetables" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="dailyVegetables ? 'text-green-700' : 'text-gray-600'">YES</span>
          </button>
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="!dailyVegetables ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="dailyVegetables = false"
          >
            <div v-if="!dailyVegetables" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="!dailyVegetables ? 'text-green-700' : 'text-gray-600'">NO</span>
          </button>
        </div>
      </div>

      <!-- Q6: BP Medication -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">6. BLOOD PRESSURE MEDICATION?</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="bpMedication ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="bpMedication = true"
          >
            <div v-if="bpMedication" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="bpMedication ? 'text-green-700' : 'text-gray-600'">YES</span>
          </button>
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="!bpMedication ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="bpMedication = false"
          >
            <div v-if="!bpMedication" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="!bpMedication ? 'text-green-700' : 'text-gray-600'">NO</span>
          </button>
        </div>
      </div>

      <!-- Q7: High Glucose History -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">7. HISTORY OF HIGH BLOOD GLUCOSE?</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="highGlucoseHistory ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="highGlucoseHistory = true"
          >
            <div v-if="highGlucoseHistory" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="highGlucoseHistory ? 'text-green-700' : 'text-gray-600'">YES</span>
          </button>
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="!highGlucoseHistory ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="highGlucoseHistory = false"
          >
            <div v-if="!highGlucoseHistory" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="!highGlucoseHistory ? 'text-green-700' : 'text-gray-600'">NO</span>
          </button>
        </div>
      </div>

      <!-- Q8: Family History -->
      <div>
        <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide mb-3 block">8. FAMILY HISTORY OF DIABETES?</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="familyHistory ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="familyHistory = true"
          >
            <div v-if="familyHistory" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="familyHistory ? 'text-green-700' : 'text-gray-600'">YES</span>
          </button>
          <button
            class="relative p-3 border-2 bg-white text-center"
            :class="!familyHistory ? 'border-green-500' : 'border-gray-200 hover:border-gray-300'"
            @click="familyHistory = false"
          >
            <div v-if="!familyHistory" class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="!familyHistory ? 'text-green-700' : 'text-gray-600'">NO</span>
          </button>
        </div>
      </div>
    </template>

    <template #results>
      <CalculatorDisclaimer />

      <div v-if="result" class="space-y-6">
        <!-- FINDRISC Score -->
        <div class="relative text-center p-6 border-2 bg-white" :class="currentRiskColor.border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="currentRiskColor.gradient" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">FINDRISC SCORE</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-6xl sm:text-7xl font-bold bg-gradient-to-r bg-clip-text text-transparent" :class="currentRiskColor.gradient">
              {{ result.score }}
            </span>
            <span class="font-game text-lg text-gray-500">/ 26</span>
          </div>
        </div>

        <!-- Risk Category -->
        <div class="relative p-4 border-2 bg-white" :class="currentRiskColor.border">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="currentRiskColor.gradient" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 tracking-wide mb-1">RISK CATEGORY</p>
          <p class="font-pixel text-base sm:text-lg tracking-wide" :class="currentRiskColor.text">
            {{ result.riskCategory.toUpperCase() }}
          </p>
        </div>

        <!-- 10-Year Risk -->
        <div class="relative p-4 border-2 border-green-200 bg-white">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
          <div class="pl-2 flex items-center justify-between">
            <div>
              <p class="font-pixel text-[10px] sm:text-xs text-gray-500 tracking-wide">10-YEAR RISK</p>
              <p class="font-game text-xs text-gray-400 mt-1">Chance of developing type 2 diabetes</p>
            </div>
            <span class="font-game text-3xl sm:text-4xl font-bold text-green-700">{{ result.tenYearRisk }}</span>
          </div>
        </div>

        <!-- Score Scale -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-green-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">SCORE SCALE</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-3 p-2 border border-green-200 bg-white">
              <div class="w-3 h-3 bg-green-500 flex-shrink-0" />
              <span class="font-game text-xs text-gray-600 flex-1">0-6: Low (~1%)</span>
            </div>
            <div class="flex items-center gap-3 p-2 border border-yellow-200 bg-white">
              <div class="w-3 h-3 bg-yellow-500 flex-shrink-0" />
              <span class="font-game text-xs text-gray-600 flex-1">7-11: Slightly Elevated (~4%)</span>
            </div>
            <div class="flex items-center gap-3 p-2 border border-orange-200 bg-white">
              <div class="w-3 h-3 bg-orange-500 flex-shrink-0" />
              <span class="font-game text-xs text-gray-600 flex-1">12-14: Moderate (~17%)</span>
            </div>
            <div class="flex items-center gap-3 p-2 border border-red-200 bg-white">
              <div class="w-3 h-3 bg-red-500 flex-shrink-0" />
              <span class="font-game text-xs text-gray-600 flex-1">15-20: High (~33%)</span>
            </div>
            <div class="flex items-center gap-3 p-2 border border-red-400 bg-white">
              <div class="w-3 h-3 bg-red-700 flex-shrink-0" />
              <span class="font-game text-xs text-gray-600 flex-1">21+: Very High (~50%)</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT FINDRISC</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">
          The Finnish Diabetes Risk Score (FINDRISC) is a validated questionnaire that estimates your 10-year risk of developing type 2 diabetes. It was developed by Lindstrom and Tuomilehto (2003).
        </p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HOW IT WORKS</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>8 simple questions about lifestyle and health history</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>No blood tests required</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Score range: 0-26 points</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
              <span>Validated in multiple populations worldwide</span>
            </li>
          </ul>
        </div>

        <div class="relative p-4 border-2 border-green-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-green-500" />
          <p class="font-game text-sm sm:text-base text-green-700">
            <strong>Source:</strong> Lindstrom J, Tuomilehto J. The Diabetes Risk Score. Diabetes Care. 2003;26(3):725-731.
          </p>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
