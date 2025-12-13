<script setup lang="ts">
interface Props {
  modelValue: 'male' | 'female'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'orange',
})

const emit = defineEmits<{
  'update:modelValue': [value: 'male' | 'female']
}>()

const colorClasses: Record<string, { active: string; hover: string }> = {
  orange: {
    active: 'bg-orange-500 text-white border-orange-500',
    hover: 'hover:border-orange-300',
  },
  purple: {
    active: 'bg-purple-500 text-white border-purple-500',
    hover: 'hover:border-purple-300',
  },
  teal: {
    active: 'bg-teal-500 text-white border-teal-500',
    hover: 'hover:border-teal-300',
  },
  blue: {
    active: 'bg-blue-500 text-white border-blue-500',
    hover: 'hover:border-blue-300',
  },
  amber: {
    active: 'bg-amber-500 text-white border-amber-500',
    hover: 'hover:border-amber-300',
  },
}

const colors = computed(() => colorClasses[props.color] || colorClasses.orange)
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium text-gray-700">Gender</label>
    <div class="grid grid-cols-2 gap-3">
      <button
        type="button"
        class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-150 font-medium"
        :class="[
          modelValue === 'male'
            ? colors.active
            : `border-gray-200 text-gray-600 ${colors.hover}`
        ]"
        @click="emit('update:modelValue', 'male')"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM10.5 22v-7h-2v-4.5a2.5 2.5 0 015 0V15h-2v7h-1z" />
        </svg>
        Male
      </button>
      <button
        type="button"
        class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-150 font-medium"
        :class="[
          modelValue === 'female'
            ? colors.active
            : `border-gray-200 text-gray-600 ${colors.hover}`
        ]"
        @click="emit('update:modelValue', 'female')"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a2 2 0 100 4 2 2 0 000-4zM10.5 22v-3H8v-2h2.5v-2h-2v-4.5a2.5 2.5 0 015 0V15h-2v2H14v2h-2.5v3h-1z" />
        </svg>
        Female
      </button>
    </div>
  </div>
</template>
