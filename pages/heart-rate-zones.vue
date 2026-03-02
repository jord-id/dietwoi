<script setup lang="ts">
import type { HrZonesResult } from '~/composables/useCalculations'
import type { CalculatorConfig } from '~/types/calculator'

const config: CalculatorConfig = {
  meta: {
    title: 'Heart Rate Zones Calculator',
    description: 'Find your 5 training heart rate zones using the Karvonen method',
    shortDescription: 'Calculate your 5 heart rate training zones based on your max and resting heart rate using the Karvonen (Heart Rate Reserve) method.',
    path: '/heart-rate-zones',
    color: 'red',
    contentPath: 'calculators/heart-rate-zones',
  },
  seo: {
    title: 'Heart Rate Zones Calculator - Karvonen Method Training Zones',
    description: 'Calculate your 5 heart rate training zones using the Karvonen method. Enter your max and resting heart rate to get personalized zone ranges.',
    path: '/heart-rate-zones',
  },
  schema: {
    name: 'Heart Rate Zones Calculator',
    description: 'Calculate your 5 heart rate training zones using the Karvonen method',
    url: '/heart-rate-zones',
    applicationCategory: 'HealthApplication',
  },
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Heart Rate Zones Calculator', url: '/heart-rate-zones' },
  ],
  inputs: [
    { key: 'maxHr', label: 'Max Heart Rate', type: 'slider', min: 100, max: 220, default: 190, unit: 'bpm' },
    { key: 'restingHr', label: 'Resting Heart Rate', type: 'slider', min: 30, max: 120, default: 60, unit: 'bpm' },
  ],
}

const { calculate } = useHeartRateZones()

const { inputs, result } = useCalculatorSetup<HrZonesResult>(
  config,
  (i) => calculate({
    maxHr: Number(i.maxHr),
    restingHr: Number(i.restingHr),
  })
)

// Zone colors from green (zone 1) to red (zone 5)
const zoneColors = [
  { border: 'border-green-300', bar: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
  { border: 'border-lime-300', bar: 'bg-lime-500', text: 'text-lime-700', bg: 'bg-lime-50' },
  { border: 'border-yellow-300', bar: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' },
  { border: 'border-orange-300', bar: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50' },
  { border: 'border-red-300', bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
]
</script>

<template>
  <CalculatorPage v-model:inputs="inputs" :config="config">
    <template #results>
      <div v-if="result" class="space-y-6">
        <!-- Heart Rate Reserve -->
        <div class="relative text-center p-6 border-2 border-red-200 bg-white">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
          <p class="font-pixel text-[10px] sm:text-xs text-gray-500 mb-2 tracking-wide">HEART RATE RESERVE</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="font-game text-5xl sm:text-6xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              {{ result.heartRateReserve }}
            </span>
            <span class="font-game text-lg text-gray-500">bpm</span>
          </div>
          <p class="font-game text-xs text-gray-400 mt-2">
            Max {{ result.maxHr }} - Resting {{ result.restingHr }}
          </p>
        </div>

        <!-- Zone Cards -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-3 h-3 bg-red-500" />
            <span class="font-pixel text-xs sm:text-sm tracking-wider text-gray-800">TRAINING ZONES</span>
            <div class="flex-1 h-px bg-gray-200" />
          </div>
          <div class="space-y-3">
            <div
              v-for="(zone, index) in result.zones"
              :key="zone.zone"
              class="relative p-4 border-2 bg-white"
              :class="zoneColors[index].border"
            >
              <div class="absolute top-0 left-0 right-0 h-1" :class="zoneColors[index].bar" />
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <div class="w-8 h-8 flex items-center justify-center border-2" :class="[zoneColors[index].border, zoneColors[index].bg]">
                      <span class="font-game text-sm font-bold" :class="zoneColors[index].text">{{ zone.zone }}</span>
                    </div>
                    <span class="font-pixel text-[10px] sm:text-xs tracking-wide" :class="zoneColors[index].text">{{ zone.name.toUpperCase() }}</span>
                  </div>
                  <p class="font-game text-xs text-gray-500 mt-1">{{ zone.purpose }}</p>
                </div>
                <div class="text-right">
                  <p class="font-game text-lg sm:text-xl font-bold" :class="zoneColors[index].text">
                    {{ zone.minHr }}-{{ zone.maxHr }}
                  </p>
                  <p class="font-game text-xs text-gray-400">{{ zone.minPercent }}-{{ zone.maxPercent }}% HRR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #info>
      <h2 class="font-pixel text-base sm:text-lg text-gray-900 mb-4 tracking-wide">ABOUT HEART RATE ZONES</h2>
      <div class="space-y-6">
        <p class="font-game text-base sm:text-lg text-gray-600 leading-relaxed">Heart rate zones help you train at the right intensity. This calculator uses the Karvonen method, which accounts for your resting heart rate for more personalized zones.</p>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">KARVONEN METHOD</h3>
          <div class="relative p-4 border-2 border-red-300 bg-white">
            <div class="absolute top-0 left-0 right-0 h-1 bg-red-500" />
            <p class="font-mono text-base sm:text-lg text-red-700">Target HR = HRR x %intensity + Resting HR</p>
            <p class="font-game text-sm text-gray-500 mt-2">Where HRR = Max HR - Resting HR</p>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-xs sm:text-sm text-gray-800 mb-3 tracking-wide">HOW TO MEASURE RESTING HR</h3>
          <ul class="font-game text-base sm:text-lg text-gray-600 space-y-2">
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Measure first thing in the morning, before getting out of bed</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Average readings over 3-5 consecutive days</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="w-2 h-2 bg-red-500 mt-2 flex-shrink-0" />
              <span>Typical resting HR for adults: 60-100 bpm (athletes: 40-60 bpm)</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </CalculatorPage>
</template>
