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
	<section class="py-24 bg-white relative overflow-hidden">
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

		<div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Header -->
			<div class="text-center mb-16">
				<span class="font-pixel text-xs text-gray-400 tracking-widest">
					// WHY_CHOOSE_US
				</span>
				<h2
					class="font-pixel text-2xl sm:text-3xl text-gray-800 mt-4 mb-5 tracking-wider">
					BUILT FOR
					<span class="text-emerald-500">PRECISION</span>
				</h2>
				<p class="font-retro text-base text-gray-600 max-w-xl mx-auto">
					Our calculators use scientifically validated formulas while keeping
					your data private.
				</p>
			</div>

			<!-- Features - Horizontal list -->
			<div class="space-y-4">
				<div
					v-for="(feature, index) in features"
					:key="feature.id"
					class="group flex items-center gap-6 p-5 bg-gray-50 border-l-4 hover:bg-gray-100 transition-all duration-200"
					:class="colorMap[feature.color].border">
					<!-- Number -->
					<div
						class="flex-shrink-0 w-12 h-12 flex items-center justify-center border-2 border-gray-200 bg-white">
						<span class="font-pixel text-lg text-gray-400"
							>0{{ index + 1 }}</span
						>
					</div>

					<!-- Icon -->
					<div
						class="flex-shrink-0 w-10 h-10 flex items-center justify-center"
						:class="colorMap[feature.color].bg">
						<svg
							v-if="feature.icon === 'check'"
							class="w-5 h-5 text-white"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							viewBox="0 0 24 24">
							<path stroke-linecap="square" d="M5 13l4 4L19 7" />
						</svg>
						<svg
							v-else-if="feature.icon === 'lock'"
							class="w-5 h-5 text-white"
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
							class="w-5 h-5 text-white"
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
							class="font-pixel text-sm tracking-wider mb-3"
							:class="colorMap[feature.color].text">
							{{ feature.title }}
						</h3>
						<p class="font-retro text-sm text-gray-600">
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
			<div class="mt-16 grid grid-cols-3 gap-6">
				<div class="p-5 bg-gray-50 border-t-2 border-orange-500">
					<div class="font-pixel text-2xl text-gray-800 mb-1">4+</div>
					<div class="font-retro text-xs text-gray-500">CALCULATORS</div>
				</div>
				<div class="p-5 bg-gray-50 border-t-2 border-emerald-500">
					<div class="font-pixel text-2xl text-gray-800 mb-1">100%</div>
					<div class="font-retro text-xs text-gray-500">CLIENT-SIDE</div>
				</div>
				<div class="p-5 bg-gray-50 border-t-2 border-blue-500">
					<div class="font-pixel text-2xl text-gray-800 mb-1">0</div>
					<div class="font-retro text-xs text-gray-500">DATA STORED</div>
				</div>
			</div>
		</div>
	</section>
</template>
