// Valid card colors for home page calculator cards
export type CardColor =
	| "violet"
	| "emerald"
	| "amber"
	| "green"
	| "orange"
	| "sky"
	| "pink"
	| "cyan"
	| "red"
	| "blue"
	| "indigo";

// Color class mappings for type-safe styling
export const cardColorStyles: Record<
	CardColor,
	{ text: string; border: string }
> = {
	violet: {
		text: "text-violet-600",
		border: "border-violet-300 hover:border-violet-500",
	},
	emerald: {
		text: "text-emerald-600",
		border: "border-emerald-300 hover:border-emerald-500",
	},
	amber: {
		text: "text-amber-600",
		border: "border-amber-300 hover:border-amber-500",
	},
	green: {
		text: "text-green-600",
		border: "border-green-300 hover:border-green-500",
	},
	orange: {
		text: "text-orange-600",
		border: "border-orange-300 hover:border-orange-500",
	},
	sky: {
		text: "text-sky-600",
		border: "border-sky-300 hover:border-sky-500",
	},
	pink: {
		text: "text-pink-600",
		border: "border-pink-300 hover:border-pink-500",
	},
	cyan: {
		text: "text-cyan-600",
		border: "border-cyan-300 hover:border-cyan-500",
	},
	red: {
		text: "text-red-600",
		border: "border-red-300 hover:border-red-500",
	},
	blue: {
		text: "text-blue-600",
		border: "border-blue-300 hover:border-blue-500",
	},
	indigo: {
		text: "text-indigo-600",
		border: "border-indigo-300 hover:border-indigo-500",
	},
};

// Helper to get color classes
export const getCardColorClasses = (
	color: CardColor
): { text: string; border: string } => {
	return cardColorStyles[color];
};

export interface Calculator {
	id: string;
	name: string;
	fullName: string;
	path: string;
	cardColor: CardColor;
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
				cardColor: "violet",
				description: "Assess if you're at a healthy weight for your height",
			},
			{
				id: "body-fat",
				name: "BF%",
				fullName: "Body Fat Percentage",
				path: "/body-fat",
				cardColor: "emerald",
				description: "Estimate your body fat percentage",
			},
			{
				id: "ideal-weight",
				name: "IDEAL",
				fullName: "Ideal Body Weight",
				path: "/ideal-weight",
				cardColor: "amber",
				description: "Find your ideal weight range",
			},
			{
				id: "lean-body-mass",
				name: "LBM",
				fullName: "Lean Body Mass",
				path: "/lean-body-mass",
				cardColor: "green",
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
				cardColor: "orange",
				description: "Calculate calories burned at rest",
			},
			{
				id: "tdee",
				name: "TDEE",
				fullName: "Total Daily Energy",
				path: "/tdee",
				cardColor: "sky",
				description: "Total calories burned daily",
			},
			{
				id: "calories",
				name: "CAL",
				fullName: "Calorie Calculator",
				path: "/calories",
				cardColor: "amber",
				description: "Daily calorie needs for your goals",
			},
			{
				id: "macros",
				name: "MACRO",
				fullName: "Macro Calculator",
				path: "/macros",
				cardColor: "pink",
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
				cardColor: "cyan",
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
				cardColor: "red",
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
				cardColor: "blue",
				description: "Calculate optimal protein intake for your goals",
				comingSoon: true,
			},
			{
				id: "calories-burned",
				name: "BURN",
				fullName: "Calories Burned",
				path: "/calories-burned",
				cardColor: "orange",
				description: "Calculate calories burned by activity (MET-based)",
				comingSoon: true,
			},
			{
				id: "heart-rate-zones",
				name: "HR",
				fullName: "Heart Rate Zones",
				path: "/heart-rate-zones",
				cardColor: "red",
				description: "Find your training heart rate zones",
				comingSoon: true,
			},
			{
				id: "pace-calculator",
				name: "PACE",
				fullName: "Pace Calculator",
				path: "/pace-calculator",
				cardColor: "sky",
				description: "Convert pace, speed & race predictions",
				comingSoon: true,
			},
			{
				id: "waist-hip-ratio",
				name: "WHR",
				fullName: "Waist-to-Hip Ratio",
				path: "/waist-hip-ratio",
				cardColor: "violet",
				description: "Assess cardiovascular health risk",
				comingSoon: true,
			},
			{
				id: "sleep-calculator",
				name: "SLEEP",
				fullName: "Sleep Calculator",
				path: "/sleep-calculator",
				cardColor: "indigo",
				description: "Optimal sleep duration by age",
				comingSoon: true,
			},
		],
	},
];
