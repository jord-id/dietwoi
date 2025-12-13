<script setup lang="ts">
import { categories } from "~/config/calculators";

const activeCategory = ref(0);
const sectionRef = ref<HTMLElement | null>(null);
const tabsRef = ref<HTMLElement | null>(null);
const tabsSticky = ref(false);
const tabsExiting = ref(false);

// Inject navbar visibility from layout
const navVisible = inject<Ref<boolean>>("navVisible", ref(true));

// Make tabs sticky only when they would scroll behind navbar
const handleScroll = () => {
	if (!tabsRef.value || !sectionRef.value) return;
	const tabsRect = tabsRef.value.getBoundingClientRect();
	const sectionRect = sectionRef.value.getBoundingClientRect();

	// Tabs become sticky when they reach the top (accounting for navbar if visible)
	const navbarHeight = navVisible.value ? 64 : 0;
	const shouldBeSticky = tabsRect.top <= navbarHeight && sectionRect.bottom > 150;
	const isNearExit = sectionRect.bottom <= 200 && sectionRect.bottom > 100;

	tabsSticky.value = shouldBeSticky;
	tabsExiting.value = isNearExit;
};

onMounted(() => {
	window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll);
});

// Re-check tabs position when navbar visibility changes
watch(navVisible, () => {
	handleScroll();
});
</script>

<template>
	<section
		id="calculators"
		ref="sectionRef"
		class="min-h-screen py-16 sm:py-22 lg:py-28 bg-gray-50 relative overflow-x-clip overflow-y-visible flex flex-col">
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

		<!-- Header - Fixed at top -->
		<div class="relative w-full mx-auto px-4 sm:px-6 lg:px-12 flex-shrink-0">
			<div class="text-center mb-6 sm:mb-10">
				<div
					class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 border border-emerald-500/50 rounded mb-4 sm:mb-5 bg-white/50">
					<div class="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 animate-pulse" />
					<span
						class="font-pixel text-[10px] sm:text-xs text-emerald-600 tracking-wider"
						>CALCULATORS</span
					>
				</div>
				<h2
					class="font-pixel text-xl sm:text-3xl md:text-4xl text-gray-800 mb-3 sm:mb-5 tracking-wider">
					HEALTH
					<span
						class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600"
						>TOOLS</span
					>
				</h2>
				<p
					class="font-retro text-sm sm:text-base text-gray-600 max-w-lg mx-auto px-4 sm:px-0">
					Simple, accurate tools to understand your body metrics
				</p>
			</div>
		</div>

		<!-- Main Layout: Sidebar + Cards -->
		<div
			class="relative flex-1 w-full mx-auto px-4 sm:px-6 lg:px-12 pt-10 lg:pt-14">
			<div class="flex flex-col lg:flex-row gap-4 sm:gap-8 w-full items-start">
				<!-- Category Tabs -->
				<div class="w-full lg:w-48 flex-shrink-0 lg:sticky lg:top-24 relative">
					<!-- Mobile: Tabs wrapper with placeholder when sticky -->
					<div
						ref="tabsRef"
						class="lg:hidden"
						:class="tabsSticky ? 'h-12' : ''">
						<div
							class="transition-all duration-300 ease-out"
							:class="[
								tabsSticky
									? 'fixed left-0 right-0 z-40 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 px-4 py-2'
									: '',
								tabsSticky && navVisible
									? 'top-16'
									: tabsSticky
										? 'top-0'
										: '',
								tabsExiting
									? '-translate-y-full opacity-0'
									: 'translate-y-0 opacity-100',
							]">
							<div class="flex gap-2 overflow-x-auto scrollbar-hide">
								<button
									v-for="(cat, index) in categories"
									:key="cat.id"
									class="flex-shrink-0 px-3 py-2 font-pixel text-[10px] tracking-wider transition-all duration-200 whitespace-nowrap"
									:class="[
										activeCategory === index
											? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-400'
											: 'bg-white text-gray-500 border-2 border-gray-200',
									]"
									@click="activeCategory = index">
									<span>{{ cat.name }}</span>
									<span
										class="ml-1 font-retro text-[10px]"
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
					</div>
					<!-- Desktop: Vertical sidebar -->
					<div class="hidden lg:block space-y-2">
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
						class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4 min-h-[280px] sm:min-h-[340px] content-start">
						<template
							v-for="calc in categories[activeCategory].calculators"
							:key="calc.id">
							<!-- Active Calculator Card -->
							<NuxtLink
								v-if="!calc.comingSoon"
								:to="calc.path"
								class="group relative bg-white p-2.5 sm:p-4 border-2 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col min-h-[130px] sm:min-h-[160px]"
								:class="calc.borderColor">
								<!-- Corner accents -->
								<div
									class="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2"
									:class="calc.borderColor.replace('hover:', '')" />
								<div
									class="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2"
									:class="calc.borderColor.replace('hover:', '')" />
								<div
									class="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2"
									:class="calc.borderColor.replace('hover:', '')" />
								<div
									class="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2"
									:class="calc.borderColor.replace('hover:', '')" />

								<!-- Header -->
								<div class="flex items-start justify-between mb-1 sm:mb-2">
									<div>
										<h3
											:class="['font-pixel text-xs sm:text-base', calc.color]">
											{{ calc.name }}
										</h3>
										<p
											class="font-retro text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 tracking-wider line-clamp-1">
											{{ calc.fullName }}
										</p>
									</div>
									<div
										class="hidden sm:flex w-8 h-8 border border-gray-200 items-center justify-center group-hover:border-emerald-400 transition-colors">
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
								<div class="mt-1 sm:mt-3 flex-grow">
									<p
										class="font-retro text-[10px] sm:text-xs text-gray-700 leading-relaxed line-clamp-2 sm:line-clamp-none">
										{{ calc.description }}
									</p>
								</div>

								<!-- Bottom bar -->
								<div
									class="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-100 flex items-center justify-between">
									<span
										class="font-pixel text-[7px] sm:text-[9px] text-gray-400 tracking-wider hidden sm:inline"
										>> CALCULATOR</span
									>
									<div
										class="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 bg-emerald-50 border border-emerald-200">
										<div class="w-1 h-1 bg-emerald-500" />
										<span
											class="font-pixel text-[7px] sm:text-[9px] text-emerald-600"
											>READY</span
										>
									</div>
								</div>
							</NuxtLink>

							<!-- Coming Soon Card -->
							<div
								v-else
								class="relative bg-gray-50 p-2.5 sm:p-4 border-2 border-gray-200 opacity-70 flex flex-col min-h-[130px] sm:min-h-[160px]">
								<!-- Lock icon -->
								<div
									class="absolute top-2 right-2 sm:top-3 sm:right-3 px-1 sm:px-1.5 py-0.5 sm:py-1 bg-gray-100 border border-gray-200">
									<span
										class="font-pixel text-[7px] sm:text-[9px] text-gray-400"
										>LOCKED</span
									>
								</div>

								<div class="mb-1 sm:mb-2">
									<h3
										:class="[
											'font-pixel text-xs sm:text-base',
											calc.color,
											'opacity-70',
										]">
										{{ calc.name }}
									</h3>
									<p
										class="font-retro text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 tracking-wider line-clamp-1">
										{{ calc.fullName }}
									</p>
								</div>

								<div class="flex-grow">
									<p
										class="font-retro text-[10px] sm:text-sm text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-none">
										{{ calc.description }}
									</p>
								</div>

								<div
									class="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-200 flex items-center justify-between">
									<span
										class="font-pixel text-[7px] sm:text-[9px] text-gray-400 tracking-wider hidden sm:inline"
										>// CALCULATOR</span
									>
									<div
										class="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 bg-gray-100 border border-gray-200">
										<div class="w-1 h-1 bg-gray-400" />
										<span
											class="font-pixel text-[7px] sm:text-[9px] text-gray-400"
											>SOON</span
										>
									</div>
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom decoration - Fixed at bottom -->
		<div class="relative flex-shrink-0 pt-8 sm:pt-12">
			<div class="flex justify-center">
				<div class="flex items-center gap-3 sm:gap-5">
					<div
						class="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-emerald-500/50" />
					<div class="flex gap-1 sm:gap-1.5">
						<div
							v-for="(cat, index) in categories"
							:key="cat.id"
							class="w-2 h-2 sm:w-2.5 sm:h-2.5 transition-colors cursor-pointer"
							:class="
								activeCategory === index
									? 'bg-emerald-500'
									: 'bg-gray-300 hover:bg-gray-400'
							"
							@click="activeCategory = index" />
					</div>
					<div
						class="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-emerald-500/50" />
				</div>
			</div>
		</div>
	</section>
</template>
