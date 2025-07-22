// Theme configuration for MediaVault
export const theme = {
	colors: {
		// Brand colors
		brand: {
			primary: "#10462f",
			primaryLight: "#247050",
			primaryDark: "#0a1d12",
			accent: "#5f947cab",
		},

		// UI colors
		ui: {
			background: "#ffffff",
			surface: "#f8f9fa",
			border: "#e4e5e4",
			text: {
				primary: "#000000",
				secondary: "#a4a09d",
				accent: "#c7dfd4",
				brand: "#d5dcd9",
			},
		},

		// Button variants
		button: {
			primary: {
				background:
					"bg-gradient-to-r from-[#0a1d12] via-[#15412e] to-[#247050]",
				hover: "hover:from-[#0f251a] hover:via-[#1a4d37] hover:to-[#2a8460]",
				text: "text-white",
			},
			secondary: {
				background: "bg-gray-100",
				hover: "hover:bg-gray-200",
				text: "text-gray-900",
			},
		},
	},

	// Component styles
	components: {
		input: {
			height: "h-10 sm:h-12",
			border: "border-[#e4e5e4]",
			text: "text-sm sm:text-base",
		},

		card: {
			background: "bg-white",
			border: "border-[#e4e5e4]",
			radius: "rounded-lg",
		},

		form: {
			spacing: "space-y-4 sm:space-y-6",
			fieldSpacing: "space-y-1.5 sm:space-y-2",
		},
	},

	// Typography
	typography: {
		heading: {
			primary:
				"text-xl sm:text-2xl md:text-3xl text-black tracking-tighter font-bold",
			secondary:
				"text-base sm:text-lg md:text-xl text-[#a4a09d] tracking-tight font-semibold",
		},

		label: "text-sm sm:text-base font-medium text-black tracking-tight",

		link: {
			base: "text-sm sm:text-base font-medium text-black tracking-tight",
			hover: "hover:text-[#5f947cab] transition-colors",
		},

		brand: {
			logo: "text-2xl sm:text-3xl md:text-4xl text-[#d5dcd9] tracking-tighter",
			hero: "text-4xl sm:text-5xl md:text-6xl text-[#c7dfd4] italic leading-tight tracking-tight",
			heroSecondary:
				"text-3xl sm:text-4xl md:text-5xl font-extralight text-[#c7dfd4] leading-tight tracking-tight",
		},
	},

	// Layout
	layout: {
		container: "w-full h-full md:h-auto max-w-none md:max-w-lg md:mx-auto",
		section: "flex-3 flex h-full w-full justify-center items-center",
		heroSection:
			"flex-2 flex justify-center items-center h-full rounded-3xl relative",
	},

	// Animations
	animations: {
		transition: "transition-all duration-300",
		colorTransition: "transition-colors",
	},
} as const;

// Helper functions for common patterns
export const getButtonStyles = (
	variant: "primary" | "secondary" = "primary",
) => {
	const btn = theme.colors.button[variant];
	return `${btn.background} ${btn.hover} ${btn.text} ${theme.animations.transition} rounded-md`;
};

export const getInputStyles = () => {
	return `${theme.components.input.height} ${theme.components.input.border} ${theme.components.input.text}`;
};

export const getLinkStyles = (withHover = true) => {
	return withHover
		? `${theme.typography.link.base} ${theme.typography.link.hover}`
		: theme.typography.link.base;
};
