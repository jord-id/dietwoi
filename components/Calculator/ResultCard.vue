<script setup lang="ts">
/**
 * ResultCard - Display card for calculator results with gradient styling.
 *
 * Features:
 * - Gradient accent bar at top matching calculator theme
 * - Gradient text for the main value
 * - Optional unit suffix and subtitle
 * - Three size variants (sm, md, lg)
 * - Decorative corner accents
 *
 * @example
 * ```vue
 * <ResultCard
 *   title="Your BMI"
 *   :value="24.5"
 *   unit="kg/m²"
 *   subtitle="Normal weight"
 *   color="teal"
 *   size="lg"
 * />
 * ```
 */
import { type CalculatorColor, getColorStyles } from '~/types/calculator'

/**
 * @property title - Label displayed above the value
 * @property value - Main result value (string or number)
 * @property unit - Optional unit suffix (e.g., "kg/m²", "kcal")
 * @property subtitle - Optional description below the value
 * @property color - Theme color from CalculatorColor palette (default: "orange")
 * @property size - Text size variant: "sm" | "md" | "lg" (default: "md")
 */
interface Props {
  title: string
  value: string | number
  unit?: string
  subtitle?: string
  color?: CalculatorColor
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
  subtitle: '',
  color: 'orange',
  size: 'md',
})

const sizeClasses: Record<string, { value: string; title: string }> = {
  sm: { value: 'text-xl sm:text-2xl', title: 'text-[10px] sm:text-xs' },
  md: { value: 'text-3xl sm:text-4xl', title: 'text-xs sm:text-sm' },
  lg: { value: 'text-4xl sm:text-5xl', title: 'text-sm sm:text-base' },
}

// Get colors from centralized config
const styles = computed(() => getColorStyles(props.color))
const sizes = computed(() => sizeClasses[props.size])
</script>

<template>
  <div class="relative bg-white border-2 p-4" :class="styles.border300">
    <!-- Top accent line -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="styles.gradient" />

    <!-- Corner accents -->
    <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l" :class="styles.border300" />
    <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r" :class="styles.border300" />

    <p class="font-pixel tracking-wider text-gray-500 mb-2" :class="sizes.title">{{ title.toUpperCase() }}</p>
    <div class="flex items-baseline gap-2">
      <span
        class="font-game font-bold bg-gradient-to-r bg-clip-text text-transparent"
        :class="[styles.gradient, sizes.value]"
      >
        {{ value }}
      </span>
      <span v-if="unit" class="font-game text-gray-400 text-sm sm:text-base">{{ unit }}</span>
    </div>
    <p v-if="subtitle" class="font-game text-gray-400 text-xs mt-2">{{ subtitle }}</p>
  </div>
</template>
