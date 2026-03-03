# Changelog

All notable changes to this project will be documented in this file.


## [1.4.0](https://github.com/jord-id/dietwoi/compare/v1.3.0...v1.4.0) (2026-03-03)

### Features

* add Blood Pressure, Cholesterol, Diabetes Risk, Pregnancy Weight, and Child Growth calculators ([a576c99](https://github.com/jord-id/dietwoi/commit/a576c9974f41dafb789e86873a424dc578f2f02a))
* add Calorie Deficit, Protein, and Meal Calories calculators ([6553587](https://github.com/jord-id/dietwoi/commit/6553587c34ca49810984d66fc30e22b4fb596414))
* add Max HR, Heart Rate Zones, VO2 Max, Pace, and Calories Burned calculators ([8ff5dbc](https://github.com/jord-id/dietwoi/commit/8ff5dbc1b562ca5276859dd41f0673540c89607f))
* add new calculator input components and disclaimer ([f755384](https://github.com/jord-id/dietwoi/commit/f755384246affefedb82179a9f473485d68ddb22))
* add Sleep, Caffeine, Sodium, and Alcohol calculators ([cc7bfe7](https://github.com/jord-id/dietwoi/commit/cc7bfe748ef274677d8a6d494a0dbcda1d37cd08))
* add WHR, WHtR, and Metabolic Age calculators ([441e349](https://github.com/jord-id/dietwoi/commit/441e3497b6bb731e8a521f15609f2718a2e72f38))

### Bug Fixes

* auto-sync main branch after release ([c5b2064](https://github.com/jord-id/dietwoi/commit/c5b206418bd2c27b884361f8c59bd4f62c3b7ccc))
* resolve lint errors across new calculators ([baeeb5a](https://github.com/jord-id/dietwoi/commit/baeeb5a2e9ebae3b3349a5dffa0713207aed4c5c))
* update calculator count to 30+ and resolve TypeScript errors ([79217fe](https://github.com/jord-id/dietwoi/commit/79217fe779e12b8c1c69e6707f02fd0302a7a9fe))

## [1.3.1](https://github.com/jord-id/dietwoi/compare/v1.3.0...v1.3.1) (2026-01-04)

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-01-04

### Added
- JSDoc documentation for all Calculator components
- SEO meta tags: `author`, `keywords`, `ogImageAlt`, `twitterImageAlt`
- `BmiCategory` and `BmiRanges` TypeScript types for type-safe BMI calculations
- README.md with project documentation
- MIT LICENSE file
- This CHANGELOG

### Fixed
- Color contrast in footer (WCAG AA compliance)
- TypeScript errors in BMI page template iteration
- `#app-manifest` Nuxt warning by disabling experimental feature

### Changed
- Improved type safety for v-model bindings in Calculator components

## [1.2.0] - 2025-12-15

### Added
- Deploy script for automated production deployment
- Umami analytics integration
- `useCalculatorSetup` composable to reduce boilerplate (~150 lines removed)
- `CalculationError` class for input validation
- Centralized color configuration system

### Changed
- Improved codebase architecture and file organization
- Consolidated color styles into type-safe system

## [1.1.0] - 2025-12-14

### Added
- Full mobile responsiveness across all pages
- Keyboard navigation for GenderSelector and ActivitySelector
- ARIA labels and accessibility attributes

### Changed
- Improved UI/UX consistency across calculators
- Enhanced interactive states and transitions

## [1.0.0] - 2025-12-13

### Added
- Complete rewrite as Nuxt 3 health calculator application
- 10 health calculators:
  - BMI (Body Mass Index)
  - BMR (Basal Metabolic Rate)
  - TDEE (Total Daily Energy Expenditure)
  - Body Fat Percentage
  - Ideal Weight
  - Lean Body Mass
  - Macros Calculator
  - Calorie Calculator
  - Water Intake
  - One Rep Max
- Retro/pixel aesthetic design with dark theme
- GSAP animations and Lenis smooth scrolling
- SEO optimization with JSON-LD structured data
- Sitemap generation
- Static site generation (SSG)

### Changed
- Complete project overhaul from previous food-related app
- Migrated from Vue 2 to Nuxt 3 with TypeScript

---

## Pre-1.0 History

The repository contains legacy commits from an earlier food-related web application (2022).
Version 1.0.0 represents a complete rewrite as a health calculator platform.

[1.3.0]: https://github.com/jordxx/dietwoi/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/jordxx/dietwoi/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/jordxx/dietwoi/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/jordxx/dietwoi/releases/tag/v1.0.0
