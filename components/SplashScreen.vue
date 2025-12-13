<script setup lang="ts">
import { gsap } from 'gsap'

const emit = defineEmits<{
  complete: []
}>()

const isVisible = ref(true)
const splashRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const progress = ref(0)

onMounted(() => {
  // Animate progress bar over 2.5 seconds
  gsap.to(progress, {
    value: 100,
    duration: 2.5,
    ease: 'power1.inOut',
    onUpdate: () => {
      if (progressRef.value) {
        progressRef.value.style.width = `${progress.value}%`
      }
    },
    onComplete: () => {
      // Brief pause at 100%, then fade out
      gsap.to(splashRef.value, {
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          isVisible.value = false
          emit('complete')
        },
      })
    },
  })
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      ref="splashRef"
      class="fixed inset-0 z-[9999] bg-[#0a0a1a] flex flex-col items-center justify-center"
    >
      <!-- Background grid -->
      <div class="absolute inset-0 opacity-[0.03]">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="splash-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#22c55e" stroke-width="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#splash-grid)" />
        </svg>
      </div>

      <!-- Pulsing rings -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="absolute w-[200px] h-[200px] border border-green-500/20 rounded-full animate-ping" style="animation-duration: 2s;" />
        <div class="absolute w-[300px] h-[300px] border border-cyan-500/10 rounded-full animate-ping" style="animation-duration: 2.5s;" />
      </div>

      <!-- Logo -->
      <div class="relative z-10 flex flex-col items-center gap-8">
        <!-- Animated logo -->
        <div class="relative">
          <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <span class="font-pixel text-2xl text-black">D</span>
          </div>
          <!-- Corner accents -->
          <div class="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-green-400" />
          <div class="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-green-400" />
          <div class="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div class="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
        </div>

        <!-- Brand name -->
        <div class="flex flex-col items-center gap-2">
          <span class="font-pixel text-lg text-white tracking-widest">DIETWOI</span>
          <span class="font-retro text-[10px] text-green-400/60 tracking-[0.3em]">HEALTH METRICS</span>
        </div>

        <!-- Loading bar -->
        <div class="w-48 mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="font-pixel text-[8px] text-green-500">LOADING</span>
            <span class="font-pixel text-[8px] text-green-500">{{ Math.round(progress) }}%</span>
          </div>
          <div class="h-2 bg-black/50 border border-green-500/30 rounded-sm overflow-hidden">
            <div
              ref="progressRef"
              class="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all"
              style="width: 0%"
            />
          </div>
        </div>

        <!-- Loading dots -->
        <div class="flex items-center gap-2 mt-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" style="animation-delay: 0.2s;" />
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" style="animation-delay: 0.4s;" />
        </div>
      </div>

      <!-- Bottom text -->
      <div class="absolute bottom-8 flex flex-col items-center gap-2">
        <span class="font-retro text-[8px] text-gray-600">INITIALIZING SYSTEM</span>
        <div class="flex gap-1">
          <div class="w-1 h-1 bg-green-500" />
          <div class="w-1 h-1 bg-green-500" />
          <div class="w-1 h-1 bg-green-500" />
        </div>
      </div>

      <!-- Scanlines -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.03]"
        style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 4px);"
      />
    </div>
  </Teleport>
</template>
