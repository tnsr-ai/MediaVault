"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid, List, Search } from "lucide-react";
import { useCallback, useState } from "react";
import { FileDetailPanel } from "./file-detail-panel";
import { FilesGrid } from "./files-grid";
import { FilesTable } from "./files-table";
import type { FileItem } from "./types";

interface FileManagementProps {
	title?: string;
}

export function FileManagement({ title = "All Files" }: FileManagementProps) {
	const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
	const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

	const handleFileSelect = useCallback((file: FileItem) => {
		setSelectedFile(file);
		setIsDetailPanelOpen(true);
	}, []);

	const handleClosePanel = useCallback(() => {
		setSelectedFile(null);
		setIsDetailPanelOpen(false);
	}, []);

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
							className="w-full h-12 rounded-full bg-[#ebece6] pl-12 pr-4"
						/>
					</div>

					<div className="flex rounded-full">
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

			<div className="flex h-[calc(100vh-200px)]">
				{/* Main Content Area */}
				<div className="flex-1 overflow-hidden flex flex-col">
					{viewMode === "grid" ? (
						<FilesGrid
							searchQuery={searchQuery}
							onFileSelect={handleFileSelect}
							selectedFileId={selectedFile?.id}
							isDetailPanelOpen={isDetailPanelOpen}
						/>
					) : (
						<FilesTable
							searchQuery={searchQuery}
							onFileSelect={handleFileSelect}
							selectedFileId={selectedFile?.id}
						/>
					)}
				</div>

				{/* File Detail Panel */}
				{isDetailPanelOpen && selectedFile && (
					<div className="w-96 bg-white border-l border-gray-200">
						<FileDetailPanel
							file={selectedFile}
							isOpen={isDetailPanelOpen}
							onClose={handleClosePanel}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
