<script setup lang="ts">
import { footerCategories, headerNav } from "~/config/navigation";

const WEB_NAME = "CALCULATOR";
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
							class="relative w-9 h-9 border-2 border-green-400 bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="text-green-400">
								<!-- Calculator body -->
								<rect x="2" y="1" width="12" height="14" fill="currentColor" />
								<!-- Screen -->
								<rect x="4" y="3" width="8" height="3" fill="#0a0a1a" />
								<!-- Buttons row 1 -->
								<rect x="4" y="8" width="2" height="2" fill="#0a0a1a" />
								<rect x="7" y="8" width="2" height="2" fill="#0a0a1a" />
								<rect x="10" y="8" width="2" height="2" fill="#0a0a1a" />
								<!-- Buttons row 2 -->
								<rect x="4" y="11" width="2" height="2" fill="#0a0a1a" />
								<rect x="7" y="11" width="2" height="2" fill="#0a0a1a" />
								<rect x="10" y="11" width="2" height="2" fill="#0a0a1a" />
							</svg>
						</div>
						<span class="font-pixel text-sm text-white tracking-wider">{{
							WEB_NAME
						}}</span>
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
		<footer class="bg-[#050510] text-gray-400 border-t border-green-500/10">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<!-- Categories Grid -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
					<div v-for="category in footerCategories" :key="category.title">
						<h3
							class="font-pixel text-[10px] text-green-400 mb-3 tracking-widest">
							{{ category.title }}
						</h3>
						<ul class="space-y-2">
							<li v-for="item in category.items" :key="item.name">
								<NuxtLink
									:to="item.path"
									class="font-game text-sm text-gray-500 hover:text-green-400 transition-colors">
									{{ item.name }}
								</NuxtLink>
							</li>
						</ul>
					</div>
				</div>

				<!-- Bottom -->
				<div
					class="border-t border-green-500/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
					<div class="flex items-center gap-2">
						<div
							class="w-6 h-6 border border-green-500/50 flex items-center justify-center">
							<svg width="12" height="12" viewBox="0 0 16 16" fill="none" class="text-green-400">
							<rect x="2" y="1" width="12" height="14" fill="currentColor" />
							<rect x="4" y="3" width="8" height="3" fill="#050510" />
							<rect x="4" y="8" width="2" height="2" fill="#050510" />
							<rect x="7" y="8" width="2" height="2" fill="#050510" />
							<rect x="10" y="8" width="2" height="2" fill="#050510" />
							<rect x="4" y="11" width="2" height="2" fill="#050510" />
							<rect x="7" y="11" width="2" height="2" fill="#050510" />
							<rect x="10" y="11" width="2" height="2" fill="#050510" />
						</svg>
						</div>
						<span class="font-pixel text-[10px] text-gray-500">{{
							WEB_NAME
						}}</span>
					</div>
					<p class="font-game text-xs text-gray-600 text-center">
						&copy; {{ new Date().getFullYear() }} Dietwoi. For informational
						purposes only.
					</p>
				</div>
			</div>
		</footer>
	</div>
</template>
