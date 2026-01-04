<script setup lang="ts">
/**
 * ActivitySelector - Accessible radio group for activity level selection.
 *
 * Features:
 * - Five activity levels with TDEE multipliers (1.2x - 1.9x)
 * - Full keyboard navigation (arrows, Home, End, Enter, Space)
 * - ARIA radiogroup with descriptive labels
 * - Visual selection indicator and multiplier badge
 * - Each option shows name, description, and multiplier
 *
 * Activity Levels:
 * - Sedentary (1.2x): Little or no exercise
 * - Light (1.375x): Light exercise 1-3 days/week
 * - Moderate (1.55x): Moderate exercise 3-5 days/week
 * - Very Active (1.725x): Hard exercise 6-7 days/week
 * - Athlete (1.9x): Very hard exercise or physical job
 *
 * @example
 * ```vue
 * <ActivitySelector v-model="activityLevel" color="blue" />
 * ```
 */
import type { ActivityLevel } from '~/composables/useCalculations'
import { type CalculatorColor, getColorStyles } from '~/types/calculator'

/**
 * @property color - Theme color from CalculatorColor palette (default: "blue")
 * @model ActivityLevel - Selected activity level (v-model)
 */
interface Props {
  color?: CalculatorColor
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
})

const modelValue = defineModel<ActivityLevel>({ required: true })

const activityOptions: { value: ActivityLevel; name: string; multiplier: string; description: string }[] = [
  { value: 'sedentary', name: 'SEDENTARY', multiplier: '1.2x', description: 'Little or no exercise' },
  { value: 'light', name: 'LIGHT', multiplier: '1.375x', description: 'Light exercise 1-3 days per week' },
  { value: 'moderate', name: 'MODERATE', multiplier: '1.55x', description: 'Moderate exercise 3-5 days per week' },
  { value: 'active', name: 'VERY ACTIVE', multiplier: '1.725x', description: 'Hard exercise 6-7 days per week' },
  { value: 'athlete', name: 'ATHLETE', multiplier: '1.9x', description: 'Very hard exercise or physical job' },
]

// Get colors from centralized config
const styles = computed(() => getColorStyles(props.color))

// Generate unique ID for accessibility
const groupId = useId()

// Refs for focus management
const buttonRefs = ref<(HTMLButtonElement | null)[]>([])

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent, index: number) => {
  let newIndex = index

  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault()
      newIndex = index > 0 ? index - 1 : activityOptions.length - 1
      break
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault()
      newIndex = index < activityOptions.length - 1 ? index + 1 : 0
      break
    case 'Home':
      e.preventDefault()
      newIndex = 0
      break
    case 'End':
      e.preventDefault()
      newIndex = activityOptions.length - 1
      break
    case ' ':
    case 'Enter':
      e.preventDefault()
      modelValue.value = activityOptions[index].value
      return
    default:
      return
  }

  modelValue.value = activityOptions[newIndex].value
  buttonRefs.value[newIndex]?.focus()
}
</script>

<template>
  <div class="space-y-4">
    <span :id="groupId" class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide">ACTIVITY LEVEL</span>
    <div
      role="radiogroup"
      :aria-labelledby="groupId"
      class="space-y-2"
    >
      <button
        v-for="(option, index) in activityOptions"
        :ref="(el) => buttonRefs[index] = el as HTMLButtonElement"
        :key="option.value"
        type="button"
        role="radio"
        :aria-checked="modelValue === option.value"
        :aria-label="`${option.name}, ${option.description}, multiplier ${option.multiplier}`"
        :tabindex="modelValue === option.value ? 0 : -1"
        class="relative w-full p-3 border-2 bg-white text-left flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        :class="[
          modelValue === option.value ? styles.border500 : 'border-gray-200 hover:border-gray-300',
          modelValue === option.value ? 'focus-visible:ring-current' : 'focus-visible:ring-gray-400'
        ]"
        @click="modelValue = option.value"
        @keydown="handleKeydown($event, index)"
      >
        <!-- Left indicator bar when selected -->
        <div
          v-if="modelValue === option.value"
          class="absolute left-0 top-0 bottom-0 w-1"
          :class="styles.bg500"
          aria-hidden="true"
        />

        <div class="flex items-center gap-3 pl-2">
          <!-- Radio indicator -->
          <div
            class="w-4 h-4 border-2 flex items-center justify-center"
            :class="modelValue === option.value ? styles.border500 : 'border-gray-300'"
            aria-hidden="true"
          >
            <div
              v-if="modelValue === option.value"
              class="w-2 h-2"
              :class="styles.bg500"
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
          aria-hidden="true"
        >
          {{ option.multiplier }}
        </div>
      </button>
    </div>
  </div>
</template>
