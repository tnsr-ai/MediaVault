"use client";
import { DashboardCards } from "@/components/console/dashboard-cards";
import { DashboardCharts } from "@/components/console/dashboard-charts";
import { FileUpload } from "@/components/console/file-upload";
import { FilesTable } from "@/components/console/files-table";
import { RecentActivities } from "@/components/console/recent-activities";

export default function DashboardPage() {
	return (
		<div className="grid grid-cols-7 gap-6">
			{/* Top Row Content - Full Width */}
			<div className="col-span-7 space-y-6">
				<DashboardCards />
				<FileUpload />
				<DashboardCharts />
			</div>

			{/* Bottom Row - Files Table (5 cols) and Recent Activities (2 cols) */}
			<div className="col-span-5">
				<FilesTable />
			</div>
			<div className="col-span-2 max-h-[786px]">
				<RecentActivities />
			</div>
		</div>
	);
}
