<script setup lang="ts">
/**
 * TimeInput - Hours:minutes:seconds time input for duration values.
 *
 * Features:
 * - Three number inputs side by side with ":" separators
 * - Accepts and emits total seconds as a single number
 * - Optional hours display (for shorter durations)
 * - Retro pixel styling matching other calculator inputs
 * - Clamped values (hours 0-99, minutes 0-59, seconds 0-59)
 *
 * @example
 * ```vue
 * <TimeInput v-model="duration" label="RACE TIME" :show-hours="true" color="blue" />
 * ```
 */
import { type CalculatorColor, getColorStyles } from '~/types/calculator'

/**
 * @property modelValue - Total seconds (v-model)
 * @property showHours - Whether to show hours input (default: true)
 * @property label - Display label for the input
 * @property color - Theme color from CalculatorColor palette (default: "orange")
 */
interface Props {
  modelValue: number
  showHours?: boolean
  label: string
  color?: CalculatorColor
}

const props = withDefaults(defineProps<Props>(), {
  showHours: true,
  color: 'orange',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Get colors from centralized config
const styles = computed(() => getColorStyles(props.color))

// Generate unique ID for accessibility
const labelId = useId()

// Decompose total seconds into h/m/s
const hours = computed(() => Math.floor(props.modelValue / 3600))
const minutes = computed(() => Math.floor((props.modelValue % 3600) / 60))
const seconds = computed(() => props.modelValue % 60)

// Emit updated total seconds from individual fields
const updateTime = (h: number, m: number, s: number) => {
  const clampedH = Math.max(0, Math.min(99, Math.floor(h) || 0))
  const clampedM = Math.max(0, Math.min(59, Math.floor(m) || 0))
  const clampedS = Math.max(0, Math.min(59, Math.floor(s) || 0))
  emit('update:modelValue', clampedH * 3600 + clampedM * 60 + clampedS)
}

const handleHoursInput = (e: Event) => {
  const value = parseInt((e.target as HTMLInputElement).value) || 0
  updateTime(value, minutes.value, seconds.value)
}

const handleMinutesInput = (e: Event) => {
  const value = parseInt((e.target as HTMLInputElement).value) || 0
  updateTime(props.showHours ? hours.value : 0, value, seconds.value)
}

const handleSecondsInput = (e: Event) => {
  const value = parseInt((e.target as HTMLInputElement).value) || 0
  updateTime(props.showHours ? hours.value : 0, minutes.value, value)
}
</script>

<template>
  <div class="space-y-4" role="group" :aria-labelledby="labelId">
    <label :id="labelId" class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide">
      {{ label }}
    </label>

    <div class="flex items-center gap-1">
      <!-- Hours -->
      <template v-if="showHours">
        <div class="flex flex-col items-center">
          <input
            type="number"
            :value="hours"
            min="0"
            max="99"
            :aria-label="`${label} hours`"
            class="w-16 sm:w-20 px-2 py-2.5 text-center font-game text-lg sm:text-xl font-bold border-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            :class="[styles.border400, styles.text600]"
            @input="handleHoursInput"
          >
          <span class="font-pixel text-[10px] text-gray-400 mt-1">HRS</span>
        </div>
        <span class="font-game text-2xl font-bold text-gray-400 pb-5" aria-hidden="true">:</span>
      </template>

      <!-- Minutes -->
      <div class="flex flex-col items-center">
        <input
          type="number"
          :value="minutes"
          min="0"
          max="59"
          :aria-label="`${label} minutes`"
          class="w-16 sm:w-20 px-2 py-2.5 text-center font-game text-lg sm:text-xl font-bold border-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          :class="[styles.border400, styles.text600]"
          @input="handleMinutesInput"
        >
        <span class="font-pixel text-[10px] text-gray-400 mt-1">MIN</span>
      </div>

      <span class="font-game text-2xl font-bold text-gray-400 pb-5" aria-hidden="true">:</span>

      <!-- Seconds -->
      <div class="flex flex-col items-center">
        <input
          type="number"
          :value="seconds"
          min="0"
          max="59"
          :aria-label="`${label} seconds`"
          class="w-16 sm:w-20 px-2 py-2.5 text-center font-game text-lg sm:text-xl font-bold border-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          :class="[styles.border400, styles.text600]"
          @input="handleSecondsInput"
        >
        <span class="font-pixel text-[10px] text-gray-400 mt-1">SEC</span>
      </div>
    </div>
  </div>
</template>
