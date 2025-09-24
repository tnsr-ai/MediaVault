"use client";
import { DashboardCards } from "@/components/console/dashboard-cards";
import { DashboardCharts } from "@/components/console/dashboard-charts";
import { FileUpload } from "@/components/console/file-upload";
import { useState } from "react";

export default function DashboardPage() {
	const [isBlueExpanded, setIsBlueExpanded] = useState(false);
	return (
		<div className="grid grid-cols-7 grid-rows-[auto_auto_auto_auto] gap-6">
			{/* Top Row Content */}
			<div className="col-span-5 row-span-2 space-y-6">
				<DashboardCards />
				<DashboardCharts />
			</div>
			{/* Row 1-2: Blue block - Collapsible */}
			<button
				type="button"
				className={`col-span-2 self-stretch min-h-0 cursor-pointer transition-all duration-300 ${
					isBlueExpanded ? "row-span-2" : "row-span-1"
				}`}
				onClick={() => setIsBlueExpanded(!isBlueExpanded)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						setIsBlueExpanded(!isBlueExpanded);
					}
				}}
			>
				<div
					className={`w-full bg-blue-400 flex items-center justify-center text-white font-semibold ${
						isBlueExpanded ? "h-full" : "h-[200px]"
					}`}
				>
					{isBlueExpanded ? "Click to Collapse" : "Click to Expand"}
				</div>
			</button>

			{/* Row 3: Green block */}
			<div className="col-span-5 row-start-3">
				<div className="w-full h-[200px] bg-green-400" />
			</div>

			{/* Row 3-4: Grey block - Dynamic positioning based on blue block state */}
			<div
				className={`col-span-2 self-stretch min-h-0 transition-all duration-300 ${
					isBlueExpanded
						? "row-span-2 row-start-3" // When blue is expanded: start from green row (row 3), span 2 rows
						: "row-span-3 row-start-2" // When blue is collapsed: start from second red block (row 2), span 3 rows
				}`}
			>
				<div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold">
					{isBlueExpanded ? "Grey: From Green" : "Grey: From Red 2"}
				</div>
			</div>

			{/* Row 4: Pink block */}
			<div className="col-span-5 row-start-4">
				<div className="w-full h-[600px] bg-pink-400" />
			</div>
		</div>
	);
}
