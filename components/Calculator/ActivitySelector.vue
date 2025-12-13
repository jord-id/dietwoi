<script setup lang="ts">
import type { ActivityLevel } from '~/composables/useCalculations'
import type { CalculatorColor } from '~/types/calculator'

interface Props {
  color?: CalculatorColor
}

withDefaults(defineProps<Props>(), {
  color: 'blue',
})

const modelValue = defineModel<ActivityLevel>({ required: true })

const activityOptions: { value: ActivityLevel; name: string; multiplier: string }[] = [
  { value: 'sedentary', name: 'SEDENTARY', multiplier: '1.2x' },
  { value: 'light', name: 'LIGHT', multiplier: '1.375x' },
  { value: 'moderate', name: 'MODERATE', multiplier: '1.55x' },
  { value: 'active', name: 'VERY ACTIVE', multiplier: '1.725x' },
  { value: 'athlete', name: 'ATHLETE', multiplier: '1.9x' },
]

const colorClasses: Record<CalculatorColor, { active: string; activeBg: string; border: string }> = {
  purple: { active: 'border-purple-500', activeBg: 'bg-purple-500', border: 'border-purple-300' },
  orange: { active: 'border-orange-500', activeBg: 'bg-orange-500', border: 'border-orange-300' },
  blue: { active: 'border-blue-500', activeBg: 'bg-blue-500', border: 'border-blue-300' },
  teal: { active: 'border-teal-500', activeBg: 'bg-teal-500', border: 'border-teal-300' },
  pink: { active: 'border-pink-500', activeBg: 'bg-pink-500', border: 'border-pink-300' },
  red: { active: 'border-red-500', activeBg: 'bg-red-500', border: 'border-red-300' },
  green: { active: 'border-green-500', activeBg: 'bg-green-500', border: 'border-green-300' },
  cyan: { active: 'border-cyan-500', activeBg: 'bg-cyan-500', border: 'border-cyan-300' },
  amber: { active: 'border-amber-500', activeBg: 'bg-amber-500', border: 'border-amber-300' },
}

const getColorClasses = (color: CalculatorColor) => colorClasses[color] || colorClasses.blue
</script>

<template>
  <div class="space-y-4">
    <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide">ACTIVITY LEVEL</label>
    <div class="space-y-2">
      <button
        v-for="option in activityOptions"
        :key="option.value"
        type="button"
        class="relative w-full p-3 border-2 bg-white text-left flex items-center justify-between"
        :class="modelValue === option.value ? getColorClasses(color).active : 'border-gray-200 hover:border-gray-300'"
        @click="modelValue = option.value"
      >
        <!-- Left indicator bar when selected -->
        <div
          v-if="modelValue === option.value"
          class="absolute left-0 top-0 bottom-0 w-1"
          :class="getColorClasses(color).activeBg"
        />

        <div class="flex items-center gap-3 pl-2">
          <!-- Radio indicator -->
          <div
            class="w-4 h-4 border-2 flex items-center justify-center"
            :class="modelValue === option.value ? getColorClasses(color).active : 'border-gray-300'"
          >
            <div
              v-if="modelValue === option.value"
              class="w-2 h-2"
              :class="getColorClasses(color).activeBg"
            />
          </div>

          <span
            class="font-pixel text-xs sm:text-sm tracking-wide"
            :class="modelValue === option.value ? 'text-gray-800' : 'text-gray-500'"
          >
            {{ option.name }}
          </span>
        </div>

        <!-- Multiplier badge -->
        <div
          class="px-2 py-1 font-game text-xs sm:text-sm"
          :class="modelValue === option.value ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-400'"
        >
          {{ option.multiplier }}
        </div>
      </button>
    </div>
  </div>
</template>
