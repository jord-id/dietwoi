# Changelog

All notable changes to this project will be documented in this file.


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
