<script setup lang="ts">
/**
 * DistanceInput - Number input with unit toggle for distance values.
 *
 * Features:
 * - Number input with configurable min/max range
 * - Toggle button to switch between units (km/miles)
 * - Internal value always stored and emitted in km
 * - Automatic conversion on unit toggle
 * - Retro pixel styling matching other calculator inputs
 *
 * @example
 * ```vue
 * <DistanceInput v-model="distance" label="RACE DISTANCE" :min="0" :max="200" color="green" />
 * ```
 */
import { type CalculatorColor, getColorStyles } from '~/types/calculator'

const MILES_TO_KM = 1.60934

/**
 * @property modelValue - Distance value in km (v-model)
 * @property units - Available units (default: ['km', 'miles'])
 * @property min - Minimum distance in km (default: 0)
 * @property max - Maximum distance in km (default: 1000)
 * @property label - Display label for the input
 * @property color - Theme color from CalculatorColor palette (default: "orange")
 */
interface Props {
  modelValue: number
  units?: string[]
  min?: number
  max?: number
  label: string
  color?: CalculatorColor
}

const props = withDefaults(defineProps<Props>(), {
  units: () => ['km', 'miles'],
  min: 0,
  max: 1000,
  color: 'orange',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// Get colors from centralized config
const styles = computed(() => getColorStyles(props.color))

// Generate unique IDs for accessibility
const labelId = useId()
const inputId = useId()

// Currently selected unit
const activeUnit = ref(props.units[0])

// Display value in the active unit
const displayValue = computed(() => {
  if (activeUnit.value === 'miles') {
    return Math.round((props.modelValue / MILES_TO_KM) * 100) / 100
  }
  return props.modelValue
})

// Toggle to next unit
const toggleUnit = () => {
  const currentIndex = props.units.indexOf(activeUnit.value)
  activeUnit.value = props.units[(currentIndex + 1) % props.units.length]
}

// Handle input change - always emit in km
const handleInput = (e: Event) => {
  const value = parseFloat((e.target as HTMLInputElement).value) || 0

  if (activeUnit.value === 'miles') {
    const km = value * MILES_TO_KM
    emit('update:modelValue', Math.max(props.min, Math.min(props.max, km)))
  } else {
    emit('update:modelValue', Math.max(props.min, Math.min(props.max, value)))
  }
}
</script>

<template>
  <div class="space-y-4" role="group" :aria-labelledby="labelId">
    <label :id="labelId" :for="inputId" class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide">
      {{ label }}
    </label>

    <div class="flex items-center gap-2">
      <!-- Number input -->
      <input
        :id="inputId"
        type="number"
        :value="displayValue"
        :min="activeUnit === 'miles' ? Math.round((min / MILES_TO_KM) * 100) / 100 : min"
        :max="activeUnit === 'miles' ? Math.round((max / MILES_TO_KM) * 100) / 100 : max"
        step="0.01"
        :aria-label="`${label} in ${activeUnit}`"
        class="w-28 sm:w-32 px-3 py-2.5 text-right font-game text-lg sm:text-xl font-bold border-2 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        :class="[styles.border400, styles.text600]"
        @input="handleInput"
      >

      <!-- Unit toggle button -->
      <button
        type="button"
        :aria-label="`Switch unit, currently ${activeUnit}`"
        class="px-3 py-2.5 border-2 font-pixel text-xs sm:text-sm tracking-wide bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        :class="[styles.border500, styles.text600]"
        @click="toggleUnit"
      >
        {{ activeUnit.toUpperCase() }}
      </button>
    </div>
  </div>
</template>
