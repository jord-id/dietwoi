<script setup lang="ts">
// Splash screen state
const showSplash = ref(false)
const contentReady = ref(false)

onMounted(() => {
  const hasVisited = sessionStorage.getItem('dietwoi-visited')

  if (hasVisited) {
    // Returning visitor: show content immediately
    contentReady.value = true
  } else {
    // First visit: show splash
    showSplash.value = true
    sessionStorage.setItem('dietwoi-visited', 'true')
  }
})

// Called by SplashScreen when animation completes
const onSplashComplete = () => {
  showSplash.value = false
  contentReady.value = true
}
</script>

<template>
  <!-- Splash Screen (client-only, first visit) -->
  <ClientOnly>
    <SplashScreen v-if="showSplash" @complete="onSplashComplete" />
  </ClientOnly>

  <!-- Main Content -->
  <div class="app-content" :class="{ 'is-ready': contentReady }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Hide content on initial client load until splash check completes */
.app-content {
  opacity: 0;
  background-color: #0a0a1a;
  min-height: 100vh;
}

.app-content.is-ready {
  opacity: 1;
  transition: opacity 0.5s ease-out;
}

/* SSR/SSG fallback - show content if no JS (for crawlers) */
@media (scripting: none) {
  .app-content {
    opacity: 1;
  }
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
