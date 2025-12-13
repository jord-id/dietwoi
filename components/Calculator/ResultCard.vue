<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  unit?: string
  subtitle?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
  subtitle: '',
  color: 'orange',
  size: 'md',
})

const gradients: Record<string, string> = {
  orange: 'from-orange-500 to-amber-500',
  purple: 'from-purple-500 to-violet-500',
  teal: 'from-teal-500 to-cyan-500',
  blue: 'from-blue-500 to-indigo-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-rose-500',
  amber: 'from-amber-500 to-yellow-500',
  yellow: 'from-yellow-500 to-amber-400',
}

const sizeClasses: Record<string, { value: string; title: string }> = {
  sm: { value: 'text-2xl', title: 'text-xs' },
  md: { value: 'text-4xl', title: 'text-sm' },
  lg: { value: 'text-5xl', title: 'text-base' },
}

const gradient = computed(() => gradients[props.color] || gradients.orange)
const sizes = computed(() => sizeClasses[props.size])
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <p class="text-gray-500 mb-2" :class="sizes.title">{{ title }}</p>
    <div class="flex items-baseline gap-2">
      <span
        class="font-bold bg-gradient-to-r bg-clip-text text-transparent"
        :class="[gradient, sizes.value]"
      >
        {{ value }}
      </span>
      <span v-if="unit" class="text-gray-400 text-lg">{{ unit }}</span>
    </div>
    <p v-if="subtitle" class="text-gray-400 text-sm mt-2">{{ subtitle }}</p>
  </div>
</template>
