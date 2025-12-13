// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // SSG mode - pre-render all pages at build time
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml'],
    },
  },

  // Global CSS
  css: ['~/assets/css/fonts.css'],

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
  ],

  // App configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Press+Start+2P&family=Silkscreen:wght@400;700&display=swap' },
      ],
    },
  },

  // Sitemap configuration
  site: {
    url: 'https://dietwoi.com',
    name: 'Dietwoi - Health Calculators',
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: 'https://dietwoi.com',
      siteName: 'Dietwoi',
    },
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // Development tools
  devtools: { enabled: true },

  compatibilityDate: '2024-12-13',
})
