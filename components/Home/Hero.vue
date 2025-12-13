<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const heroRef = ref<HTMLElement | null>(null);
const floatingElements = ref<HTMLElement[]>([]);

// Store animation context for cleanup
let gsapContext: gsap.Context | null = null;

// Check if splash is complete - default to true for returning visitors
const splashComplete = inject<Ref<boolean>>("splashComplete", ref(true));

// Hero visibility - true by default, set false only when splash is active
const isReady = ref(true);

// Random utility functions - memoized outside render
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomDirection = () => (Math.random() > 0.5 ? 1 : -1);

// Animate floating elements with GSAP - consolidated for performance
const animateFloatingElements = () => {
	floatingElements.value.forEach((el, index) => {
		if (!el) return;

		const duration = random(4, 8);
		const delay = index * 0.2;

		// Single timeline per element instead of multiple tweens
		const tl = gsap.timeline({
			repeat: -1,
			yoyo: true,
			delay: delay,
		});

		tl.fromTo(
			el,
			{
				x: random(-15, 15),
				y: random(-15, 15),
				rotation: random(-10, 10),
				scale: 1,
			},
			{
				x: random(15, 35) * randomDirection(),
				y: random(20, 45) * randomDirection(),
				rotation: random(-8, 8),
				scale: random(0.96, 1.06),
				duration: duration,
				ease: "sine.inOut",
			}
		);
	});
};

// Animate particles with random paths - consolidated
const animateParticles = () => {
	const particles = heroRef.value?.querySelectorAll(".particle");
	particles?.forEach((particle, index) => {
		const duration = random(6, 10);
		const delay = index * 0.4;

		// Single tween with all properties
		gsap.to(particle, {
			y: `+=${random(30, 60) * randomDirection()}`,
			x: `+=${random(25, 50) * randomDirection()}`,
			opacity: random(0.4, 1),
			scale: random(0.9, 1.3),
			duration: duration,
			delay: delay,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true,
		});
	});
};

// Animate aurora with GSAP - consolidated
const animateAurora = () => {
	const auroras = heroRef.value?.querySelectorAll(".aurora");
	auroras?.forEach((aurora, index) => {
		const duration = random(12, 18);
		const delay = index * 1.5;

		// Single tween with all properties
		gsap.to(aurora, {
			x: `+=${random(40, 80) * randomDirection()}`,
			y: `+=${random(25, 50) * randomDirection()}`,
			scale: random(0.92, 1.1),
			opacity: random(0.2, 0.4),
			duration: duration,
			delay: delay,
			ease: "sine.inOut",
			repeat: -1,
			yoyo: true,
		});
	});
};

// Animate rings with scroll interaction
const animateRings = () => {
	const rings = heroRef.value?.querySelectorAll(".pulse-ring");

	rings?.forEach((ring, index) => {
		// Base pulsing animation
		gsap.fromTo(
			ring,
			{ scale: 0.8, opacity: 0.4 },
			{
				scale: 1.2,
				opacity: 0,
				duration: 4,
				delay: index * 1.5,
				ease: "power1.out",
				repeat: -1,
			}
		);

		// Scroll-based expansion and rotation
		gsap.to(ring, {
			scale: 1.5 + index * 0.3,
			rotation: (index % 2 === 0 ? 1 : -1) * 45,
			opacity: 0.1,
			ease: "none",
			scrollTrigger: {
				trigger: heroRef.value,
				start: "top top",
				end: "bottom top",
				scrub: 1 + index * 0.5,
			},
		});
	});

	// Animate aurora on scroll
	const auroras = heroRef.value?.querySelectorAll(".aurora");
	auroras?.forEach((aurora, index) => {
		gsap.to(aurora, {
			y: -100 - index * 50,
			x: (index % 2 === 0 ? 1 : -1) * 80,
			scale: 1.3,
			opacity: 0.1,
			ease: "none",
			scrollTrigger: {
				trigger: heroRef.value,
				start: "top top",
				end: "bottom top",
				scrub: 1.5,
			},
		});
	});

	// Parallax effect on hexagon grid
	const hexGrid = heroRef.value?.querySelector(".hex-grid");
	if (hexGrid) {
		gsap.to(hexGrid, {
			y: 150,
			opacity: 0.01,
			ease: "none",
			scrollTrigger: {
				trigger: heroRef.value,
				start: "top top",
				end: "bottom top",
				scrub: 1,
			},
		});
	}
};

// Headline entrance animation
const animateHeadline = () => {
	const tl = gsap.timeline({ delay: 0.3 });

	tl.from(".headline-line-1", {
		y: 50,
		opacity: 0,
		duration: 0.8,
		ease: "power3.out",
	})
		.from(
			".headline-line-2",
			{
				y: 50,
				opacity: 0,
				duration: 0.8,
				ease: "power3.out",
			},
			"-=0.4"
		)
		.from(
			".subtitle",
			{
				y: 30,
				opacity: 0,
				duration: 0.6,
				ease: "power2.out",
			},
			"-=0.3"
		)
		.from(
			".ecg-monitor",
			{
				scale: 0.9,
				opacity: 0,
				duration: 0.6,
				ease: "back.out(1.5)",
			},
			"-=0.2"
		);
};

// Heartbeat animation for vitals (62 BPM)
const animateHeartbeat = () => {
	const heart = heroRef.value?.querySelector(".heart-icon");
	const bpm = heroRef.value?.querySelector(".bpm-value");
	const scanLine = heroRef.value?.querySelector(".ecg-scan");
	const ecgPath = heroRef.value?.querySelector(".ecg-path");

	// ECG has 3 peaks at roughly 22%, 53%, 84% of the width
	// Full sweep duration for 3 beats at 62 BPM = ~2.9s
	const sweepDuration = 2.9;

	if (scanLine) {
		// Continuous scan line sweep
		gsap.to(scanLine, {
			left: "100%",
			duration: sweepDuration,
			ease: "none",
			repeat: -1,
			onRepeat: () => {
				gsap.set(scanLine, { left: "0%" });
			},
		});
	}

	if (heart) {
		// Heart beats when scan line hits each peak
		// Peaks at 22%, 53%, 84% of sweep duration
		const peakTimes = [0.22, 0.53, 0.84];

		const heartbeatTl = gsap.timeline({ repeat: -1 });

		peakTimes.forEach((peakTime) => {
			const time = peakTime * sweepDuration;
			// Lub-dub pattern
			heartbeatTl
				.to(heart, { scale: 1.35, duration: 0.08, ease: "power2.out" }, time)
				.to(heart, { scale: 1, duration: 0.1, ease: "power2.in" }, time + 0.08)
				.to(
					heart,
					{ scale: 1.2, duration: 0.06, ease: "power2.out" },
					time + 0.2
				)
				.to(
					heart,
					{ scale: 1, duration: 0.12, ease: "power2.in" },
					time + 0.26
				);
		});

		// Set total duration to match sweep
		heartbeatTl.totalDuration(sweepDuration);
	}

	if (bpm) {
		// Glow on each beat
		const glowTl = gsap.timeline({ repeat: -1 });
		const peakTimes = [0.22, 0.53, 0.84];

		peakTimes.forEach((peakTime) => {
			const time = peakTime * sweepDuration;
			glowTl
				.to(
					bpm,
					{
						color: "#f87171",
						textShadow: "0 0 10px rgba(248, 113, 113, 0.5)",
						duration: 0.1,
					},
					time
				)
				.to(
					bpm,
					{ color: "#4ade80", textShadow: "none", duration: 0.3 },
					time + 0.15
				);
		});

		glowTl.totalDuration(sweepDuration);
	}

	if (ecgPath) {
		// Draw ECG line following scan
		const pathLength = (ecgPath as SVGPathElement).getTotalLength?.() || 500;
		gsap.set(ecgPath, {
			strokeDasharray: pathLength,
			strokeDashoffset: pathLength,
		});
		gsap.to(ecgPath, {
			strokeDashoffset: 0,
			duration: sweepDuration,
			ease: "none",
			repeat: -1,
		});
	}
};

const startAnimations = () => {
	if (!heroRef.value) return;

	isReady.value = true;

	// Use GSAP context for automatic cleanup
	gsapContext = gsap.context(() => {
		animateFloatingElements();
		animateParticles();
		animateAurora();
		animateRings();
		animateHeadline();
		animateHeartbeat();
	}, heroRef.value);
};

onMounted(() => {
	// Wait for splash to complete before starting animations
	if (splashComplete.value) {
		startAnimations();
	} else {
		// Hide hero while splash is showing
		isReady.value = false;
		const unwatch = watch(splashComplete, (complete) => {
			if (complete) {
				startAnimations();
				unwatch();
			}
		});
	}
});

// Cleanup all GSAP animations on unmount
onUnmounted(() => {
	if (gsapContext) {
		gsapContext.revert();
	}
	// Clear ScrollTrigger instances
	ScrollTrigger.getAll().forEach((st) => st.kill());
});

// Register floating elements - reset on each mount
const setFloatingRef = (el: any) => {
	if (el && !floatingElements.value.includes(el)) {
		floatingElements.value.push(el);
	}
};
</script>

<template>
	<section
		ref="heroRef"
		class="relative min-h-screen-safe overflow-hidden bg-[#0a0a1a] transition-opacity duration-500"
		:class="isReady ? 'opacity-100' : 'opacity-0'">
		<!-- Animated Gradient Mesh Background -->
		<div class="absolute inset-0">
			<div
				class="absolute inset-0 bg-gradient-to-br from-green-950/40 via-transparent to-cyan-950/30" />
			<div
				class="absolute inset-0 bg-gradient-to-tl from-purple-950/20 via-transparent to-transparent" />
		</div>

		<!-- Animated Aurora/Northern Lights - GPU accelerated -->
		<div class="absolute inset-0 overflow-hidden will-change-transform">
			<div
				class="aurora absolute top-0 left-1/4 w-[600px] h-[400px] bg-gradient-to-b from-green-500/40 via-cyan-500/20 to-transparent rounded-full blur-3xl opacity-30 will-change-transform" />
			<div
				class="aurora absolute top-20 right-1/4 w-[500px] h-[350px] bg-gradient-to-b from-cyan-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl opacity-30 will-change-transform" />
			<div
				class="aurora absolute top-10 left-1/2 w-[400px] h-[300px] bg-gradient-to-b from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl opacity-30 will-change-transform" />
		</div>

		<!-- Hexagon Grid Pattern -->
		<div class="hex-grid absolute inset-0 opacity-[0.04]">
			<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern
						id="hexagons"
						width="50"
						height="43.4"
						patternUnits="userSpaceOnUse"
						patternTransform="scale(2)">
						<polygon
							points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4"
							fill="none"
							stroke="#22c55e"
							stroke-width="0.5"
							transform="translate(0,-7.2)" />
						<polygon
							points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4"
							fill="none"
							stroke="#22c55e"
							stroke-width="0.5"
							transform="translate(25,14.4)" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#hexagons)" />
			</svg>
		</div>

		<!-- Floating Particles -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none">
			<div
				class="particle absolute w-1 h-1 bg-green-400 rounded-full"
				style="top: 20%; left: 10%" />
			<div
				class="particle absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
				style="top: 40%; left: 85%" />
			<div
				class="particle absolute w-1 h-1 bg-purple-400 rounded-full"
				style="top: 70%; left: 20%" />
			<div
				class="particle absolute w-2 h-2 bg-green-300/50 rounded-full"
				style="top: 30%; left: 70%" />
			<div
				class="particle absolute w-1 h-1 bg-yellow-400 rounded-full"
				style="top: 80%; left: 60%" />
			<div
				class="particle absolute w-1.5 h-1.5 bg-cyan-300 rounded-full"
				style="top: 15%; left: 50%" />
			<div
				class="particle absolute w-1 h-1 bg-pink-400 rounded-full"
				style="top: 60%; left: 90%" />
			<div
				class="particle absolute w-1 h-1 bg-green-500 rounded-full"
				style="top: 90%; left: 30%" />
			<div
				class="particle absolute w-1 h-1 bg-orange-400 rounded-full"
				style="top: 25%; left: 75%" />
			<div
				class="particle absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
				style="top: 55%; left: 5%" />
		</div>

		<!-- Pulsing Rings -->
		<div
			class="absolute inset-0 flex items-center justify-center pointer-events-none">
			<div
				class="pulse-ring absolute w-[600px] h-[600px] border border-green-500/20 rounded-full" />
			<div
				class="pulse-ring absolute w-[800px] h-[800px] border border-cyan-500/15 rounded-full" />
			<div
				class="pulse-ring absolute w-[1000px] h-[1000px] border border-purple-500/10 rounded-full" />
		</div>

		<!-- Floating Health Elements - GSAP animated, GPU accelerated -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none">
			<!-- Formula snippets -->
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden sm:block will-change-transform"
				style="top: 15%; left: 5%">
				<div
					class="px-3 py-2 bg-green-500/15 border border-green-500/30 rounded transform -rotate-3">
					<span class="font-pixel text-[8px] text-green-400">BMI = kg/m²</span>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden md:block will-change-transform"
				style="top: 35%; right: 6%">
				<div
					class="px-3 py-2 bg-cyan-500/15 border border-cyan-500/30 rounded transform rotate-2">
					<span class="font-pixel text-[8px] text-cyan-400"
						>TDEE = BMR × AF</span
					>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden lg:block will-change-transform"
				style="bottom: 30%; left: 8%">
				<div
					class="px-3 py-2 bg-purple-500/15 border border-purple-500/30 rounded transform rotate-1">
					<span class="font-pixel text-[8px] text-purple-400"
						>BF% = 1.2×BMI</span
					>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden xl:block will-change-transform"
				style="top: 60%; left: 3%">
				<div
					class="px-3 py-2 bg-orange-500/15 border border-orange-500/30 rounded transform -rotate-2">
					<span class="font-pixel text-[8px] text-orange-400">BMR = 10×W</span>
				</div>
			</div>

			<!-- Calculator buttons -->
			<div
				:ref="setFloatingRef"
				class="floating-element absolute will-change-transform"
				style="top: 25%; right: 10%">
				<div
					class="w-11 h-11 bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500/40 rounded-lg flex items-center justify-center transform rotate-6">
					<span class="font-pixel text-orange-400 text-lg">÷</span>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute will-change-transform"
				style="bottom: 35%; right: 5%">
				<div
					class="w-11 h-11 bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/40 rounded-lg flex items-center justify-center transform -rotate-3">
					<span class="font-pixel text-green-400 text-lg">=</span>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute will-change-transform"
				style="top: 50%; left: 3%">
				<div
					class="w-11 h-11 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-2 border-cyan-500/40 rounded-lg flex items-center justify-center transform rotate-12">
					<span class="font-pixel text-cyan-400 text-lg">×</span>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden sm:block will-change-transform"
				style="top: 12%; left: 22%">
				<div
					class="w-9 h-9 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/40 rounded-lg flex items-center justify-center transform -rotate-6">
					<span class="font-pixel text-yellow-400 text-sm">%</span>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden md:block will-change-transform"
				style="bottom: 20%; left: 15%">
				<div
					class="w-10 h-10 bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-2 border-pink-500/40 rounded-lg flex items-center justify-center transform rotate-8">
					<span class="font-pixel text-pink-400 text-base">+</span>
				</div>
			</div>

			<!-- Health icons -->
			<div
				:ref="setFloatingRef"
				class="floating-element absolute will-change-transform"
				style="top: 20%; right: 20%">
				<div class="text-2xl transform -rotate-12">❤️</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden sm:block will-change-transform"
				style="bottom: 25%; left: 20%">
				<div class="text-2xl transform rotate-6">⚖️</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden md:block will-change-transform"
				style="top: 65%; right: 22%">
				<div class="text-xl transform -rotate-6">📊</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden lg:block will-change-transform"
				style="top: 40%; left: 12%">
				<div class="text-xl transform rotate-3">🎯</div>
			</div>

			<!-- Metric values -->
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden lg:block will-change-transform"
				style="bottom: 28%; left: 28%">
				<div
					class="px-2 py-1 bg-black/50 border border-green-500/30 rounded transform -rotate-2">
					<span class="font-pixel text-[10px] text-green-400">22.5</span>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden sm:block will-change-transform"
				style="top: 55%; right: 3%">
				<div
					class="px-2 py-1 bg-black/50 border border-cyan-500/30 rounded transform rotate-4">
					<span class="font-pixel text-[10px] text-cyan-400">1850</span>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden md:block will-change-transform"
				style="top: 22%; left: 38%">
				<div
					class="px-2 py-1 bg-black/50 border border-purple-500/30 rounded transform -rotate-1">
					<span class="font-pixel text-[10px] text-purple-400">18%</span>
				</div>
			</div>
			<div
				:ref="setFloatingRef"
				class="floating-element absolute hidden xl:block will-change-transform"
				style="bottom: 45%; right: 18%">
				<div
					class="px-2 py-1 bg-black/50 border border-orange-500/30 rounded transform rotate-2">
					<span class="font-pixel text-[10px] text-orange-400">2100</span>
				</div>
			</div>
		</div>

		<!-- CRT Scanlines Overlay -->
		<div
			class="pointer-events-none absolute inset-0 z-40 opacity-[0.02]"
			style="
				background: repeating-linear-gradient(
					0deg,
					transparent,
					transparent 2px,
					rgba(0, 0, 0, 0.4) 2px,
					rgba(0, 0, 0, 0.4) 4px
				);
			" />

		<!-- Noise Texture Overlay -->
		<div
			class="pointer-events-none absolute inset-0 z-30 opacity-[0.015] mix-blend-overlay"
			style="
				background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E&quot;);
			" />

		<!-- Corner Decorations -->
		<div class="absolute top-4 left-4 flex gap-1">
			<div class="w-3 h-3 bg-red-500" />
			<div class="w-3 h-3 bg-yellow-500" />
			<div class="w-3 h-3 bg-green-500" />
		</div>
		<div class="absolute top-4 right-4 font-pixel text-[8px] text-green-500/50">
			v1.0
		</div>

		<!-- Main Content -->
		<div
			class="relative z-10 min-h-screen-safe flex items-center justify-center px-4 py-20">
			<div class="max-w-4xl mx-auto text-center">
				<!-- Main Headline -->
				<h1 class="font-pixel mb-6 relative">
					<span
						class="headline-line-1 relative block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-relaxed tracking-widest drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
						ALL IN ONE
					</span>
					<span
						class="headline-line-2 relative block text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed tracking-widest mt-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
						HEALTH METRICS
					</span>
				</h1>

				<!-- Pixel Divider -->
				<div class="subtitle flex justify-center items-center gap-2 my-8">
					<div class="h-1 w-8 bg-green-500/50" />
					<div class="w-2 h-2 bg-green-400 rotate-45" />
					<div class="h-1 w-16 bg-gradient-to-r from-green-500 to-cyan-500" />
					<div class="w-2 h-2 bg-cyan-400 rotate-45" />
					<div class="h-1 w-8 bg-cyan-500/50" />
				</div>

				<!-- Subtitle -->
				<p
					class="subtitle font-retro text-sm sm:text-base text-gray-400 mb-12 max-w-lg mx-auto leading-loose">
					Calculate <span class="text-green-400">BMI</span>,
					<span class="text-orange-400">BMR</span>,
					<span class="text-cyan-400">TDEE</span> &
					<span class="text-purple-400">Body Fat</span>
					<br >
					All in one place. Zero complexity.
				</p>

				<!-- Animated Heartbeat Monitor -->
				<div class="ecg-monitor mt-16 flex flex-col items-center gap-4">
					<div class="flex items-center gap-3">
						<span class="font-pixel text-[8px] text-green-500 tracking-widest"
							>VITALS</span
						>
					</div>

					<!-- ECG Line -->
					<div
						class="relative w-64 h-16 overflow-hidden border-2 border-green-500/30 bg-black/40 rounded">
						<div
							class="absolute inset-0 opacity-20"
							style="
								background-image:
									linear-gradient(#22c55e 1px, transparent 1px),
									linear-gradient(90deg, #22c55e 1px, transparent 1px);
								background-size: 8px 8px;
							" />
						<svg
							class="absolute inset-0 w-full h-full"
							viewBox="0 0 256 64"
							preserveAspectRatio="none">
							<defs>
								<linearGradient
									id="pulse-gradient"
									x1="0%"
									y1="0%"
									x2="100%"
									y2="0%">
									<stop offset="0%" stop-color="#22c55e" stop-opacity="0.2" />
									<stop offset="50%" stop-color="#22c55e" stop-opacity="1" />
									<stop offset="100%" stop-color="#22c55e" stop-opacity="0.8" />
								</linearGradient>
							</defs>
							<path
								class="ecg-path"
								d="M0,32 L40,32 L50,32 L55,20 L60,44 L65,10 L70,54 L75,28 L80,32 L120,32 L130,32 L135,20 L140,44 L145,10 L150,54 L155,28 L160,32 L200,32 L210,32 L215,20 L220,44 L225,10 L230,54 L235,28 L240,32 L256,32"
								fill="none"
								stroke="url(#pulse-gradient)"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round" />
						</svg>
						<div
							class="ecg-scan absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-90" />
					</div>

					<!-- Stats row -->
					<div class="flex items-center gap-6 font-pixel text-[8px]">
						<div class="flex items-center gap-2">
							<span
								class="heart-icon text-red-500 text-base inline-block origin-center"
								>❤</span
							>
							<span class="bpm-value text-green-400 tabular-nums">62 BPM</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-cyan-400">◈</span>
							<span class="text-green-400">ONLINE</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Border -->
		<div class="absolute bottom-0 left-0 right-0">
			<div
				class="h-2 bg-gradient-to-r from-green-500 via-cyan-500 to-purple-500" />
			<div class="h-1 bg-black/50" />
		</div>

		<!-- Scroll Indicator -->
		<div
			class="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
			<span
				class="font-pixel text-[8px] text-gray-500 tracking-widest animate-pulse"
				>SCROLL DOWN</span
			>
			<div class="flex flex-col gap-1 animate-bounce">
				<div class="w-4 h-1 bg-gray-500 mx-auto" />
				<div class="w-3 h-1 bg-gray-500 mx-auto" />
				<div class="w-2 h-1 bg-gray-500 mx-auto" />
			</div>
		</div>
	</section>
</template>
