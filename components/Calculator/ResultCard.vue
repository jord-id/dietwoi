<script setup lang="ts">
import type { CalculatorColor } from '~/types/calculator'

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

const gradients: Record<CalculatorColor, string> = {
  orange: 'from-orange-500 to-amber-500',
  purple: 'from-purple-500 to-violet-500',
  teal: 'from-teal-500 to-cyan-500',
  blue: 'from-blue-500 to-indigo-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-rose-500',
  amber: 'from-amber-500 to-yellow-500',
  pink: 'from-pink-500 to-rose-500',
  cyan: 'from-cyan-500 to-sky-500',
}

const borderColors: Record<CalculatorColor, string> = {
  orange: 'border-orange-300',
  purple: 'border-purple-300',
  teal: 'border-teal-300',
  blue: 'border-blue-300',
  green: 'border-green-300',
  red: 'border-red-300',
  amber: 'border-amber-300',
  pink: 'border-pink-300',
  cyan: 'border-cyan-300',
}

const sizeClasses: Record<string, { value: string; title: string }> = {
  sm: { value: 'text-xl sm:text-2xl', title: 'text-[10px] sm:text-xs' },
  md: { value: 'text-3xl sm:text-4xl', title: 'text-xs sm:text-sm' },
  lg: { value: 'text-4xl sm:text-5xl', title: 'text-sm sm:text-base' },
}

const gradient = computed(() => gradients[props.color] || gradients.orange)
const borderColor = computed(() => borderColors[props.color] || borderColors.orange)
const sizes = computed(() => sizeClasses[props.size])
</script>

<template>
  <div class="relative bg-white border-2 p-4" :class="borderColor">
    <!-- Top accent line -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="gradient" />

    <!-- Corner accents -->
    <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l" :class="borderColor" />
    <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r" :class="borderColor" />

    <p class="font-pixel tracking-wider text-gray-500 mb-2" :class="sizes.title">{{ title.toUpperCase() }}</p>
    <div class="flex items-baseline gap-2">
      <span
        class="font-game font-bold bg-gradient-to-r bg-clip-text text-transparent"
        :class="[gradient, sizes.value]"
      >
        {{ value }}
      </span>
      <span v-if="unit" class="font-game text-gray-400 text-sm sm:text-base">{{ unit }}</span>
    </div>
    <p v-if="subtitle" class="font-game text-gray-400 text-xs mt-2">{{ subtitle }}</p>
  </div>
</template>
