import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  })

  // Sync Lenis scroll with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update)

  // Sync Lenis with GSAP ticker for optimal performance
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  // Disable GSAP's lag smoothing for smoother animations
  gsap.ticker.lagSmoothing(0)

  return {
    provide: {
      lenis,
    },
  }
})
