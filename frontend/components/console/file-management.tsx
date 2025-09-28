"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid, List, Search } from "lucide-react";
import { useState } from "react";

interface FileManagementProps {
	title?: string;
}

export function FileManagement({ title = "All Files" }: FileManagementProps) {
	const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="w-full">
			<div className="flex h-20 items-center px-4">
				<div className="flex-1">
					<h1 className="text-2xl font-bold">{title}</h1>
				</div>

				<div className="flex-1 flex justify-end items-center gap-3">
					<div className="relative">
						<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search file or folder"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full h-12 rounded-full bg-[#ebece6] border-none pl-12 pr-4"
						/>
					</div>

					<div className="flex border rounded-full">
						<Button
							variant={viewMode === "grid" ? "default" : "ghost"}
							size="icon"
							onClick={() => setViewMode("grid")}
							className="rounded-l-full"
						>
							<Grid className="h-5 w-5" />
						</Button>
						<Button
							variant={viewMode === "table" ? "default" : "ghost"}
							size="icon"
							onClick={() => setViewMode("table")}
							className="rounded-r-full"
						>
							<List className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>

			<div>
				{viewMode === "grid" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{/* Grid view will be implemented here */}
					</div>
				) : (
					<div className="border rounded-lg">
						{/* Table view will be implemented here */}
					</div>
				)}
			</div>
		</div>
	);
}
