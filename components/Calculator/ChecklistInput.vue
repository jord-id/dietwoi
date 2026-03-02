<script setup lang="ts">
/**
 * ChecklistInput - Vertical checklist for survey-style inputs.
 *
 * Features:
 * - Multiple questions each with selectable answer options
 * - Button group per question (like radio buttons)
 * - Full keyboard navigation per question group
 * - ARIA radiogroup per question
 * - Designed for health risk questionnaires (e.g., FINDRISC)
 *
 * @example
 * ```vue
 * <ChecklistInput
 *   v-model="answers"
 *   :items="[{
 *     key: 'fruit',
 *     label: 'Do you eat fruit daily?',
 *     options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }]
 *   }]"
 *   color="red"
 * />
 * ```
 */
import { type CalculatorColor, getColorStyles } from '~/types/calculator'

interface ChecklistOption {
  value: string
  label: string
  points?: number
}

interface ChecklistItem {
  key: string
  label: string
  description?: string
  options: ChecklistOption[]
}

/**
 * @property modelValue - Record of selected values keyed by item key (v-model)
 * @property items - Array of checklist items with their options
 * @property color - Theme color from CalculatorColor palette (default: "orange")
 */
interface Props {
  modelValue: Record<string, string>
  items: ChecklistItem[]
  color?: CalculatorColor
}

const props = withDefaults(defineProps<Props>(), {
  color: 'orange',
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string>]
}>()

// Get colors from centralized config
const styles = computed(() => getColorStyles(props.color))

// Refs for focus management per item
const optionRefs = ref<Record<string, (HTMLButtonElement | null)[]>>({})

const setOptionRef = (itemKey: string, index: number, el: HTMLButtonElement | null) => {
  if (!optionRefs.value[itemKey]) {
    optionRefs.value[itemKey] = []
  }
  optionRefs.value[itemKey][index] = el
}

// Select an option for a given item
const selectOption = (itemKey: string, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [itemKey]: value })
}

// Keyboard navigation within a single item's options
const handleKeydown = (e: KeyboardEvent, item: ChecklistItem, optionIndex: number) => {
  let newIndex = optionIndex

  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault()
      newIndex = optionIndex > 0 ? optionIndex - 1 : item.options.length - 1
      break
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault()
      newIndex = optionIndex < item.options.length - 1 ? optionIndex + 1 : 0
      break
    case 'Home':
      e.preventDefault()
      newIndex = 0
      break
    case 'End':
      e.preventDefault()
      newIndex = item.options.length - 1
      break
    case ' ':
    case 'Enter':
      e.preventDefault()
      selectOption(item.key, item.options[optionIndex].value)
      return
    default:
      return
  }

  selectOption(item.key, item.options[newIndex].value)
  optionRefs.value[item.key]?.[newIndex]?.focus()
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="item in items" :key="item.key" class="space-y-3">
      <!-- Question label -->
      <div>
        <span :id="`checklist-${item.key}`" class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide">
          {{ item.label }}
        </span>
        <p v-if="item.description" class="font-game text-sm text-gray-500 mt-1">
          {{ item.description }}
        </p>
      </div>

      <!-- Answer options as radio group -->
      <div
        role="radiogroup"
        :aria-labelledby="`checklist-${item.key}`"
        class="space-y-2"
      >
        <button
          v-for="(option, optionIndex) in item.options"
          :ref="(el) => setOptionRef(item.key, optionIndex, el as HTMLButtonElement)"
          :key="option.value"
          type="button"
          role="radio"
          :aria-checked="modelValue[item.key] === option.value"
          :tabindex="modelValue[item.key] === option.value ? 0 : (modelValue[item.key] === undefined && optionIndex === 0 ? 0 : -1)"
          class="relative w-full p-3 border-2 bg-white text-left flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          :class="[
            modelValue[item.key] === option.value ? styles.border500 : 'border-gray-200 hover:border-gray-300',
            modelValue[item.key] === option.value ? 'focus-visible:ring-current' : 'focus-visible:ring-gray-400'
          ]"
          @click="selectOption(item.key, option.value)"
          @keydown="handleKeydown($event, item, optionIndex)"
        >
          <!-- Left indicator bar when selected -->
          <div
            v-if="modelValue[item.key] === option.value"
            class="absolute left-0 top-0 bottom-0 w-1"
            :class="styles.bg500"
            aria-hidden="true"
          />

          <!-- Radio indicator -->
          <div
            class="w-4 h-4 border-2 flex items-center justify-center flex-shrink-0"
            :class="modelValue[item.key] === option.value ? styles.border500 : 'border-gray-300'"
            aria-hidden="true"
          >
            <div
              v-if="modelValue[item.key] === option.value"
              class="w-2 h-2"
              :class="styles.bg500"
            />
          </div>

          <span
            class="font-game text-sm sm:text-base"
            :class="modelValue[item.key] === option.value ? 'text-gray-800' : 'text-gray-500'"
          >
            {{ option.label }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
