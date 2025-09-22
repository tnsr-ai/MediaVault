"use client";
import { DashboardCards } from "@/components/console/dashboard-cards";
import { DashboardCharts } from "@/components/console/dashboard-charts";
import { FileUpload } from "@/components/console/file-upload";

export default function DashboardPage() {
	return (
		<div className="grid grid-cols-7 gap-6">
			{/* Left side - Cards and Charts */}
			<div className="col-span-5 space-y-6">
				<DashboardCards />
				<DashboardCharts />
			</div>

			{/* Right side - File Upload */}
			<div className="col-span-2 self-stretch min-h-0">
				<FileUpload />
			</div>
		</div>
	);
}
