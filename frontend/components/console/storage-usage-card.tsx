import type React from "react";
import { DEFAULT_CATEGORY_COLORS } from "./constants";

interface Category {
	name: string;
	percentage: number;
	color?: string; // Make color optional as we'll use defaults
}

interface StorageUsageCardProps {
	currentUsageGB: number;
	totalCapacityGB: number;
	categories: Category[];
}

export const StorageUsageCard: React.FC<StorageUsageCardProps> = ({
	currentUsageGB,
	totalCapacityGB,
	categories,
}) => {
	// Calculate the remaining percentage
	const usedPercentage = categories.reduce(
		(sum, category) => sum + category.percentage,
		0,
	);
	const remainingPercentage = 100 - usedPercentage;

	// Get color for category or use default
	const getCategoryColor = (categoryName: string, customColor?: string) => {
		if (customColor) return customColor;

		// Try to match category name with default colors
		const normalizedName = categoryName.toLowerCase();
		if (normalizedName.includes("document"))
			return DEFAULT_CATEGORY_COLORS.Documents;
		if (normalizedName.includes("image")) return DEFAULT_CATEGORY_COLORS.Images;
		if (normalizedName.includes("video")) return DEFAULT_CATEGORY_COLORS.Videos;
		if (normalizedName.includes("audio")) return DEFAULT_CATEGORY_COLORS.Audio;

		// Fallback to a default color
		return "#6B7280"; // gray-500
	};

	return (
		<div className="bg-white rounded-lg shadow p-6">
			{/* Header Section */}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">Storage</h2>
				<div className="text-gray-600">
					<span className="font-bold">{currentUsageGB} GB</span> of{" "}
					{totalCapacityGB} GB Capacity
				</div>
			</div>

			{/* Progress Bar */}
			<div className="w-full h-6 mb-4">
				<div className="flex h-full">
					{/* Category segments */}
					{categories.map((category) => (
						<div
							key={category.name}
							className="h-full rounded-lg mx-px"
							style={{
								width: `calc(${category.percentage}% - 0.25rem)`,
								backgroundColor: getCategoryColor(
									category.name,
									category.color,
								),
							}}
						/>
					))}
					{/* Remaining capacity segment */}
					{remainingPercentage > 0 && (
						<div
							className="h-full bg-gray-200 rounded-lg mx-px"
							style={{ width: `calc(${remainingPercentage}% - 0.25rem)` }}
						/>
					)}
				</div>
			</div>

			{/* Legend */}
			<div className="flex flex-wrap gap-4">
				{categories.map((category) => (
					<div key={category.name} className="flex items-center">
						<div
							className="w-4 h-4 rounded-sm mr-2"
							style={{
								backgroundColor: getCategoryColor(
									category.name,
									category.color,
								),
							}}
						/>
						<span className="text-sm text-gray-700">
							{category.name} ({category.percentage}%)
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
