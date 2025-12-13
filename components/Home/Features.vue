<script setup lang="ts">
interface Feature {
	id: string;
	title: string;
	description: string;
	icon: string;
	color: string;
}

const features: Feature[] = [
	{
		id: "accurate",
		title: "SCIENTIFICALLY ACCURATE",
		description:
			"Using validated formulas like Mifflin-St Jeor and Deurenberg equations for precise results.",
		icon: "check",
		color: "orange",
	},
	{
		id: "private",
		title: "100% PRIVATE",
		description:
			"All calculations happen locally in your browser. We never store or transmit your data.",
		icon: "lock",
		color: "emerald",
	},
	{
		id: "instant",
		title: "INSTANT RESULTS",
		description:
			"See your results update in real-time as you adjust the input values.",
		icon: "bolt",
		color: "blue",
	},
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
	orange: {
		bg: "bg-orange-500",
		text: "text-orange-500",
		border: "border-orange-500",
	},
	emerald: {
		bg: "bg-emerald-500",
		text: "text-emerald-500",
		border: "border-emerald-500",
	},
	blue: { bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
};
</script>

<template>
	<section class="py-12 sm:py-16 lg:py-24 bg-white relative overflow-hidden">
		<!-- Diagonal lines background -->
		<div class="absolute inset-0 opacity-[0.03]">
			<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern
						id="diagonals"
						width="16"
						height="16"
						patternUnits="userSpaceOnUse"
						patternTransform="rotate(45)">
						<line x1="0" y1="0" x2="0" y2="16" stroke="#000" stroke-width="1" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#diagonals)" />
			</svg>
		</div>

		<!-- Header -->
		<div class="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
			<div class="text-center mb-8 sm:mb-12 lg:mb-16">
				<div
					class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 border border-orange-500/50 rounded mb-4 sm:mb-5 bg-gray-50">
					<div class="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-orange-500 animate-pulse" />
					<span
						class="font-pixel text-[10px] sm:text-xs text-orange-600 tracking-wider"
						>WHY_CHOOSE_US</span
					>
				</div>
				<h2
					class="font-pixel text-xl sm:text-3xl md:text-4xl text-gray-800 mb-3 sm:mb-5 tracking-wider">
					BUILT FOR
					<span
						class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-emerald-500"
						>PRECISION</span
					>
				</h2>
				<p
					class="font-retro text-sm sm:text-base text-gray-600 max-w-lg mx-auto px-4 sm:px-0">
					Our calculators use scientifically validated formulas while keeping
					your data private.
				</p>
			</div>
		</div>

		<!-- Main Layout -->
		<div class="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
			<!-- Features - Horizontal list -->
			<div class="space-y-3 sm:space-y-5">
				<div
					v-for="(feature, index) in features"
					:key="feature.id"
					class="group flex items-center gap-3 sm:gap-6 p-3 sm:p-5 bg-gray-50 border-l-4 hover:bg-gray-100 transition-all duration-200"
					:class="colorMap[feature.color].border">
					<!-- Number -->
					<div
						class="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center border-2 border-gray-200 bg-white">
						<span class="font-pixel text-xs sm:text-lg text-gray-400"
							>0{{ index + 1 }}</span
						>
					</div>

					<!-- Icon -->
					<div
						class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
						:class="colorMap[feature.color].bg">
						<svg
							v-if="feature.icon === 'check'"
							class="w-4 h-4 sm:w-5 sm:h-5 text-white"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							viewBox="0 0 24 24">
							<path stroke-linecap="square" d="M5 13l4 4L19 7" />
						</svg>
						<svg
							v-else-if="feature.icon === 'lock'"
							class="w-4 h-4 sm:w-5 sm:h-5 text-white"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="square"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
						<svg
							v-else
							class="w-4 h-4 sm:w-5 sm:h-5 text-white"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							viewBox="0 0 24 24">
							<path stroke-linecap="square" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>

					<!-- Content -->
					<div class="flex-1 min-w-0">
						<h3
							class="font-pixel text-[10px] sm:text-sm tracking-wider mb-1 sm:mb-3"
							:class="colorMap[feature.color].text">
							{{ feature.title }}
						</h3>
						<p
							class="font-retro text-[10px] sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-none">
							{{ feature.description }}
						</p>
					</div>

					<!-- Status -->
					<div class="flex-shrink-0 hidden sm:flex items-center gap-2">
						<div class="w-2 h-2" :class="colorMap[feature.color].bg" />
						<span class="font-pixel text-[10px] text-gray-400">ACTIVE</span>
					</div>
				</div>
			</div>

			<!-- Stats -->
			<div class="mt-10 sm:mt-14 lg:mt-16 grid grid-cols-3 gap-2 sm:gap-6">
				<div class="p-3 sm:p-5 bg-gray-50 border-t-2 border-orange-500">
					<div
						class="font-pixel text-lg sm:text-2xl text-gray-800 mb-0.5 sm:mb-1">
						10+
					</div>
					<div class="font-retro text-[9px] sm:text-xs text-gray-500">
						CALCULATORS
					</div>
				</div>
				<div class="p-3 sm:p-5 bg-gray-50 border-t-2 border-emerald-500">
					<div
						class="font-pixel text-lg sm:text-2xl text-gray-800 mb-0.5 sm:mb-1">
						100%
					</div>
					<div class="font-retro text-[9px] sm:text-xs text-gray-500">
						CLIENT-SIDE
					</div>
				</div>
				<div class="p-3 sm:p-5 bg-gray-50 border-t-2 border-blue-500">
					<div
						class="font-pixel text-lg sm:text-2xl text-gray-800 mb-0.5 sm:mb-1">
						0
					</div>
					<div class="font-retro text-[9px] sm:text-xs text-gray-500">
						DATA STORED
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
