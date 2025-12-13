<script setup lang="ts">
interface Props {
  modelValue: number
  min: number
  max: number
  step?: number
  label: string
  unit: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  color: 'orange',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const colorClasses: Record<string, { bg: string; thumb: string; text: string }> = {
  orange: {
    bg: 'bg-orange-200',
    thumb: 'bg-orange-500',
    text: 'text-orange-600',
  },
  purple: {
    bg: 'bg-purple-200',
    thumb: 'bg-purple-500',
    text: 'text-purple-600',
  },
  teal: {
    bg: 'bg-teal-200',
    thumb: 'bg-teal-500',
    text: 'text-teal-600',
  },
  blue: {
    bg: 'bg-blue-200',
    thumb: 'bg-blue-500',
    text: 'text-blue-600',
  },
  amber: {
    bg: 'bg-amber-200',
    thumb: 'bg-amber-500',
    text: 'text-amber-600',
  },
}

const colors = computed(() => colorClasses[props.color] || colorClasses.orange)

const percentage = computed(() => {
  return ((props.modelValue - props.min) / (props.max - props.min)) * 100
})

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', parseFloat(target.value))
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700">{{ label }}</label>
      <div class="flex items-center gap-1">
        <input
          type="number"
          :value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          class="w-20 px-2 py-1 text-right text-sm font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          @input="handleInput"
        >
        <span class="text-sm text-gray-500">{{ unit }}</span>
      </div>
    </div>
    <div class="relative">
      <div class="h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-150"
          :class="colors.bg"
          :style="{ width: `${percentage}%` }"
        />
      </div>
      <input
        type="range"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        class="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        @input="handleInput"
      >
      <div
        class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-md transition-all duration-150 pointer-events-none"
        :class="colors.thumb"
        :style="{ left: `calc(${percentage}% - 10px)` }"
      />
    </div>
  </div>
</template>
