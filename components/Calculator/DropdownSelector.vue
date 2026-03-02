<script setup lang="ts">
/**
 * DropdownSelector - Accessible dropdown/button group for option selection.
 *
 * Features:
 * - Button grid for small option sets (2-4 options) like GenderSelector
 * - Native styled select for larger sets (5+ options)
 * - Full keyboard navigation (arrows, Enter, Space)
 * - ARIA radiogroup for button grid, native select semantics for dropdown
 * - Visual selection indicator with accent color
 *
 * @example
 * ```vue
 * <DropdownSelector
 *   v-model="goal"
 *   :options="[{ value: 'lose', label: 'Lose Weight' }, { value: 'gain', label: 'Gain Weight' }]"
 *   label="GOAL"
 *   color="teal"
 * />
 * ```
 */
import { type CalculatorColor, getColorStyles } from '~/types/calculator'

/**
 * @property modelValue - Selected option value (v-model)
 * @property options - Array of selectable options
 * @property label - Display label for the input
 * @property color - Theme color from CalculatorColor palette (default: "orange")
 */
interface Props {
  modelValue: string
  options: { value: string; label: string }[]
  label: string
  color?: CalculatorColor
}

const props = withDefaults(defineProps<Props>(), {
  color: 'orange',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Get colors from centralized config
const styles = computed(() => getColorStyles(props.color))

// Generate unique ID for accessibility
const groupId = useId()

// Whether to use button grid (2-4 options) or native select (5+)
const useButtonGrid = computed(() => props.options.length >= 2 && props.options.length <= 4)

// Refs for focus management (button grid mode)
const buttonRefs = ref<(HTMLButtonElement | null)[]>([])

// Keyboard navigation for button grid
const handleKeydown = (e: KeyboardEvent, index: number) => {
  let newIndex = index

  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault()
      newIndex = index > 0 ? index - 1 : props.options.length - 1
      break
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault()
      newIndex = index < props.options.length - 1 ? index + 1 : 0
      break
    case 'Home':
      e.preventDefault()
      newIndex = 0
      break
    case 'End':
      e.preventDefault()
      newIndex = props.options.length - 1
      break
    case ' ':
    case 'Enter':
      e.preventDefault()
      emit('update:modelValue', props.options[index].value)
      return
    default:
      return
  }

  emit('update:modelValue', props.options[newIndex].value)
  buttonRefs.value[newIndex]?.focus()
}

// Handle native select change
const handleSelectChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="space-y-4">
    <span :id="groupId" class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide">{{ label }}</span>

    <!-- Button grid for 2-4 options -->
    <div
      v-if="useButtonGrid"
      role="radiogroup"
      :aria-labelledby="groupId"
      class="grid gap-3"
      :class="{ 2: 'grid-cols-2', 3: 'grid-cols-3' }[options.length] || 'grid-cols-2'"
    >
      <button
        v-for="(option, index) in options"
        :ref="(el) => buttonRefs[index] = el as HTMLButtonElement"
        :key="option.value"
        type="button"
        role="radio"
        :aria-checked="modelValue === option.value"
        :tabindex="modelValue === option.value ? 0 : -1"
        class="relative p-4 border-2 bg-white text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        :class="[
          modelValue === option.value ? styles.border500 : 'border-gray-200 hover:border-gray-300',
          modelValue === option.value ? 'focus-visible:ring-current' : 'focus-visible:ring-gray-400'
        ]"
        @click="emit('update:modelValue', option.value)"
        @keydown="handleKeydown($event, index)"
      >
        <!-- Selection indicator -->
        <div
          v-if="modelValue === option.value"
          class="absolute top-0 left-0 w-full h-1"
          :class="styles.bg500"
          aria-hidden="true"
        />

        <span
          class="font-pixel text-xs sm:text-sm tracking-wide"
          :class="modelValue === option.value ? 'text-gray-800' : 'text-gray-500'"
        >
          {{ option.label }}
        </span>

        <!-- Corner accents when selected -->
        <template v-if="modelValue === option.value">
          <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" :class="styles.border300" aria-hidden="true" />
          <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" :class="styles.border300" aria-hidden="true" />
        </template>
      </button>
    </div>

    <!-- Native select for 5+ options -->
    <div v-else class="relative">
      <select
        :value="modelValue"
        :aria-labelledby="groupId"
        class="w-full px-4 py-3 border-2 bg-white font-game text-base sm:text-lg appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        :class="[styles.border400, styles.text600]"
        @change="handleSelectChange"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Custom dropdown arrow -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
        <div class="w-3 h-3 border-r-2 border-b-2 rotate-45 -mt-1" :class="styles.border500" />
      </div>
    </div>
  </div>
</template>
