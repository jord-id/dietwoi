<script setup lang="ts">
// 404 Page
useSeo({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  path: '/404',
  noindex: true,
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
    <div class="text-center">
      <!-- 404 Icon -->
      <div class="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
        <svg class="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Text -->
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p class="text-gray-500 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/"
          class="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25"
        >
          Go Home
        </NuxtLink>
        <NuxtLink
          to="/bmi"
          class="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
        >
          Try BMI Calculator
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
