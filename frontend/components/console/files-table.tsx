"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState } from "react";

// File type icons (you can replace these with actual icons)
const FileIcon = ({ type }: { type: string }) => {
	const getIconColor = (fileType: string) => {
		switch (fileType) {
			case "pdf":
				return "bg-red-100 text-red-600";
			case "sketch":
				return "bg-blue-100 text-blue-600";
			case "xlsx":
				return "bg-green-100 text-green-600";
			case "mp4":
				return "bg-yellow-100 text-yellow-600";
			case "zip":
				return "bg-purple-100 text-purple-600";
			case "md":
				return "bg-indigo-100 text-indigo-600";
			case "pptx":
				return "bg-orange-100 text-orange-600";
			case "sql":
				return "bg-cyan-100 text-cyan-600";
			case "ai":
				return "bg-pink-100 text-pink-600";
			case "fig":
				return "bg-violet-100 text-violet-600";
			case "wav":
				return "bg-emerald-100 text-emerald-600";
			case "docx":
				return "bg-blue-100 text-blue-600";
			case "psd":
				return "bg-purple-100 text-purple-600";
			case "drawio":
				return "bg-teal-100 text-teal-600";
			case "csv":
				return "bg-lime-100 text-lime-600";
			default:
				return "bg-gray-100 text-gray-600";
		}
	};

	return (
		<div
			className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconColor(
				type,
			)}`}
		>
			<span className="text-sm font-medium">
				{type.slice(0, 2).toUpperCase()}
			</span>
		</div>
	);
};

// User avatar component
const UserAvatar = ({
	name,
	size = "sm",
}: {
	name: string;
	size?: "sm" | "md";
}) => {
	const sizeClass = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2);

	return (
		<div
			className={`${sizeClass} rounded-full bg-blue-500 text-white flex items-center justify-center font-medium`}
		>
			{initials}
		</div>
	);
};

// Member avatars group
const MemberAvatars = ({
	members,
	maxShow = 3,
}: {
	members: string[];
	maxShow?: number;
}) => {
	const visibleMembers = members.slice(0, maxShow);
	const extraCount = members.length - maxShow;

	return (
		<div className="flex -space-x-1">
			{visibleMembers.map((member) => (
				<div key={member} className="relative">
					<UserAvatar name={member} />
				</div>
			))}
			{extraCount > 0 && (
				<div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
					+{extraCount}
				</div>
			)}
		</div>
	);
};

// Sort indicator component
const SortIndicator = ({
	direction,
}: {
	direction?: "asc" | "desc" | null;
}) => {
	if (!direction) return <span className="text-gray-300">↕</span>;
	return direction === "asc" ? (
		<span className="text-blue-600">↑</span>
	) : (
		<span className="text-blue-600">↓</span>
	);
};

// Sample data (expanded for pagination demonstration)
const sampleFiles = [
	{
		id: 1,
		name: "Client Onboarding Guide.pdf",
		size: "2.3 MB",
		folder: "Docs › Guides",
		owner: "Ameera Ahmed",
		members: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
		lastModified: "Sep 16, 2025",
		type: "pdf",
	},
	{
		id: 2,
		name: "Website Mockup V2.sketch",
		size: "14.8 MB",
		folder: "Design › Website",
		owner: "—",
		members: ["Alice Brown", "Bob Wilson", "Charlie Davis"],
		lastModified: "Sep 14, 2025",
		type: "sketch",
	},
	{
		id: 3,
		name: "Quarterly Sales 2025.xlsx",
		size: "1.1 MB",
		folder: "Reports › Sales",
		owner: "Shawn Vida",
		members: ["Emma Thompson", "David Lee", "Lisa Park", "Tom Anderson"],
		lastModified: "Sep 18, 2025",
		type: "xlsx",
	},
	{
		id: 4,
		name: "Product Ad Video.mp4",
		size: "55.2 MB",
		folder: "Marketing › Ads",
		owner: "Bailey Rowson",
		members: ["Mark Taylor", "Nina Rodriguez", "Paul Chen", "Rachel Green"],
		lastModified: "Sep 17, 2025",
		type: "mp4",
	},
	{
		id: 5,
		name: "Team Profile Headshots.zip",
		size: "80.6 MB",
		folder: "HR › Assets",
		owner: "—",
		members: ["Alex Johnson", "Maria Garcia"],
		lastModified: "Sep 15, 2025",
		type: "zip",
	},
	{
		id: 6,
		name: "Brand Guidelines.pdf",
		size: "4.7 MB",
		folder: "Design › Brand",
		owner: "Jessica Chen",
		members: ["Robert Kim", "Linda Martinez", "Kevin Brown"],
		lastModified: "Sep 20, 2025",
		type: "pdf",
	},
	{
		id: 7,
		name: "API Documentation.md",
		size: "125 KB",
		folder: "Dev › Docs",
		owner: "Michael Torres",
		members: [
			"Sarah Davis",
			"James Wilson",
			"Amy Rodriguez",
			"Chris Lee",
			"Maria Gonzalez",
		],
		lastModified: "Sep 22, 2025",
		type: "md",
	},
	{
		id: 8,
		name: "User Research Report.pptx",
		size: "8.9 MB",
		folder: "Research › UX",
		owner: "Anna Thompson",
		members: ["David Park", "Jennifer White", "Steven Moore"],
		lastModified: "Sep 19, 2025",
		type: "pptx",
	},
	{
		id: 9,
		name: "Database Backup.sql",
		size: "156 MB",
		folder: "Dev › Backups",
		owner: "Daniel Rodriguez",
		members: ["Lisa Chen", "Mark Johnson"],
		lastModified: "Sep 25, 2025",
		type: "sql",
	},
	{
		id: 10,
		name: "Marketing Campaign Assets.zip",
		size: "32.4 MB",
		folder: "Marketing › Campaigns",
		owner: "Rachel Green",
		members: ["Tony Stark", "Peter Parker", "Natasha Romanoff", "Bruce Banner"],
		lastModified: "Sep 21, 2025",
		type: "zip",
	},
	{
		id: 11,
		name: "Employee Training Video.mp4",
		size: "89.1 MB",
		folder: "HR › Training",
		owner: "Sandra Williams",
		members: ["Mike Davis", "Laura Wilson", "John Smith", "Emma Johnson"],
		lastModified: "Sep 23, 2025",
		type: "mp4",
	},
	{
		id: 12,
		name: "Financial Projections Q4.xlsx",
		size: "2.8 MB",
		folder: "Finance › Projections",
		owner: "Thomas Anderson",
		members: ["Neo Matrix", "Trinity Smith", "Morpheus Jones"],
		lastModified: "Sep 24, 2025",
		type: "xlsx",
	},
	{
		id: 13,
		name: "Logo Variations.ai",
		size: "12.3 MB",
		folder: "Design › Logos",
		owner: "Creative Team",
		members: ["Alice Designer", "Bob Artist", "Carol Creative"],
		lastModified: "Sep 26, 2025",
		type: "ai",
	},
	{
		id: 14,
		name: "Security Audit Report.pdf",
		size: "1.9 MB",
		folder: "IT › Security",
		owner: "Security Team",
		members: ["John Hacker", "Jane Secure", "Bob Firewall", "Alice Encryption"],
		lastModified: "Sep 27, 2025",
		type: "pdf",
	},
	{
		id: 15,
		name: "Product Wireframes.fig",
		size: "6.7 MB",
		folder: "Design › Product",
		owner: "UI Designer",
		members: ["Frontend Dev", "Product Manager", "UX Researcher"],
		lastModified: "Sep 25, 2025",
		type: "fig",
	},
	{
		id: 16,
		name: "Meeting Recording.wav",
		size: "45.6 MB",
		folder: "Meetings › Recordings",
		owner: "Meeting Host",
		members: [
			"Attendee 1",
			"Attendee 2",
			"Attendee 3",
			"Attendee 4",
			"Attendee 5",
		],
		lastModified: "Sep 22, 2025",
		type: "wav",
	},
	{
		id: 17,
		name: "Code Review Checklist.docx",
		size: "234 KB",
		folder: "Dev › Guidelines",
		owner: "Tech Lead",
		members: ["Senior Dev 1", "Senior Dev 2", "Junior Dev"],
		lastModified: "Sep 21, 2025",
		type: "docx",
	},
	{
		id: 18,
		name: "Social Media Assets.psd",
		size: "67.8 MB",
		folder: "Marketing › Social",
		owner: "Social Media Manager",
		members: ["Graphic Designer", "Content Creator", "Marketing Director"],
		lastModified: "Sep 20, 2025",
		type: "psd",
	},
	{
		id: 19,
		name: "System Architecture.drawio",
		size: "892 KB",
		folder: "Dev › Architecture",
		owner: "System Architect",
		members: ["Backend Lead", "DevOps Engineer", "Database Admin"],
		lastModified: "Sep 19, 2025",
		type: "drawio",
	},
	{
		id: 20,
		name: "Customer Feedback Analysis.csv",
		size: "3.2 MB",
		folder: "Analytics › Feedback",
		owner: "Data Analyst",
		members: ["Product Manager", "Customer Success", "Support Lead"],
		lastModified: "Sep 18, 2025",
		type: "csv",
	},
];

type SortField = "name" | "size" | "folder" | "owner" | "lastModified";
type SortDirection = "asc" | "desc";

export function FilesTable() {
	const [sortField, setSortField] = useState<SortField | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
		setCurrentPage(1); // Reset to first page when sorting
	};

	const sortedFiles = [...sampleFiles].sort((a, b) => {
		if (!sortField) return 0;

		// Handle size sorting (convert to bytes for proper comparison)
		if (sortField === "size") {
			const parseSize = (size: string) => {
				const value = Number.parseFloat(size);
				const unit = size.toLowerCase();
				if (unit.includes("gb")) return value * 1024 * 1024 * 1024;
				if (unit.includes("mb")) return value * 1024 * 1024;
				if (unit.includes("kb")) return value * 1024;
				return value;
			};
			const aValue = parseSize(a.size);
			const bValue = parseSize(b.size);

			if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
			if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
			return 0;
		}

		// Handle string sorting for other fields
		const aValue = a[sortField];
		const bValue = b[sortField];

		if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
		if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
		return 0;
	});

	// Pagination logic
	const totalItems = sortedFiles.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedFiles = sortedFiles.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePrevious = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	return (
		<Card className="w-full">
			<CardHeader className="pb-4">
				<CardTitle className="text-lg font-semibold text-gray-900">
					All Files
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="border-b border-gray-200">
								<TableHead
									className="cursor-pointer hover:bg-gray-50 select-none"
									onClick={() => handleSort("name")}
								>
									<div className="flex items-center gap-2 text-gray-600 font-medium">
										File Name
										<SortIndicator
											direction={sortField === "name" ? sortDirection : null}
										/>
									</div>
								</TableHead>
								<TableHead
									className="cursor-pointer hover:bg-gray-50 select-none"
									onClick={() => handleSort("size")}
								>
									<div className="flex items-center gap-2 text-gray-600 font-medium">
										Size
										<SortIndicator
											direction={sortField === "size" ? sortDirection : null}
										/>
									</div>
								</TableHead>
								<TableHead
									className="cursor-pointer hover:bg-gray-50 select-none"
									onClick={() => handleSort("folder")}
								>
									<div className="flex items-center gap-2 text-gray-600 font-medium">
										Folder
										<SortIndicator
											direction={sortField === "folder" ? sortDirection : null}
										/>
									</div>
								</TableHead>
								<TableHead
									className="cursor-pointer hover:bg-gray-50 select-none"
									onClick={() => handleSort("owner")}
								>
									<div className="flex items-center gap-2 text-gray-600 font-medium">
										Owner
										<SortIndicator
											direction={sortField === "owner" ? sortDirection : null}
										/>
									</div>
								</TableHead>
								<TableHead>
									<div className="text-gray-600 font-medium">Members</div>
								</TableHead>
								<TableHead
									className="cursor-pointer hover:bg-gray-50 select-none"
									onClick={() => handleSort("lastModified")}
								>
									<div className="flex items-center gap-2 text-gray-600 font-medium">
										Last Modified
										<SortIndicator
											direction={
												sortField === "lastModified" ? sortDirection : null
											}
										/>
									</div>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedFiles.map((file) => (
								<TableRow
									key={file.id}
									className="hover:bg-gray-50/50 transition-colors"
								>
									<TableCell>
										<div className="flex items-center gap-3">
											<FileIcon type={file.type} />
											<span className="font-medium text-gray-900">
												{file.name}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<span className="text-gray-600">{file.size}</span>
									</TableCell>
									<TableCell>
										<span className="text-gray-600">{file.folder}</span>
									</TableCell>
									<TableCell>
										<span className="text-gray-900 font-medium">
											{file.owner}
										</span>
									</TableCell>
									<TableCell>
										<MemberAvatars members={file.members} />
									</TableCell>
									<TableCell>
										<span className="text-gray-600">{file.lastModified}</span>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				{/* Pagination Controls */}
				<div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span>
							Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
							{totalItems} files
						</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={handlePrevious}
							disabled={currentPage === 1}
							className={`px-3 py-1 text-sm border rounded-md transition-colors ${
								currentPage === 1
									? "border-gray-200 text-gray-400 cursor-not-allowed"
									: "border-gray-300 text-gray-700 hover:bg-gray-50"
							}`}
						>
							Previous
						</button>

						<div className="flex items-center gap-1">
							{Array.from({ length: totalPages }, (_, i) => i + 1)
								.filter((page) => {
									// Show first page, last page, current page, and 2 pages around current
									if (page === 1 || page === totalPages) return true;
									if (Math.abs(page - currentPage) <= 1) return true;
									return false;
								})
								.map((page, index, array) => {
									// Add ellipsis if there's a gap
									const prevPage = array[index - 1];
									const showEllipsis = prevPage && page - prevPage > 1;

									return (
										<div key={page} className="flex items-center">
											{showEllipsis && (
												<span className="px-2 text-sm text-gray-400">...</span>
											)}
											<button
												type="button"
												onClick={() => handlePageChange(page)}
												className={`px-3 py-1 text-sm border rounded-md transition-colors ${
													currentPage === page
														? "border-blue-500 bg-blue-50 text-blue-600"
														: "border-gray-300 text-gray-700 hover:bg-gray-50"
												}`}
											>
												{page}
											</button>
										</div>
									);
								})}
						</div>

						<button
							type="button"
							onClick={handleNext}
							disabled={currentPage === totalPages}
							className={`px-3 py-1 text-sm border rounded-md transition-colors ${
								currentPage === totalPages
									? "border-gray-200 text-gray-400 cursor-not-allowed"
									: "border-gray-300 text-gray-700 hover:bg-gray-50"
							}`}
						>
							Next
						</button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
