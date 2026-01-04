import type { Config } from "tailwindcss";

export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./composables/**/*.{js,ts}",
		"./plugins/**/*.{js,ts}",
		"./config/**/*.{js,ts}",
		"./types/**/*.ts",
		"./app.vue",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
				pixel: ['"Press Start 2P"', "monospace"],
				retro: ["Silkscreen", "monospace"],
				game: ['"Jersey 20"', "system-ui", "sans-serif"],
			},
			colors: {
				primary: {
					50: "#fffbeb",
					100: "#fef3c7",
					200: "#fde68a",
					300: "#fcd34d",
					400: "#fbbf24",
					500: "#f59e0b",
					600: "#d97706",
					700: "#b45309",
					800: "#92400e",
					900: "#78350f",
				},
			},
			animation: {
				"fade-in": "fadeIn 0.3s ease-out",
				"slide-up": "slideUp 0.3s ease-out",
				"slide-down": "slideDown 0.3s ease-out",
				"scale-in": "scaleIn 0.2s ease-out",
				blob: "blob 8s infinite",
				float: "float 6s ease-in-out infinite",
				"spin-slow": "spin 20s linear infinite",
				"pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				scan: "scan 2s linear infinite",
				aurora: "aurora 15s ease-in-out infinite",
				"pulse-ring": "pulseRing 4s ease-out infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				slideDown: {
					"0%": { opacity: "0", transform: "translateY(-10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				scaleIn: {
					"0%": { opacity: "0", transform: "scale(0.95)" },
					"100%": { opacity: "1", transform: "scale(1)" },
				},
				blob: {
					"0%": { transform: "translate(0px, 0px) scale(1)" },
					"33%": { transform: "translate(30px, -50px) scale(1.1)" },
					"66%": { transform: "translate(-20px, 20px) scale(0.9)" },
					"100%": { transform: "translate(0px, 0px) scale(1)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-20px)" },
				},
				scan: {
					"0%": { left: "0%" },
					"100%": { left: "100%" },
				},
				aurora: {
					"0%, 100%": {
						transform: "translateX(0) translateY(0) scale(1)",
						opacity: "0.3",
					},
					"25%": {
						transform: "translateX(30px) translateY(-20px) scale(1.1)",
						opacity: "0.4",
					},
					"50%": {
						transform: "translateX(-20px) translateY(30px) scale(0.95)",
						opacity: "0.35",
					},
					"75%": {
						transform: "translateX(20px) translateY(10px) scale(1.05)",
						opacity: "0.45",
					},
				},
				pulseRing: {
					"0%": { transform: "scale(0.8)", opacity: "0.5" },
					"50%": { transform: "scale(1)", opacity: "0.2" },
					"100%": { transform: "scale(1.2)", opacity: "0" },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
