<script setup lang="ts">
import { footerNav, headerNav } from "~/config/navigation";

const route = useRoute();
const mobileMenuOpen = ref(false);
const scrolled = ref(false);
const navVisible = ref(false);

// Handle scroll behavior
const handleScroll = () => {
	if (typeof window === "undefined") return;

	const scrollY = window.scrollY;
	scrolled.value = scrollY > 50;

	// Show nav after scrolling past hero (100vh)
	if (route.path === "/") {
		navVisible.value = scrollY > window.innerHeight * 0.3;
	} else {
		navVisible.value = true;
	}
};

// Initialize on mount
onMounted(() => {
	// Set initial state for non-home pages
	if (route.path !== "/") {
		navVisible.value = true;
	}
	handleScroll();
	window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
	if (typeof window !== "undefined") {
		window.removeEventListener("scroll", handleScroll);
	}
});

// Always show nav on non-home pages
watch(
	() => route.path,
	(newPath) => {
		mobileMenuOpen.value = false;
		if (newPath !== "/") {
			navVisible.value = true;
		} else {
			handleScroll();
		}
	},
	{ immediate: true }
);
</script>

<template>
	<div class="min-h-screen flex flex-col bg-[#0a0a1a]">
		<!-- Header -->
		<header
			class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
			:class="[
				navVisible
					? 'translate-y-0 opacity-100'
					: '-translate-y-full opacity-0',
				scrolled
					? 'bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-green-500/20 shadow-lg shadow-green-500/5'
					: 'bg-transparent',
			]">
			<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex items-center justify-between h-16">
					<!-- Logo -->
					<NuxtLink to="/" class="flex items-center gap-3 group">
						<div
							class="relative w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg flex items-center justify-center overflow-hidden">
							<div
								class="absolute inset-0 bg-gradient-to-br from-green-400 to-cyan-500 group-hover:scale-110 transition-transform duration-300" />
							<span class="relative font-pixel text-black text-sm">D</span>
						</div>
						<div class="flex flex-col">
							<span class="font-pixel text-sm text-white tracking-wider"
								>CALCULATOR</span
							>
							<span
								class="font-retro text-[8px] text-green-400/60 tracking-widest"
								>HEALTH METRICS</span
							>
						</div>
					</NuxtLink>

					<!-- Desktop Navigation -->
					<div class="hidden md:flex items-center gap-2">
						<NuxtLink
							v-for="item in headerNav"
							:key="item.path"
							:to="item.path"
							class="relative px-4 py-2 font-retro text-xs tracking-wider transition-all duration-200 group"
							:class="[
								route.path === item.path
									? 'text-green-400'
									: 'text-gray-400 hover:text-white',
							]">
							<!-- Active indicator -->
							<span
								v-if="route.path === item.path"
								class="absolute inset-0 bg-green-500/10 border border-green-500/30 rounded" />
							<!-- Hover effect -->
							<span
								class="absolute inset-0 bg-white/5 border border-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
							<span class="relative">{{ item.name }}</span>
						</NuxtLink>

						<!-- CTA Button -->
						<NuxtLink
							to="/bmi"
							class="ml-4 px-5 py-2 bg-gradient-to-r from-green-500 to-cyan-500 font-retro text-xs text-black tracking-wider rounded hover:from-green-400 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-green-500/20">
							START
						</NuxtLink>
					</div>

					<!-- Mobile Menu Button -->
					<button
						class="md:hidden relative w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
						:aria-expanded="mobileMenuOpen"
						aria-label="Toggle navigation menu"
						@click="mobileMenuOpen = !mobileMenuOpen">
						<div
							class="absolute inset-0 border border-white/20 rounded hover:border-white/40 transition-colors" />
						<svg
							v-if="!mobileMenuOpen"
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16" />
						</svg>
						<svg
							v-else
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Mobile Navigation -->
				<Transition
					enter-active-class="transition duration-300 ease-out"
					enter-from-class="opacity-0 -translate-y-4"
					enter-to-class="opacity-100 translate-y-0"
					leave-active-class="transition duration-200 ease-in"
					leave-from-class="opacity-100 translate-y-0"
					leave-to-class="opacity-0 -translate-y-4">
					<div
						v-if="mobileMenuOpen"
						class="md:hidden py-4 border-t border-green-500/20">
						<div class="flex flex-col gap-2">
							<NuxtLink
								v-for="item in headerNav"
								:key="item.path"
								:to="item.path"
								class="px-4 py-3 font-retro text-sm tracking-wider transition-all duration-200"
								:class="[
									route.path === item.path
										? 'bg-green-500/10 text-green-400 border-l-2 border-green-500'
										: 'text-gray-400 hover:text-white hover:bg-white/5',
								]">
								{{ item.name }}
							</NuxtLink>
							<NuxtLink
								to="/bmi"
								class="mx-4 mt-2 px-5 py-3 bg-gradient-to-r from-green-500 to-cyan-500 font-retro text-sm text-black tracking-wider text-center rounded">
								START NOW
							</NuxtLink>
						</div>
					</div>
				</Transition>
			</nav>
		</header>

		<!-- Main Content -->
		<main class="flex-1">
			<slot />
		</main>

		<!-- Footer -->
		<footer
			class="relative bg-[#050510] text-gray-400 border-t border-green-500/10">
			<!-- Grid pattern -->
			<div class="absolute inset-0 opacity-[0.02]">
				<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern
							id="footer-grid"
							width="32"
							height="32"
							patternUnits="userSpaceOnUse">
							<path
								d="M 32 0 L 0 0 0 32"
								fill="none"
								stroke="#22c55e"
								stroke-width="0.5" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#footer-grid)" />
				</svg>
			</div>

			<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
					<!-- Brand -->
					<div class="col-span-2 md:col-span-1">
						<div class="flex items-center gap-3 mb-6">
							<div
								class="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg flex items-center justify-center">
								<span class="font-pixel text-black text-sm">D</span>
							</div>
							<div class="flex flex-col">
								<span class="font-pixel text-sm text-white tracking-wider"
									>DIETWOI</span
								>
								<span
									class="font-retro text-[8px] text-green-400/60 tracking-widest"
									>v1.0</span
								>
							</div>
						</div>
						<p class="font-retro text-xs leading-relaxed text-gray-500">
							Free health calculators to help you understand your body and make
							informed decisions.
						</p>
					</div>

					<!-- Footer Sections -->
					<div v-for="section in footerNav" :key="section.title">
						<h3
							class="font-pixel text-[10px] text-green-400 mb-4 tracking-widest">
							{{ section.title.toUpperCase() }}
						</h3>
						<ul class="space-y-3">
							<li v-for="item in section.items" :key="item.name">
								<NuxtLink
									v-if="item.path !== '#'"
									:to="item.path"
									class="font-retro text-xs text-gray-500 hover:text-green-400 transition-colors">
									{{ item.name }}
								</NuxtLink>
								<span v-else class="font-retro text-xs text-gray-600">{{
									item.name
								}}</span>
							</li>
						</ul>
					</div>
				</div>

				<div class="border-t border-green-500/10 mt-12 pt-8">
					<div
						class="flex flex-col md:flex-row justify-between items-center gap-4">
						<p class="font-retro text-[10px] text-gray-600">
							&copy; {{ new Date().getFullYear() }} DIETWOI. ALL RIGHTS
							RESERVED.
						</p>
						<p
							class="font-retro text-[10px] text-gray-700 text-center md:text-right max-w-md">
							Calculations are for informational purposes only. Consult a
							healthcare professional for medical advice.
						</p>
					</div>
				</div>
			</div>

			<!-- Bottom accent line -->
			<div
				class="h-1 bg-gradient-to-r from-green-500 via-cyan-500 to-purple-500" />
		</footer>
	</div>
</template>
