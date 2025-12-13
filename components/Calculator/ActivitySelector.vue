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

const activityOptions: { value: ActivityLevel; name: string; description: string }[] = [
  { value: 'sedentary', name: 'Sedentary', description: 'Little or no exercise, desk job' },
  { value: 'light', name: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 'moderate', name: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 'active', name: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 'athlete', name: 'Athlete', description: 'Very hard training, physical job' },
]

const colorClasses: Record<CalculatorColor, { selected: string; border: string; radio: string }> = {
  purple: {
    selected: 'border-purple-500 bg-purple-50',
    border: 'hover:border-purple-200',
    radio: 'border-purple-500 bg-purple-500',
  },
  orange: {
    selected: 'border-orange-500 bg-orange-50',
    border: 'hover:border-orange-200',
    radio: 'border-orange-500 bg-orange-500',
  },
  blue: {
    selected: 'border-blue-500 bg-blue-50',
    border: 'hover:border-blue-200',
    radio: 'border-blue-500 bg-blue-500',
  },
  teal: {
    selected: 'border-teal-500 bg-teal-50',
    border: 'hover:border-teal-200',
    radio: 'border-teal-500 bg-teal-500',
  },
  pink: {
    selected: 'border-pink-500 bg-pink-50',
    border: 'hover:border-pink-200',
    radio: 'border-pink-500 bg-pink-500',
  },
  red: {
    selected: 'border-red-500 bg-red-50',
    border: 'hover:border-red-200',
    radio: 'border-red-500 bg-red-500',
  },
  green: {
    selected: 'border-green-500 bg-green-50',
    border: 'hover:border-green-200',
    radio: 'border-green-500 bg-green-500',
  },
  cyan: {
    selected: 'border-cyan-500 bg-cyan-50',
    border: 'hover:border-cyan-200',
    radio: 'border-cyan-500 bg-cyan-500',
  },
  amber: {
    selected: 'border-amber-500 bg-amber-50',
    border: 'hover:border-amber-200',
    radio: 'border-amber-500 bg-amber-500',
  },
}

// Fallback for safety
const getColorClasses = (color: CalculatorColor) => colorClasses[color] || colorClasses.blue
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium text-gray-700">Activity Level</label>
    <div class="grid gap-2">
      <button
        v-for="option in activityOptions"
        :key="option.value"
        type="button"
        class="flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-150 text-left"
        :class="[
          modelValue === option.value
            ? getColorClasses(color).selected
            : `border-gray-200 ${getColorClasses(color).border}`
        ]"
        @click="modelValue = option.value"
      >
        <div>
          <p class="font-medium text-gray-900 text-sm">{{ option.name }}</p>
          <p class="text-xs text-gray-500">{{ option.description }}</p>
        </div>
        <div
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
          :class="modelValue === option.value ? getColorClasses(color).radio.split(' ')[0] : 'border-gray-300'"
        >
          <div
            v-if="modelValue === option.value"
            class="w-3 h-3 rounded-full"
            :class="getColorClasses(color).radio.split(' ')[1]"
          />
        </div>
      </button>
    </div>
  </div>
</template>
