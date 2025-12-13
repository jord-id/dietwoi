// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	// SSG mode - pre-render all pages at build time
	ssr: true,
	nitro: {
		prerender: {
			crawlLinks: true,
			routes: ["/", "/sitemap.xml"],
		},
	},

	// Global CSS (fonts loaded via main.css)
	css: [],

	// Modules
	modules: ["@nuxtjs/tailwindcss", "@nuxt/eslint", "@nuxtjs/sitemap"],

	// Tailwind configuration
	tailwindcss: {
		configPath: "tailwind.config.ts",
		cssPath: "~/assets/css/main.css",
		exposeConfig: true,
	},

	// App configuration
	app: {
		head: {
			htmlAttrs: {
				lang: "en",
			},
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			link: [
				{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			],
		},
	},

	// Sitemap configuration
	site: {
		url: "https://dietwoi.com",
		name: "Dietwoi - Health Calculators",
	},

	// Runtime config
	runtimeConfig: {
		public: {
			siteUrl: "https://dietwoi.com",
			siteName: "Dietwoi",
		},
	},

	// TypeScript
	typescript: {
		strict: true,
	},

	// Development tools
	devtools: { enabled: true },

	compatibilityDate: "2024-12-13",
});
