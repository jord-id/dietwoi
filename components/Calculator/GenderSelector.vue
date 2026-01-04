<script setup lang="ts">
/**
 * GenderSelector - Accessible radio button group for gender selection.
 *
 * Features:
 * - Two-option button group (male/female)
 * - Full keyboard navigation (arrow keys, Enter, Space)
 * - ARIA radiogroup with proper checked states
 * - Visual selection indicator with accent color
 * - Icon + text labels for each option
 *
 * @example
 * ```vue
 * <GenderSelector v-model="gender" color="teal" />
 * ```
 */
import { type CalculatorColor, getColorStyles } from '~/types/calculator'

/**
 * @property modelValue - Selected gender value (v-model): "male" | "female"
 * @property color - Theme color from CalculatorColor palette (default: "orange")
 */
interface Props {
  modelValue: 'male' | 'female'
  color?: CalculatorColor
}

const props = withDefaults(defineProps<Props>(), {
  color: 'orange',
})

const emit = defineEmits<{
  'update:modelValue': [value: 'male' | 'female']
}>()

// Get colors from centralized config
const styles = computed(() => getColorStyles(props.color))

// Generate unique ID for accessibility
const groupId = useId()

// Refs for focus management
const maleRef = ref<HTMLButtonElement | null>(null)
const femaleRef = ref<HTMLButtonElement | null>(null)

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent, current: 'male' | 'female') => {
  const other = current === 'male' ? 'female' : 'male'
  const otherRef = current === 'male' ? femaleRef : maleRef

  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      emit('update:modelValue', other)
      otherRef.value?.focus()
      break
    case ' ':
    case 'Enter':
      e.preventDefault()
      emit('update:modelValue', current)
      break
  }
}
</script>

<template>
  <div class="space-y-4">
    <span :id="groupId" class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide">GENDER</span>
    <div
      role="radiogroup"
      :aria-labelledby="groupId"
      class="grid grid-cols-2 gap-4"
    >
      <!-- Male button -->
      <button
        ref="maleRef"
        type="button"
        role="radio"
        :aria-checked="modelValue === 'male'"
        :tabindex="modelValue === 'male' ? 0 : -1"
        class="relative p-4 border-2 bg-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        :class="[
          modelValue === 'male' ? styles.border500 : 'border-gray-200 hover:border-gray-300',
          modelValue === 'male' ? 'focus-visible:ring-current' : 'focus-visible:ring-gray-400'
        ]"
        @click="emit('update:modelValue', 'male')"
        @keydown="handleKeydown($event, 'male')"
      >
        <!-- Selection indicator -->
        <div
          v-if="modelValue === 'male'"
          class="absolute top-0 left-0 w-full h-1"
          :class="styles.bg500"
          aria-hidden="true"
        />

        <div class="flex flex-col items-center gap-2">
          <svg class="w-8 h-8" :class="modelValue === 'male' ? 'text-gray-800' : 'text-gray-400'" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM10.5 22v-7h-2v-4.5a2.5 2.5 0 015 0V15h-2v7h-1z" />
          </svg>
          <span class="font-pixel text-xs sm:text-sm" :class="modelValue === 'male' ? 'text-gray-800' : 'text-gray-500'">MALE</span>
        </div>

        <!-- Corner accents when selected -->
        <template v-if="modelValue === 'male'">
          <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" :class="styles.border300" aria-hidden="true" />
          <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" :class="styles.border300" aria-hidden="true" />
        </template>
      </button>

      <!-- Female button -->
      <button
        ref="femaleRef"
        type="button"
        role="radio"
        :aria-checked="modelValue === 'female'"
        :tabindex="modelValue === 'female' ? 0 : -1"
        class="relative p-4 border-2 bg-white group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        :class="[
          modelValue === 'female' ? styles.border500 : 'border-gray-200 hover:border-gray-300',
          modelValue === 'female' ? 'focus-visible:ring-current' : 'focus-visible:ring-gray-400'
        ]"
        @click="emit('update:modelValue', 'female')"
        @keydown="handleKeydown($event, 'female')"
      >
        <!-- Selection indicator -->
        <div
          v-if="modelValue === 'female'"
          class="absolute top-0 left-0 w-full h-1"
          :class="styles.bg500"
          aria-hidden="true"
        />

        <div class="flex flex-col items-center gap-2">
          <svg class="w-8 h-8" :class="modelValue === 'female' ? 'text-gray-800' : 'text-gray-400'" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM10.5 22v-3H8v-2h2.5v-2h-2v-4.5a2.5 2.5 0 015 0V15h-2v2H14v2h-2.5v3h-1z" />
          </svg>
          <span class="font-pixel text-xs sm:text-sm" :class="modelValue === 'female' ? 'text-gray-800' : 'text-gray-500'">FEMALE</span>
        </div>

        <!-- Corner accents when selected -->
        <template v-if="modelValue === 'female'">
          <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" :class="styles.border300" aria-hidden="true" />
          <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" :class="styles.border300" aria-hidden="true" />
        </template>
      </button>
    </div>
  </div>
</template>
