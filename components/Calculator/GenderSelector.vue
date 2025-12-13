<script setup lang="ts">
import type { CalculatorColor } from '~/types/calculator'

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

// All color classes
const colorClasses: Record<CalculatorColor, { active: string; activeBg: string; border: string }> = {
  orange: { active: 'border-orange-500', activeBg: 'bg-orange-500', border: 'border-orange-300' },
  purple: { active: 'border-purple-500', activeBg: 'bg-purple-500', border: 'border-purple-300' },
  teal: { active: 'border-teal-500', activeBg: 'bg-teal-500', border: 'border-teal-300' },
  blue: { active: 'border-blue-500', activeBg: 'bg-blue-500', border: 'border-blue-300' },
  amber: { active: 'border-amber-500', activeBg: 'bg-amber-500', border: 'border-amber-300' },
  pink: { active: 'border-pink-500', activeBg: 'bg-pink-500', border: 'border-pink-300' },
  red: { active: 'border-red-500', activeBg: 'bg-red-500', border: 'border-red-300' },
  green: { active: 'border-green-500', activeBg: 'bg-green-500', border: 'border-green-300' },
  cyan: { active: 'border-cyan-500', activeBg: 'bg-cyan-500', border: 'border-cyan-300' },
}

const colors = computed(() => colorClasses[props.color] || colorClasses.orange)
</script>

<template>
  <div class="space-y-4">
    <label class="font-pixel text-xs sm:text-sm text-gray-700 tracking-wide">GENDER</label>
    <div class="grid grid-cols-2 gap-4">
      <!-- Male button -->
      <button
        type="button"
        class="relative p-4 border-2 bg-white group"
        :class="modelValue === 'male' ? colors.active : 'border-gray-200 hover:border-gray-300'"
        @click="emit('update:modelValue', 'male')"
      >
        <!-- Selection indicator -->
        <div
          v-if="modelValue === 'male'"
          class="absolute top-0 left-0 w-full h-1"
          :class="colors.activeBg"
        />

        <div class="flex flex-col items-center gap-2">
          <svg class="w-8 h-8" :class="modelValue === 'male' ? 'text-gray-800' : 'text-gray-400'" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM10.5 22v-7h-2v-4.5a2.5 2.5 0 015 0V15h-2v7h-1z" />
          </svg>
          <span class="font-pixel text-xs sm:text-sm" :class="modelValue === 'male' ? 'text-gray-800' : 'text-gray-500'">MALE</span>
        </div>

        <!-- Corner accents when selected -->
        <template v-if="modelValue === 'male'">
          <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" :class="colors.border" />
          <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" :class="colors.border" />
        </template>
      </button>

      <!-- Female button -->
      <button
        type="button"
        class="relative p-4 border-2 bg-white group"
        :class="modelValue === 'female' ? colors.active : 'border-gray-200 hover:border-gray-300'"
        @click="emit('update:modelValue', 'female')"
      >
        <!-- Selection indicator -->
        <div
          v-if="modelValue === 'female'"
          class="absolute top-0 left-0 w-full h-1"
          :class="colors.activeBg"
        />

        <div class="flex flex-col items-center gap-2">
          <svg class="w-8 h-8" :class="modelValue === 'female' ? 'text-gray-800' : 'text-gray-400'" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM10.5 22v-3H8v-2h2.5v-2h-2v-4.5a2.5 2.5 0 015 0V15h-2v2H14v2h-2.5v3h-1z" />
          </svg>
          <span class="font-pixel text-xs sm:text-sm" :class="modelValue === 'female' ? 'text-gray-800' : 'text-gray-500'">FEMALE</span>
        </div>

        <!-- Corner accents when selected -->
        <template v-if="modelValue === 'female'">
          <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" :class="colors.border" />
          <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" :class="colors.border" />
        </template>
      </button>
    </div>
  </div>
</template>
