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
			<div className="col-span-7 row-span-2 space-y-6">
				<DashboardCards />
				<FileUpload />
				<DashboardCharts />
			</div>
		</div>
	);
}
