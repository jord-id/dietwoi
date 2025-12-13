export interface Calculator {
	id: string;
	name: string;
	fullName: string;
	path: string;
	color: string;
	borderColor: string;
	description: string;
	comingSoon?: boolean;
}

export interface Category {
	id: string;
	name: string;
	calculators: Calculator[];
}

export const categories: Category[] = [
	{
		id: "body",
		name: "BODY",
		calculators: [
			{
				id: "bmi",
				name: "BMI",
				fullName: "Body Mass Index",
				path: "/bmi",
				color: "text-violet-600",
				borderColor: "border-violet-300 hover:border-violet-500",
				description: "Assess if you're at a healthy weight for your height",
			},
			{
				id: "body-fat",
				name: "BF%",
				fullName: "Body Fat Percentage",
				path: "/body-fat",
				color: "text-emerald-600",
				borderColor: "border-emerald-300 hover:border-emerald-500",
				description: "Estimate your body fat percentage",
			},
			{
				id: "ideal-weight",
				name: "IDEAL",
				fullName: "Ideal Body Weight",
				path: "/ideal-weight",
				color: "text-amber-600",
				borderColor: "border-amber-300 hover:border-amber-500",
				description: "Find your ideal weight range",
			},
			{
				id: "lean-body-mass",
				name: "LBM",
				fullName: "Lean Body Mass",
				path: "/lean-body-mass",
				color: "text-green-600",
				borderColor: "border-green-300 hover:border-green-500",
				description: "Calculate your lean muscle mass",
			},
		],
	},
	{
		id: "energy",
		name: "ENERGY",
		calculators: [
			{
				id: "bmr",
				name: "BMR",
				fullName: "Basal Metabolic Rate",
				path: "/bmr",
				color: "text-orange-600",
				borderColor: "border-orange-300 hover:border-orange-500",
				description: "Calculate calories burned at rest",
			},
			{
				id: "tdee",
				name: "TDEE",
				fullName: "Total Daily Energy",
				path: "/tdee",
				color: "text-sky-600",
				borderColor: "border-sky-300 hover:border-sky-500",
				description: "Total calories burned daily",
			},
			{
				id: "calories",
				name: "CAL",
				fullName: "Calorie Calculator",
				path: "/calories",
				color: "text-amber-600",
				borderColor: "border-amber-300 hover:border-amber-500",
				description: "Daily calorie needs for your goals",
			},
			{
				id: "macros",
				name: "MACRO",
				fullName: "Macro Calculator",
				path: "/macros",
				color: "text-pink-600",
				borderColor: "border-pink-300 hover:border-pink-500",
				description: "Protein, carbs & fat split",
			},
		],
	},
	{
		id: "wellness",
		name: "WELLNESS",
		calculators: [
			{
				id: "water-intake",
				name: "H2O",
				fullName: "Water Intake",
				path: "/water-intake",
				color: "text-cyan-600",
				borderColor: "border-cyan-300 hover:border-cyan-500",
				description: "Daily hydration needs",
			},
		],
	},
	{
		id: "strength",
		name: "STRENGTH",
		calculators: [
			{
				id: "one-rep-max",
				name: "1RM",
				fullName: "One Rep Max",
				path: "/one-rep-max",
				color: "text-red-600",
				borderColor: "border-red-300 hover:border-red-500",
				description: "Calculate your maximum lift",
			},
		],
	},
	{
		id: "coming-soon",
		name: "SOON",
		calculators: [
			{
				id: "protein",
				name: "PROT",
				fullName: "Protein Calculator",
				path: "/protein",
				color: "text-blue-500",
				borderColor: "border-blue-200",
				description: "Calculate optimal protein intake for your goals",
				comingSoon: true,
			},
			{
				id: "calories-burned",
				name: "BURN",
				fullName: "Calories Burned",
				path: "/calories-burned",
				color: "text-orange-500",
				borderColor: "border-orange-200",
				description: "Calculate calories burned by activity (MET-based)",
				comingSoon: true,
			},
			{
				id: "heart-rate-zones",
				name: "HR",
				fullName: "Heart Rate Zones",
				path: "/heart-rate-zones",
				color: "text-red-500",
				borderColor: "border-red-200",
				description: "Find your training heart rate zones",
				comingSoon: true,
			},
			{
				id: "pace-calculator",
				name: "PACE",
				fullName: "Pace Calculator",
				path: "/pace-calculator",
				color: "text-sky-500",
				borderColor: "border-sky-200",
				description: "Convert pace, speed & race predictions",
				comingSoon: true,
			},
			{
				id: "waist-hip-ratio",
				name: "WHR",
				fullName: "Waist-to-Hip Ratio",
				path: "/waist-hip-ratio",
				color: "text-violet-500",
				borderColor: "border-violet-200",
				description: "Assess cardiovascular health risk",
				comingSoon: true,
			},
			{
				id: "sleep-calculator",
				name: "SLEEP",
				fullName: "Sleep Calculator",
				path: "/sleep-calculator",
				color: "text-indigo-500",
				borderColor: "border-indigo-200",
				description: "Optimal sleep duration by age",
				comingSoon: true,
			},
		],
	},
];
