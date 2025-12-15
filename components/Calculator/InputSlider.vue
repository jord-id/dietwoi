<script setup lang="ts">
import { type CalculatorColor, getColorStyles } from '~/types/calculator'

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

// Generate unique IDs for accessibility
const inputId = useId()
const sliderId = useId()
const labelId = useId()

// Sync local value when modelValue changes externally (e.g., from slider)
watch(() => props.modelValue, (newVal) => {
  if (!isFocused.value) {
    localValue.value = String(newVal)
  }
})

// Get colors from centralized config
const styles = computed(() => getColorStyles(props.color))

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
  <div class="space-y-4" role="group" :aria-labelledby="labelId">
    <!-- Label row -->
    <div class="flex items-center justify-between">
      <label
        :id="labelId"
        :for="inputId"
        class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide"
      >
        {{ label }}
      </label>
      <div class="flex items-center gap-2">
        <!-- Number input with retro styling -->
        <div class="relative">
          <input
            :id="inputId"
            type="number"
            :value="localValue"
            :min="min"
            :max="max"
            :step="step"
            :aria-label="`${label} value in ${unit}`"
            :aria-invalid="isOutOfRange"
            :aria-describedby="isOutOfRange ? `${inputId}-error` : undefined"
            class="w-24 sm:w-28 px-3 py-2.5 text-right font-game text-lg sm:text-xl font-bold border-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            :class="[
              isOutOfRange ? 'border-red-400 text-red-600 focus-visible:ring-red-400' : [styles.border400, 'focus-visible:ring-current'],
              styles.text600
            ]"
            @input="handleNumberInput"
            @blur="handleBlur"
            @focus="handleFocus"
          >
        </div>
        <span class="font-game text-sm sm:text-base text-gray-500" aria-hidden="true">{{ unit }}</span>
      </div>
    </div>

    <!-- Slider track -->
    <div class="relative h-4">
      <!-- Track background with pixel styling -->
      <div class="absolute inset-0 bg-gray-200 border border-gray-300" aria-hidden="true">
        <!-- Filled portion -->
        <div
          class="h-full"
          :class="styles.bg400"
          :style="{ width: `${percentage}%` }"
        />
      </div>

      <!-- Range input with ARIA -->
      <input
        :id="sliderId"
        type="range"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :aria-label="`${label} slider`"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="modelValue"
        :aria-valuetext="`${modelValue} ${unit}`"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer focus-visible:opacity-100"
        @input="handleSliderInput"
      >

      <!-- Custom thumb - pixel square style (decorative) -->
      <div
        class="absolute top-1/2 -translate-y-1/2 w-6 h-6 border-2 border-white shadow-md pointer-events-none"
        :class="styles.bg500"
        :style="{ left: `calc(${percentage}% - 12px)` }"
        aria-hidden="true"
      />
    </div>

    <!-- Range info -->
    <div class="flex justify-between items-center" aria-hidden="true">
      <span class="font-pixel text-[10px] sm:text-xs text-gray-400">{{ min }}</span>
      <span
        v-if="isOutOfRange"
        :id="`${inputId}-error`"
        class="font-pixel text-[10px] sm:text-xs text-red-500 animate-pulse"
        role="alert"
      >
        RANGE: {{ min }}-{{ max }}
      </span>
      <span class="font-pixel text-[10px] sm:text-xs text-gray-400">{{ max }}</span>
    </div>
  </div>
</template>
