<script setup lang="ts">
interface Calculator {
	id: string;
	name: string;
	fullName: string;
	path: string;
	color: string;
	borderColor: string;
	description: string;
	comingSoon?: boolean;
}

interface Category {
	id: string;
	name: string;
	calculators: Calculator[];
}

const activeCategory = ref(0);

const categories: Category[] = [
	{
		id: "body",
		name: "BODY",
		calculators: [
			{
				id: "bmi",
				name: "BMI",
				fullName: "Body Mass Index",
				path: "/bmi",
				color: "text-violet-600",
				borderColor: "border-violet-300 hover:border-violet-500",
				description: "Assess if you're at a healthy weight for your height",
			},
			{
				id: "body-fat",
				name: "BF%",
				fullName: "Body Fat Percentage",
				path: "/body-fat",
				color: "text-emerald-600",
				borderColor: "border-emerald-300 hover:border-emerald-500",
				description: "Estimate your body fat percentage",
			},
			{
				id: "ideal-weight",
				name: "IDEAL",
				fullName: "Ideal Body Weight",
				path: "/ideal-weight",
				color: "text-amber-600",
				borderColor: "border-amber-300 hover:border-amber-500",
				description: "Find your ideal weight range",
			},
			{
				id: "lean-body-mass",
				name: "LBM",
				fullName: "Lean Body Mass",
				path: "/lean-body-mass",
				color: "text-green-600",
				borderColor: "border-green-300 hover:border-green-500",
				description: "Calculate your lean muscle mass",
			},
		],
	},
	{
		id: "energy",
		name: "ENERGY",
		calculators: [
			{
				id: "bmr",
				name: "BMR",
				fullName: "Basal Metabolic Rate",
				path: "/bmr",
				color: "text-orange-600",
				borderColor: "border-orange-300 hover:border-orange-500",
				description: "Calculate calories burned at rest",
			},
			{
				id: "tdee",
				name: "TDEE",
				fullName: "Total Daily Energy",
				path: "/tdee",
				color: "text-sky-600",
				borderColor: "border-sky-300 hover:border-sky-500",
				description: "Total calories burned daily",
			},
			{
				id: "calories",
				name: "CAL",
				fullName: "Calorie Calculator",
				path: "/calories",
				color: "text-amber-600",
				borderColor: "border-amber-300 hover:border-amber-500",
				description: "Daily calorie needs for your goals",
			},
			{
				id: "macros",
				name: "MACRO",
				fullName: "Macro Calculator",
				path: "/macros",
				color: "text-pink-600",
				borderColor: "border-pink-300 hover:border-pink-500",
				description: "Protein, carbs & fat split",
			},
		],
	},
	{
		id: "wellness",
		name: "WELLNESS",
		calculators: [
			{
				id: "water-intake",
				name: "H2O",
				fullName: "Water Intake",
				path: "/water-intake",
				color: "text-cyan-600",
				borderColor: "border-cyan-300 hover:border-cyan-500",
				description: "Daily hydration needs",
			},
		],
	},
	{
		id: "strength",
		name: "STRENGTH",
		calculators: [
			{
				id: "one-rep-max",
				name: "1RM",
				fullName: "One Rep Max",
				path: "/one-rep-max",
				color: "text-red-600",
				borderColor: "border-red-300 hover:border-red-500",
				description: "Calculate your maximum lift",
			},
		],
	},
	{
		id: "coming-soon",
		name: "SOON",
		calculators: [
			{
				id: "protein",
				name: "PROT",
				fullName: "Protein Calculator",
				path: "/protein",
				color: "text-blue-500",
				borderColor: "border-blue-200",
				description: "Calculate optimal protein intake",
				comingSoon: true,
			},
		],
	},
];
</script>

<template>
	<section
		id="calculators"
		class="min-h-screen py-20 bg-gray-50 relative overflow-hidden flex flex-col justify-center">
		<!-- Grid background -->
		<div class="absolute inset-0 opacity-[0.4]">
			<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern
						id="calc-grid"
						width="32"
						height="32"
						patternUnits="userSpaceOnUse">
						<path
							d="M 32 0 L 0 0 0 32"
							fill="none"
							stroke="#d1d5db"
							stroke-width="0.5" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#calc-grid)" />
			</svg>
		</div>

		<div class="relative w-full mx-auto px-4 sm:px-6 lg:px-12">
			<!-- Header -->
			<div class="text-center mb-14">
				<div
					class="inline-flex items-center gap-2 px-4 py-1.5 border border-emerald-500/50 rounded mb-5 bg-white/50">
					<div class="w-2.5 h-2.5 bg-emerald-500 animate-pulse" />
					<span class="font-pixel text-xs text-emerald-600 tracking-wider"
						>CALCULATORS</span
					>
				</div>
				<h2
					class="font-pixel text-3xl sm:text-4xl text-gray-800 mb-5 tracking-wider">
					HEALTH
					<span
						class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600"
						>TOOLS</span
					>
				</h2>
				<p class="font-retro text-base text-gray-600 max-w-lg mx-auto">
					Simple, accurate tools to understand your body metrics
				</p>
			</div>

			<!-- Main Layout: Sidebar + Cards -->
			<div class="flex flex-col lg:flex-row gap-8">
				<!-- Sidebar Tabs -->
				<div class="lg:w-48 flex-shrink-0">
					<div class="lg:sticky lg:top-24 space-y-2">
						<button
							v-for="(cat, index) in categories"
							:key="cat.id"
							class="w-full text-left px-4 py-3 font-pixel text-xs tracking-wider transition-all duration-200"
							:class="[
								activeCategory === index
									? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-400'
									: 'bg-white text-gray-500 border-2 border-gray-200 hover:border-gray-300 hover:text-gray-700',
							]"
							@click="activeCategory = index">
							<span>{{ cat.name }}</span>
							<span
								class="ml-2 font-retro text-xs"
								:class="
									activeCategory === index
										? 'text-emerald-500'
										: 'text-gray-400'
								">
								({{ cat.calculators.length }})
							</span>
						</button>
					</div>
				</div>

				<!-- Calculator Cards Grid -->
				<div class="flex-1">
					<div
						class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
						<template
							v-for="calc in categories[activeCategory].calculators"
							:key="calc.id">
							<!-- Active Calculator Card -->
							<NuxtLink
								v-if="!calc.comingSoon"
								:to="calc.path"
								class="group relative bg-white p-4 border-2 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col min-h-[160px]"
								:class="calc.borderColor">
								<!-- Corner accents -->
								<div
									class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
									:class="calc.borderColor.replace('hover:', '')" />
								<div
									class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
									:class="calc.borderColor.replace('hover:', '')" />
								<div
									class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
									:class="calc.borderColor.replace('hover:', '')" />
								<div
									class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
									:class="calc.borderColor.replace('hover:', '')" />

								<!-- Header -->
								<div class="flex items-start justify-between mb-2">
									<div>
										<h3 :class="['font-pixel text-base', calc.color]">
											{{ calc.name }}
										</h3>
										<p
											class="font-retro text-xs text-gray-600 mt-1 tracking-wider">
											{{ calc.fullName }}
										</p>
									</div>
									<div
										class="w-8 h-8 border border-gray-200 flex items-center justify-center group-hover:border-emerald-400 transition-colors">
										<svg
											class="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												stroke-linecap="square"
												stroke-width="2"
												d="M9 5l7 7-7 7" />
										</svg>
									</div>
								</div>

								<!-- Description -->
								<div class="mt-3 flex-grow">
									<p class="font-game text-sm text-gray-700 leading-relaxed">
										{{ calc.description }}
									</p>
								</div>

								<!-- Bottom bar -->
								<div
									class="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
									<span
										class="font-pixel text-[9px] text-gray-400 tracking-wider"
										>> CALCULATOR</span
									>
									<div
										class="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 border border-emerald-200">
										<div class="w-1 h-1 bg-emerald-500" />
										<span class="font-pixel text-[9px] text-emerald-600"
											>READY</span
										>
									</div>
								</div>
							</NuxtLink>

							<!-- Coming Soon Card -->
							<div
								v-else
								class="relative bg-gray-50 p-4 border-2 border-gray-200 opacity-70 flex flex-col min-h-[160px]">
								<!-- Lock icon -->
								<div
									class="absolute top-3 right-3 px-1.5 py-1 bg-gray-100 border border-gray-200">
									<span class="font-pixel text-[9px] text-gray-400"
										>LOCKED</span
									>
								</div>

								<div class="mb-2">
									<h3
										:class="['font-pixel text-base', calc.color, 'opacity-70']">
										{{ calc.name }}
									</h3>
									<p
										class="font-retro text-xs text-gray-500 mt-1 tracking-wider">
										{{ calc.fullName }}
									</p>
								</div>

								<div class="flex-grow">
									<p class="font-game text-sm text-gray-500 leading-relaxed">
										{{ calc.description }}
									</p>
								</div>

								<div
									class="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between">
									<span
										class="font-pixel text-[9px] text-gray-400 tracking-wider"
										>// CALCULATOR</span
									>
									<div
										class="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 border border-gray-200">
										<div class="w-1 h-1 bg-gray-400" />
										<span class="font-pixel text-[9px] text-gray-400"
											>SOON</span
										>
									</div>
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>

			<!-- Bottom decoration -->
			<div class="mt-28 flex justify-center">
				<div class="flex items-center gap-5">
					<div
						class="h-px w-20 bg-gradient-to-r from-transparent to-emerald-500/50" />
					<div class="flex gap-1.5">
						<div
							v-for="(cat, index) in categories"
							:key="cat.id"
							class="w-2.5 h-2.5 transition-colors cursor-pointer"
							:class="
								activeCategory === index
									? 'bg-emerald-500'
									: 'bg-gray-300 hover:bg-gray-400'
							"
							@click="activeCategory = index" />
					</div>
					<div
						class="h-px w-20 bg-gradient-to-l from-transparent to-emerald-500/50" />
				</div>
			</div>
		</div>
	</section>
</template>
