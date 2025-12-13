<script setup lang="ts">
// Global app configuration
const showSplash = ref(false)
const splashComplete = ref(false)

// Provide splash state to child components
provide('splashComplete', splashComplete)

// Only show splash on client-side initial load
onMounted(() => {
  // Check if this is a fresh page load (not navigation)
  if (!sessionStorage.getItem('dietwoi-visited')) {
    showSplash.value = true
    sessionStorage.setItem('dietwoi-visited', 'true')
  } else {
    splashComplete.value = true
  }
})

// Called by SplashScreen when done
const onSplashComplete = () => {
  showSplash.value = false
  splashComplete.value = true
}
</script>

<template>
  <ClientOnly>
    <SplashScreen v-if="showSplash" @complete="onSplashComplete" />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
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
