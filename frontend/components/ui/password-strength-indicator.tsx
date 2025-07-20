import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

interface PasswordRequirement {
	id: string;
	text: string;
	test: (password: string) => boolean;
}

interface PasswordStrengthIndicatorProps {
	password: string;
	className?: string;
	autoCollapse?: boolean; // New prop to control auto-collapse behavior
	hideWhenComplete?: boolean; // New prop to completely hide when all requirements met
	collapseDelay?: number; // Delay in milliseconds before auto-collapse (default: 1500ms)
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
	{
		id: "length",
		text: "At least 8 characters",
		test: (password: string) => password.length >= 8,
	},
	{
		id: "uppercase",
		text: "At least one uppercase letter (A-Z)",
		test: (password: string) => /[A-Z]/.test(password),
	},
	{
		id: "lowercase",
		text: "At least one lowercase letter (a-z)",
		test: (password: string) => /[a-z]/.test(password),
	},
	{
		id: "number",
		text: "At least one number (0-9)",
		test: (password: string) => /[0-9]/.test(password),
	},
	{
		id: "special",
		text: "At least one special character (!@#$%^&*)",
		test: (password: string) =>
			/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
	},
];

export function PasswordStrengthIndicator({
	password,
	className = "",
	autoCollapse = true,
	hideWhenComplete = false,
	collapseDelay = 1500,
}: PasswordStrengthIndicatorProps) {
	const [isExpanded, setIsExpanded] = useState(true);

	const getRequirementStatus = (requirement: PasswordRequirement) => {
		return requirement.test(password);
	};

	const completedRequirements = PASSWORD_REQUIREMENTS.filter((req) =>
		getRequirementStatus(req),
	).length;
	const totalRequirements = PASSWORD_REQUIREMENTS.length;
	const isAllCompleted = completedRequirements === totalRequirements;

	// Auto-collapse when all requirements are met
	useEffect(() => {
		if (autoCollapse && isAllCompleted) {
			// Delay to let user see the completion, then collapse
			const timer = setTimeout(() => {
				setIsExpanded(false);
			}, collapseDelay);

			return () => clearTimeout(timer);
		}
		if (!isAllCompleted) {
			// Expand again if user modifies password and requirements are no longer met
			setIsExpanded(true);
		}
	}, [isAllCompleted, autoCollapse, collapseDelay]);

	// Completely hide when all requirements are met
	if (hideWhenComplete && isAllCompleted) {
		return null;
	}

	const isCollapsed = autoCollapse && isAllCompleted && !isExpanded;

	return (
		<div
			className={`overflow-hidden transition-all duration-500 ease-in-out ${className}`}
		>
			<div
				className={`rounded-lg border transition-all duration-500 ease-in-out ${
					isCollapsed
						? "bg-green-50 border-green-200 p-3"
						: "bg-gray-50 border-gray-300 p-4"
				}`}
			>
				{/* Collapsed Header - shown when collapsed */}
				{isCollapsed && (
					<button
						type="button"
						onClick={() => setIsExpanded(true)}
						className="flex items-center justify-between w-full text-left hover:bg-green-100 rounded transition-colors duration-200 -m-1 p-1 group"
					>
						<div className="flex items-center text-green-700">
							<Check className="w-4 h-4 mr-2 text-green-600 transition-transform duration-300 group-hover:scale-110" />
							<span className="text-sm font-medium">
								Password meets all requirements
							</span>
						</div>
						<ChevronDown className="w-4 h-4 text-green-600 transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-0.5" />
					</button>
				)}

				{/* Expanded Content - with smooth height animation */}
				<div
					className={`transition-all duration-500 ease-in-out overflow-hidden ${
						isCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
					}`}
				>
					{/* Header */}
					<div className="flex items-center justify-between mb-3">
						<h4 className="text-sm font-medium text-gray-700 transition-colors duration-300">
							Password requirements
						</h4>
						<div className="flex items-center space-x-2">
							{isAllCompleted && (
								<div
									className={`flex items-center text-green-600 text-xs font-medium transition-all duration-500 ${
										isCollapsed ? "opacity-0" : "opacity-100"
									}`}
								>
									<Check className="w-3 h-3 mr-1 transition-transform duration-300" />
									All requirements met
								</div>
							)}
							{autoCollapse && isAllCompleted && (
								<button
									type="button"
									onClick={() => setIsExpanded(false)}
									className={`p-1 hover:bg-gray-200 rounded transition-all duration-200 hover:scale-110 group ${
										isCollapsed
											? "opacity-0 pointer-events-none"
											: "opacity-100"
									}`}
									title="Minimize"
								>
									<ChevronUp className="w-3 h-3 text-gray-500 transition-transform duration-300 group-hover:-rotate-180" />
								</button>
							)}
						</div>
					</div>

					{/* Requirements List */}
					<div className="space-y-2">
						{PASSWORD_REQUIREMENTS.map((requirement, index) => {
							const isCompleted = getRequirementStatus(requirement);
							return (
								<div
									key={requirement.id}
									className={`flex items-start space-x-2 text-xs transition-all duration-300 ease-out transform ${
										isCompleted
											? "text-green-600 translate-x-1"
											: "text-gray-500 translate-x-0"
									}`}
									style={{
										animationDelay: `${index * 100}ms`,
									}}
								>
									<div
										className={`flex-shrink-0 mt-0.5 w-3 h-3 rounded-full border flex items-center justify-center transition-all duration-300 ease-out transform ${
											isCompleted
												? "bg-green-600 border-green-600 scale-110 shadow-sm"
												: "border-gray-300 bg-white scale-100"
										}`}
									>
										{isCompleted && (
											<Check
												className="w-2 h-2 text-white animate-in zoom-in duration-200"
												strokeWidth={3}
											/>
										)}
									</div>
									<span
										className={`leading-tight transition-all duration-300 ${
											isCompleted ? "font-medium transform translate-x-1" : ""
										}`}
									>
										{requirement.text}
									</span>
								</div>
							);
						})}
					</div>

					{/* Progress indicator */}
					<div className="mt-3 pt-3 border-t border-gray-200 transition-all duration-300">
						<div className="flex justify-between items-center text-xs text-gray-500">
							<span className="transition-colors duration-300">Strength:</span>
							<span
								className={`font-medium transition-all duration-500 ease-out transform ${
									isAllCompleted
										? "text-green-600 scale-105"
										: completedRequirements >= 3
										  ? "text-yellow-600"
										  : completedRequirements >= 1
											  ? "text-orange-600"
											  : "text-red-600"
								}`}
							>
								{isAllCompleted
									? "Strong"
									: completedRequirements >= 3
									  ? "Good"
									  : completedRequirements >= 1
										  ? "Fair"
										  : "Weak"}
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
							<div
								className={`h-1.5 rounded-full transition-all duration-700 ease-out transform ${
									isAllCompleted
										? "bg-green-500 shadow-sm"
										: completedRequirements >= 3
										  ? "bg-yellow-500"
										  : completedRequirements >= 1
											  ? "bg-orange-500"
											  : "bg-red-500"
								}`}
								style={{
									width: `${
										(completedRequirements / totalRequirements) * 100
									}%`,
									transition:
										"width 0.7s ease-out, background-color 0.3s ease-out",
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export { PASSWORD_REQUIREMENTS };
