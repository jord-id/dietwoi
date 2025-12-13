<script setup lang="ts">
import type { CalculatorConfig } from '~/types/calculator'
import { colorGradients } from '~/types/calculator'

interface Props {
  config: CalculatorConfig
  inputsTitle?: string
  resultsTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  inputsTitle: 'Your Details',
  resultsTitle: 'Your Results',
})

// Define model for each input
const inputs = defineModel<Record<string, number | string>>('inputs', { required: true })

// SEO setup
useSeo({
  title: props.config.seo.title,
  description: props.config.seo.description,
  path: props.config.seo.path,
})

useCalculatorSchema({
  name: props.config.schema.name,
  description: props.config.schema.description,
  url: props.config.schema.url,
  applicationCategory: props.config.schema.applicationCategory,
})

useBreadcrumbSchema(props.config.breadcrumbs)

// Background gradient class
const bgGradient = computed(() => colorGradients[props.config.meta.color])
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br" :class="bgGradient">
    <div class="max-w-6xl mx-auto px-4 py-12 sm:py-20">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {{ config.meta.title }}
        </h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          {{ config.meta.shortDescription }}
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Input Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">{{ inputsTitle }}</h2>

          <div class="space-y-6">
            <template v-for="input in config.inputs" :key="input.key">
              <!-- Gender Selector -->
              <CalculatorGenderSelector
                v-if="input.type === 'gender'"
                v-model="inputs[input.key] as 'male' | 'female'"
                :color="config.meta.color"
              />

              <!-- Activity Level Selector -->
              <CalculatorActivitySelector
                v-else-if="input.type === 'activity'"
                v-model="inputs[input.key] as string"
                :color="config.meta.color"
              />

              <!-- Slider Input -->
              <CalculatorInputSlider
                v-else-if="input.type === 'slider'"
                v-model="inputs[input.key] as number"
                :min="input.min ?? 0"
                :max="input.max ?? 100"
                :step="input.step ?? 1"
                :label="input.label"
                :unit="input.unit ?? ''"
                :color="config.meta.color"
              />
            </template>

            <!-- Optional slot for extra inputs after standard inputs -->
            <slot name="extra-inputs" />
          </div>

          <!-- Optional slot for reference cards below inputs -->
          <slot name="reference" />
        </div>

        <!-- Result Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">{{ resultsTitle }}</h2>
          <slot name="results" />
        </div>
      </div>

      <!-- Info Section -->
      <div class="mt-12 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <slot name="info" />
      </div>
    </div>
  </div>
</template>
