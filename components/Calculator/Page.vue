<script setup lang="ts">
/**
 * CalculatorPage - Main wrapper component for all calculator pages.
 *
 * Provides a consistent layout with:
 * - SEO meta tags and JSON-LD structured data
 * - Retro-styled dark background with decorative elements
 * - Two-column grid: inputs (left) and results (right)
 * - Info section below the main grid
 * - Back navigation to calculator list
 *
 * @example
 * ```vue
 * <CalculatorPage v-model:inputs="inputs" :config="config">
 *   <template #results>...</template>
 *   <template #info>...</template>
 * </CalculatorPage>
 * ```
 */
import type { ActivityLevel } from "~/composables/useCalculations";
import type { CalculatorConfig } from "~/types/calculator";
import { colorAccents } from "~/types/calculator";

/**
 * @property config - Calculator configuration object with meta, SEO, schema, and input definitions
 * @property inputsTitle - Custom title for the inputs section (default: "INPUT")
 * @property resultsTitle - Custom title for the results section (default: "RESULTS")
 */
interface Props {
	config: CalculatorConfig;
	inputsTitle?: string;
	resultsTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
	inputsTitle: "INPUT",
	resultsTitle: "RESULTS",
});

// Define model for each input
const inputs = defineModel<Record<string, number | string>>("inputs", {
	required: true,
});

// SEO setup
useSeo({
	title: props.config.seo.title,
	description: props.config.seo.description,
	path: props.config.seo.path,
});

useCalculatorSchema({
	name: props.config.schema.name,
	description: props.config.schema.description,
	url: props.config.schema.url,
	applicationCategory: props.config.schema.applicationCategory,
});

useBreadcrumbSchema(props.config.breadcrumbs);

// Color accents for the current calculator
const accents = computed(() => colorAccents[props.config.meta.color]);
</script>

<template>
	<div class="min-h-screen bg-gray-900 relative overflow-hidden">
		<!-- Dark retro background with subtle patterns -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none">
			<!-- Scanline effect -->
			<div
				class="absolute inset-0 opacity-[0.03]"
				style="
					background: repeating-linear-gradient(
						0deg,
						transparent,
						transparent 2px,
						rgba(255, 255, 255, 0.1) 2px,
						rgba(255, 255, 255, 0.1) 4px
					);
				" />

			<!-- Large floating squares -->
			<div
				class="absolute top-20 left-10 w-32 h-32 border-2 opacity-[0.15] rotate-12"
				:class="accents.text.replace('text-', 'border-')" />
			<div
				class="absolute top-40 right-20 w-24 h-24 border-2 opacity-[0.1] -rotate-6"
				:class="accents.text.replace('text-', 'border-')" />
			<div
				class="absolute bottom-32 left-1/4 w-20 h-20 border-2 opacity-[0.08] rotate-45"
				:class="accents.text.replace('text-', 'border-')" />
			<div
				class="absolute bottom-20 right-1/3 w-16 h-16 opacity-[0.12]"
				:class="accents.text.replace('text-', 'bg-')" />

			<!-- Pixel dot pattern clusters -->
			<div class="absolute top-1/4 right-10 grid grid-cols-4 gap-3">
				<div
					v-for="i in 16"
					:key="'dot1-' + i"
					class="w-2 h-2 opacity-[0.15]"
					:class="accents.text.replace('text-', 'bg-')" />
			</div>
			<div class="absolute bottom-1/3 left-16 grid grid-cols-3 gap-2">
				<div
					v-for="i in 9"
					:key="'dot2-' + i"
					class="w-1.5 h-1.5 opacity-[0.12]"
					:class="accents.text.replace('text-', 'bg-')" />
			</div>

			<!-- Corner accents -->
			<div
				class="absolute top-0 left-0 w-32 h-32 border-b border-r opacity-20"
				:class="accents.text.replace('text-', 'border-')" />
			<div
				class="absolute top-0 right-0 w-32 h-32 border-b border-l opacity-20"
				:class="accents.text.replace('text-', 'border-')" />
			<div
				class="absolute bottom-0 left-0 w-32 h-32 border-t border-r opacity-20"
				:class="accents.text.replace('text-', 'border-')" />
			<div
				class="absolute bottom-0 right-0 w-32 h-32 border-t border-l opacity-20"
				:class="accents.text.replace('text-', 'border-')" />
		</div>

		<div class="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
			<!-- Header Section -->
			<div class="text-center mb-12">
				<!-- Badge -->
				<div
					class="inline-flex items-center gap-2 px-5 py-2.5 border-2 mb-6 bg-gray-800/50"
					:class="accents.text.replace('text-', 'border-')">
					<div
						class="w-2.5 h-2.5"
						:class="accents.text.replace('text-', 'bg-')" />
					<span class="font-pixel text-xs tracking-widest" :class="accents.text"
						>CALCULATOR</span
					>
				</div>

				<!-- Title -->
				<h1
					class="font-pixel text-2xl sm:text-4xl lg:text-5xl text-white mb-6 tracking-wide">
					{{ config.meta.title.toUpperCase() }}
				</h1>

				<!-- Description -->
				<p
					class="font-game text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
					{{ config.meta.shortDescription }}
				</p>
			</div>

			<!-- Main Content Grid -->
			<div class="grid lg:grid-cols-2 gap-6">
				<!-- Input Card -->
				<div class="bg-white border-2 border-gray-300 relative">
					<!-- Top accent bar -->
					<div class="h-2 bg-gradient-to-r" :class="accents.gradient" />

					<!-- Corner decorations -->
					<div
						class="absolute top-2 left-0 w-4 h-4 border-t-2 border-l-2"
						:class="accents.text.replace('text-', 'border-')" />
					<div
						class="absolute top-2 right-0 w-4 h-4 border-t-2 border-r-2"
						:class="accents.text.replace('text-', 'border-')" />
					<div
						class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-300" />
					<div
						class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-300" />

					<div class="p-6 sm:p-8 lg:p-10">
						<!-- Section header -->
						<div class="flex items-center gap-3 mb-8">
							<div
								class="w-3.5 h-3.5"
								:class="accents.text.replace('text-', 'bg-')" />
							<h2
								class="font-pixel text-sm sm:text-base tracking-wider text-gray-800">
								{{ inputsTitle }}
							</h2>
							<div class="flex-1 h-px bg-gray-200" />
						</div>

						<div class="space-y-8">
							<template v-for="input in config.inputs" :key="input.key">
								<!-- Gender Selector -->
								<CalculatorGenderSelector
									v-if="input.type === 'gender'"
									v-model="inputs[input.key] as 'male' | 'female'"
									:color="config.meta.color" />

								<!-- Activity Level Selector -->
								<CalculatorActivitySelector
									v-else-if="input.type === 'activity'"
									v-model="inputs[input.key] as ActivityLevel"
									:color="config.meta.color" />

								<!-- Slider Input -->
								<CalculatorInputSlider
									v-else-if="input.type === 'slider'"
									v-model="inputs[input.key] as number"
									:min="input.min ?? 0"
									:max="input.max ?? 100"
									:step="input.step ?? 1"
									:label="input.label"
									:unit="input.unit ?? ''"
									:color="config.meta.color" />
							</template>

							<!-- Optional slot for extra inputs -->
							<slot name="extra-inputs" />
						</div>

						<!-- Optional slot for reference cards -->
						<slot name="reference" />
					</div>
				</div>

				<!-- Result Card -->
				<div class="bg-white border-2 border-gray-300 relative">
					<!-- Top accent bar -->
					<div class="h-2 bg-gradient-to-r" :class="accents.gradient" />

					<!-- Corner decorations -->
					<div
						class="absolute top-2 left-0 w-4 h-4 border-t-2 border-l-2"
						:class="accents.text.replace('text-', 'border-')" />
					<div
						class="absolute top-2 right-0 w-4 h-4 border-t-2 border-r-2"
						:class="accents.text.replace('text-', 'border-')" />
					<div
						class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-300" />
					<div
						class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-300" />

					<div class="p-6 sm:p-8 lg:p-10">
						<!-- Section header -->
						<div class="flex items-center gap-3 mb-8">
							<div
								class="w-3.5 h-3.5"
								:class="accents.text.replace('text-', 'bg-')" />
							<h2
								class="font-pixel text-sm sm:text-base tracking-wider text-gray-800">
								{{ resultsTitle }}
							</h2>
							<div class="flex-1 h-px bg-gray-200" />
						</div>

						<slot name="results" />
					</div>
				</div>
			</div>

			<!-- Info Section -->
			<div class="mt-8 bg-white border-2 border-gray-300 relative">
				<!-- Top accent bar -->
				<div class="h-2 bg-gradient-to-r" :class="accents.gradient" />

				<!-- Corner decorations -->
				<div
					class="absolute top-2 left-0 w-4 h-4 border-t-2 border-l-2"
					:class="accents.text.replace('text-', 'border-')" />
				<div
					class="absolute top-2 right-0 w-4 h-4 border-t-2 border-r-2"
					:class="accents.text.replace('text-', 'border-')" />
				<div
					class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-300" />
				<div
					class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-300" />

				<div class="p-6 sm:p-8 lg:p-10">
					<!-- Section header -->
					<div class="flex items-center gap-3 mb-6">
						<div
							class="w-3.5 h-3.5"
							:class="accents.text.replace('text-', 'bg-')" />
						<h2
							class="font-pixel text-sm sm:text-base tracking-wider text-gray-800">
							INFO
						</h2>
						<div class="flex-1 h-px bg-gray-200" />
					</div>

					<div
						class="font-game text-base sm:text-lg text-gray-700 leading-relaxed">
						<slot name="info" />
					</div>
				</div>
			</div>

			<!-- Back navigation -->
			<div class="mt-10 text-center">
				<NuxtLink
					to="/#calculators"
					class="inline-flex items-center gap-3 px-6 py-3 border-2 border-gray-600 bg-gray-800 font-pixel text-xs text-gray-300 hover:border-gray-500 hover:text-white">
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path
							stroke-linecap="square"
							stroke-width="2"
							d="M15 19l-7-7 7-7" />
					</svg>
					<span>BACK TO CALCULATORS</span>
				</NuxtLink>
			</div>

			<!-- Footer decoration -->
			<div class="mt-12 flex justify-center">
				<div class="flex items-center gap-4">
					<div
						class="h-px w-16 bg-gradient-to-r from-transparent"
						:class="accents.text.replace('text-', 'to-')" />
					<div class="w-2 h-2" :class="accents.text.replace('text-', 'bg-')" />
					<div
						class="h-px w-16 bg-gradient-to-l from-transparent"
						:class="accents.text.replace('text-', 'to-')" />
				</div>
			</div>
		</div>
	</div>
</template>
