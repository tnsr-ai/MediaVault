"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Activity type icons
const ActivityIcon = ({ type }: { type: string }) => {
	const getIconConfig = (activityType: string) => {
		switch (activityType) {
			case "upload":
				return { bg: "bg-blue-100", color: "text-blue-600", icon: "↑" };
			case "edit":
				return { bg: "bg-green-100", color: "text-green-600", icon: "✏" };
			case "share":
				return { bg: "bg-yellow-100", color: "text-yellow-600", icon: "↗" };
			case "delete":
				return { bg: "bg-red-100", color: "text-red-600", icon: "🗑" };
			default:
				return { bg: "bg-gray-100", color: "text-gray-600", icon: "•" };
		}
	};

	const config = getIconConfig(type);

	return (
		<div
			className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} ${config.color}`}
		>
			<span className="text-sm font-medium">{config.icon}</span>
		</div>
	);
};

// Activity item interface
interface ActivityItem {
	id: number;
	type: "upload" | "edit" | "share" | "delete";
	action: string;
	fileName: string;
	folder: string;
	time: string;
	date?: string;
	members?: number;
}

// Sample activities data with more comprehensive dummy data
const sampleActivities: ActivityItem[] = [
	// Today's activities
	{
		id: 1,
		type: "upload",
		action: "Uploaded",
		fileName: "Q4 Financial Report.pdf",
		folder: "Reports › Finance",
		time: "Sep 27, 2025, 11:30 AM",
	},
	{
		id: 2,
		type: "edit",
		action: "Edited",
		fileName: "Product Roadmap 2026.pptx",
		folder: "Presentations › Product",
		time: "Sep 27, 2025, 10:15 AM",
	},
	{
		id: 3,
		type: "share",
		action: "Shared",
		fileName: "Team Meeting Notes.docx",
		folder: "Docs › Meetings",
		time: "Sep 27, 2025, 09:45 AM",
		members: 8,
	},
	{
		id: 4,
		type: "upload",
		action: "Uploaded",
		fileName: "Brand Guidelines.sketch",
		folder: "Design › Brand",
		time: "Sep 27, 2025, 08:20 AM",
	},
	{
		id: 5,
		type: "edit",
		action: "Edited",
		fileName: "User Research Findings.xlsx",
		folder: "Research › UX",
		time: "Sep 27, 2025, 07:55 AM",
	},

	// Yesterday's activities
	{
		id: 6,
		type: "share",
		action: "Shared",
		fileName: "Marketing Strategy.pdf",
		folder: "Docs › Marketing",
		time: "Sep 26, 2025, 06:42 PM",
		members: 5,
	},
	{
		id: 7,
		type: "delete",
		action: "Deleted",
		fileName: "Old Project Files.zip",
		folder: "Archive › Projects",
		time: "Sep 26, 2025, 05:30 PM",
	},
	{
		id: 8,
		type: "upload",
		action: "Uploaded",
		fileName: "Client Feedback Video.mp4",
		folder: "Media › Feedback",
		time: "Sep 26, 2025, 04:15 PM",
	},
	{
		id: 9,
		type: "edit",
		action: "Edited",
		fileName: "Website Mockup V3.fig",
		folder: "Design › Website",
		time: "Sep 26, 2025, 03:20 PM",
	},
	{
		id: 10,
		type: "share",
		action: "Shared",
		fileName: "Budget Report Q4.xlsx",
		folder: "Finance › Reports",
		time: "Sep 26, 2025, 02:10 PM",
		members: 12,
	},
	{
		id: 11,
		type: "upload",
		action: "Uploaded",
		fileName: "Employee Handbook.pdf",
		folder: "HR › Documents",
		time: "Sep 26, 2025, 01:45 PM",
	},
	{
		id: 12,
		type: "edit",
		action: "Edited",
		fileName: "API Documentation.md",
		folder: "Dev › Docs",
		time: "Sep 26, 2025, 12:30 PM",
	},
	{
		id: 13,
		type: "delete",
		action: "Deleted",
		fileName: "Contract Template Old.docx",
		folder: "Docs › Legal",
		time: "Sep 26, 2025, 11:05 AM",
	},
	{
		id: 14,
		type: "upload",
		action: "Uploaded",
		fileName: "Product Demo Screenshots.zip",
		folder: "Marketing › Assets",
		time: "Sep 26, 2025, 10:22 AM",
	},
	{
		id: 15,
		type: "share",
		action: "Shared",
		fileName: "Server Monitoring Dashboard.json",
		folder: "Dev › Config",
		time: "Sep 26, 2025, 09:15 AM",
		members: 3,
	},
];

// Group activities by date
const groupActivitiesByDate = (activities: ActivityItem[]) => {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const grouped: { [key: string]: ActivityItem[] } = {
		Today: [],
		Yesterday: [],
	};

	for (const activity of activities) {
		const activityDate = new Date(activity.time);
		const isToday = activityDate.toDateString() === today.toDateString();
		const isYesterday =
			activityDate.toDateString() === yesterday.toDateString();

		if (isToday) {
			grouped.Today.push(activity);
		} else if (isYesterday) {
			grouped.Yesterday.push(activity);
		}
	}

	return grouped;
};

export function RecentActivities() {
	const groupedActivities = groupActivitiesByDate(sampleActivities);

	return (
		<Card className="w-full h-fit">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-semibold text-gray-900">
						Recent Activities
					</CardTitle>
					<button
						type="button"
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<span className="text-lg">⋯</span>
					</button>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{Object.entries(groupedActivities).map(([dateGroup, activities]) => (
					<div key={dateGroup}>
						{activities.length > 0 && (
							<>
								<h3 className="text-sm font-medium text-gray-900 mb-4">
									{dateGroup}
								</h3>
								<div className="space-y-4">
									{activities.map((activity) => (
										<div key={activity.id} className="flex items-start gap-3">
											<ActivityIcon type={activity.type} />
											<div className="flex-1 min-w-0">
												<div className="text-sm text-gray-900">
													<span className="font-medium">{activity.action}</span>{" "}
													<span className="font-medium text-blue-600">
														"{activity.fileName}"
													</span>
													{activity.folder && (
														<>
															{" "}
															to{" "}
															<span className="text-blue-600">
																{activity.folder}
															</span>
														</>
													)}
													{activity.members && (
														<span className="text-gray-600">
															{" "}
															with {activity.members} Members
														</span>
													)}
												</div>
												<div className="text-xs text-gray-500 mt-1">
													{activity.time}
												</div>
											</div>
										</div>
									))}
								</div>
							</>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
