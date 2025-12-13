<script setup lang="ts">
import type { CalculatorColor } from '~/types/calculator'

interface Props {
  modelValue: number
  min: number
  max: number
  step?: number
  label: string
  unit: string
  color?: CalculatorColor
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  color: 'orange',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Local input value for free typing
const localValue = ref(String(props.modelValue))
const isFocused = ref(false)
const isOutOfRange = ref(false)

// Sync local value when modelValue changes externally (e.g., from slider)
watch(() => props.modelValue, (newVal) => {
  if (!isFocused.value) {
    localValue.value = String(newVal)
  }
})

// All color classes
const colorClasses: Record<CalculatorColor, { bg: string; thumb: string; text: string; border: string }> = {
  orange: { bg: 'bg-orange-400', thumb: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-400' },
  purple: { bg: 'bg-purple-400', thumb: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-400' },
  teal: { bg: 'bg-teal-400', thumb: 'bg-teal-500', text: 'text-teal-600', border: 'border-teal-400' },
  blue: { bg: 'bg-blue-400', thumb: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-400' },
  amber: { bg: 'bg-amber-400', thumb: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-400' },
  pink: { bg: 'bg-pink-400', thumb: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-400' },
  red: { bg: 'bg-red-400', thumb: 'bg-red-500', text: 'text-red-600', border: 'border-red-400' },
  green: { bg: 'bg-green-400', thumb: 'bg-green-500', text: 'text-green-600', border: 'border-green-400' },
  cyan: { bg: 'bg-cyan-400', thumb: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-400' },
}

const colors = computed(() => colorClasses[props.color] || colorClasses.orange)

const percentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

// Slider input - immediate update
const handleSliderInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = parseFloat(target.value)
  localValue.value = String(value)
  emit('update:modelValue', value)
}

// Number input - free typing, no clamping until blur
const handleNumberInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  localValue.value = target.value

  const value = parseFloat(target.value)
  if (!isNaN(value)) {
    // Check if out of range for visual feedback
    isOutOfRange.value = value < props.min || value > props.max

    // Update model with clamped value for live preview
    const clampedValue = Math.max(props.min, Math.min(props.max, value))
    emit('update:modelValue', clampedValue)
  }
}

// On blur - finalize and clamp
const handleBlur = () => {
  isFocused.value = false
  isOutOfRange.value = false

  let value = parseFloat(localValue.value)
  if (isNaN(value)) {
    value = props.min
  }
  value = Math.max(props.min, Math.min(props.max, value))
  localValue.value = String(value)
  emit('update:modelValue', value)
}

const handleFocus = () => {
  isFocused.value = true
}
</script>

<template>
  <div class="space-y-4">
    <!-- Label row -->
    <div class="flex items-center justify-between">
      <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide">{{ label }}</label>
      <div class="flex items-center gap-2">
        <!-- Number input with retro styling -->
        <div class="relative">
          <input
            type="number"
            :value="localValue"
            :min="min"
            :max="max"
            :step="step"
            class="w-24 sm:w-28 px-3 py-2.5 text-right font-game text-lg sm:text-xl font-bold border-2 bg-white focus:outline-none"
            :class="[
              isOutOfRange ? 'border-red-400 text-red-600' : colors.border,
              colors.text
            ]"
            @input="handleNumberInput"
            @blur="handleBlur"
            @focus="handleFocus"
          >
        </div>
        <span class="font-game text-sm sm:text-base text-gray-500">{{ unit }}</span>
      </div>
    </div>

    <!-- Slider track -->
    <div class="relative h-4">
      <!-- Track background with pixel styling -->
      <div class="absolute inset-0 bg-gray-200 border border-gray-300">
        <!-- Filled portion -->
        <div
          class="h-full"
          :class="colors.bg"
          :style="{ width: `${percentage}%` }"
        />
      </div>

      <!-- Hidden range input -->
      <input
        type="range"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        @input="handleSliderInput"
      >

      <!-- Custom thumb - pixel square style -->
      <div
        class="absolute top-1/2 -translate-y-1/2 w-6 h-6 border-2 border-white shadow-md pointer-events-none"
        :class="colors.thumb"
        :style="{ left: `calc(${percentage}% - 12px)` }"
      />
    </div>

    <!-- Range info -->
    <div class="flex justify-between items-center">
      <span class="font-pixel text-[10px] sm:text-xs text-gray-400">{{ min }}</span>
      <span
        v-if="isOutOfRange"
        class="font-pixel text-[10px] sm:text-xs text-red-500 animate-pulse"
      >
        RANGE: {{ min }}-{{ max }}
      </span>
      <span class="font-pixel text-[10px] sm:text-xs text-gray-400">{{ max }}</span>
    </div>
  </div>
</template>
