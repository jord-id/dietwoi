<script setup lang="ts">
useSeo({
  title: 'Dietwoi - Free Health Calculators for BMI, BMR, TDEE & Body Fat',
  description: 'Calculate your BMI, BMR, TDEE, and body fat percentage with our free online health calculators. Make informed decisions about your health and fitness goals.',
  path: '/',
})

useWebsiteSchema()
</script>

<template>
  <div>
    <HomeHero />
    <HomeCalculators />
    <HomeFeatures />
  </div>
</template>
