# Dietwoi

Free, privacy-first health calculators built with modern web technologies.

**Live:** [dietwoi.com](https://dietwoi.com)

## Features

- **10 Health Calculators** - BMI, BMR, TDEE, Body Fat %, Ideal Weight, Lean Body Mass, Macros, Calories, Water Intake, One Rep Max
- **Privacy-First** - All calculations run client-side, no data sent to servers
- **Accessible** - Full keyboard navigation, ARIA support, screen reader friendly
- **Fast** - Static site generation for instant page loads
- **Mobile Responsive** - Works on all devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Nuxt 3](https://nuxt.com) (Vue 3 + TypeScript) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Animations | [GSAP](https://greensock.com/gsap/) + [Lenis](https://lenis.studiofreight.com/) |
| Build | [Bun](https://bun.sh) |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/jordxx/dietwoi.git
cd dietwoi

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun generate` | Generate static site |
| `bun preview` | Preview production build |
| `bun lint` | Run ESLint |

## Project Structure

```
├── pages/              # Calculator pages (auto-routed)
├── components/
│   ├── Calculator/     # Reusable calculator components
│   └── Home/           # Homepage components
├── composables/
│   ├── useCalculations.ts   # Health formulas & validation
│   ├── useCalculatorSetup.ts # Shared calculator setup
│   └── useSeo.ts            # SEO meta tags & schemas
├── config/             # Calculator & navigation config
├── types/              # TypeScript definitions
└── docs/               # Documentation & formulas
```

## Calculators

| Calculator | Description | Formula Source |
|------------|-------------|----------------|
| BMI | Body Mass Index | WHO |
| BMR | Basal Metabolic Rate | Mifflin-St Jeor |
| TDEE | Total Daily Energy Expenditure | Harris-Benedict |
| Body Fat % | Body fat estimation | Jackson-Pollock |
| Ideal Weight | Healthy weight range | Devine, Robinson, Miller, Hamwi |
| Lean Body Mass | Muscle mass calculation | Boer |
| Macros | Protein/carbs/fat split | ISSN Guidelines |
| Calories | Custom calorie goals | - |
| Water Intake | Daily hydration needs | IOM |
| One Rep Max | Strength estimation | Epley, Brzycki, Lombardi |

See [docs/calculators.md](docs/calculators.md) for detailed formulas and scientific sources.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

These calculators are for informational purposes only and should not be considered medical advice. Always consult a healthcare professional for personalized guidance.
