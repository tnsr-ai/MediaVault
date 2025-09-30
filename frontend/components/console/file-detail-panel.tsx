"use client";

import { Button } from "@/components/ui/button";
import {
	Calendar,
	Copy,
	Download,
	Edit3,
	Eye,
	FileText,
	Film,
	FolderOpen,
	HardDrive,
	Image,
	Link,
	Music,
	Pin,
	Play,
	Share,
	Tag,
	Trash2,
	User,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FileItem } from "./types";

// File type icons
const FileTypeIcon = ({
	type,
	size = "large",
}: { type: string; size?: "small" | "large" }) => {
	const sizeClass = size === "large" ? "w-16 h-16" : "w-8 h-8";

	const getFileIcon = (fileType: string) => {
		switch (fileType?.toLowerCase()) {
			case "pdf":
			case "docx":
			case "doc":
			case "txt":
				return { icon: FileText, color: "text-blue-600", bg: "bg-blue-100" };
			case "jpg":
			case "jpeg":
			case "png":
			case "gif":
			case "webp":
			case "svg":
				return { icon: Image, color: "text-green-600", bg: "bg-green-100" };
			case "mp4":
			case "avi":
			case "mov":
			case "webm":
				return { icon: Film, color: "text-purple-600", bg: "bg-purple-100" };
			case "mp3":
			case "wav":
			case "flac":
				return { icon: Music, color: "text-yellow-600", bg: "bg-yellow-100" };
			default:
				return { icon: FileText, color: "text-gray-600", bg: "bg-gray-100" };
		}
	};

	const { icon: Icon, color, bg } = getFileIcon(type);

	return (
		<div
			className={`${sizeClass} ${bg} ${color} rounded-lg flex items-center justify-center`}
		>
			<Icon className="w-3/4 h-3/4" />
		</div>
	);
};

// Format file size
const formatFileSize = (bytes: string) => {
	if (bytes === "—" || !bytes) return "—";
	return bytes;
};

// Format date
const formatDate = (dateString: string) => {
	if (!dateString) return "—";
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

// File preview component
const FilePreview = ({ file }: { file: FileItem }) => {
	if (file.type === "folder") {
		return (
			<div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
				<FolderOpen className="w-16 h-16 text-blue-600" />
			</div>
		);
	}

	if (file.thumbnail) {
		if (
			file.fileType?.toLowerCase().includes("mp4") ||
			file.fileType?.toLowerCase().includes("mov") ||
			file.fileType?.toLowerCase().includes("avi")
		) {
			return (
				<div className="w-full h-48 relative rounded-lg overflow-hidden group">
					<img
						src={file.thumbnail}
						alt={file.name}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
						<div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
							<Play className="w-6 h-6 text-gray-900 ml-1" />
						</div>
					</div>
					{file.duration && (
						<div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
							{file.duration}
						</div>
					)}
				</div>
			);
		}
		return (
			<img
				src={file.thumbnail}
				alt={file.name}
				className="w-full h-48 object-cover rounded-lg"
			/>
		);
	}

	return (
		<div className="w-full h-48 bg-gray-50 rounded-lg flex items-center justify-center">
			<FileTypeIcon type={file.fileType || "unknown"} size="large" />
		</div>
	);
};

// Metadata component for different file types
const FileMetadata = ({ file }: { file: FileItem }) => {
	if (file.type === "folder") {
		return (
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Items</span>
					<span className="font-medium">{file.items || 0}</span>
				</div>
			</div>
		);
	}

	// Image metadata
	if (
		file.fileType &&
		["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
			file.fileType.toLowerCase(),
		)
	) {
		return (
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Dimensions</span>
					<span className="font-medium">1920 × 1080</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Color Space</span>
					<span className="font-medium">sRGB</span>
				</div>
			</div>
		);
	}

	// Video metadata
	if (
		file.fileType &&
		["mp4", "avi", "mov", "webm"].includes(file.fileType.toLowerCase())
	) {
		return (
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Duration</span>
					<span className="font-medium">{file.duration || "—"}</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Resolution</span>
					<span className="font-medium">1920 × 1080</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Frame Rate</span>
					<span className="font-medium">30 fps</span>
				</div>
			</div>
		);
	}

	// Document metadata
	if (
		file.fileType &&
		["pdf", "docx", "doc", "txt"].includes(file.fileType.toLowerCase())
	) {
		return (
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Pages</span>
					<span className="font-medium">24</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Language</span>
					<span className="font-medium">English</span>
				</div>
			</div>
		);
	}

	// Audio metadata
	if (
		file.fileType &&
		["mp3", "wav", "flac"].includes(file.fileType.toLowerCase())
	) {
		return (
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Duration</span>
					<span className="font-medium">3:45</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-gray-500">Bitrate</span>
					<span className="font-medium">320 kbps</span>
				</div>
			</div>
		);
	}

	return null;
};

interface FileDetailPanelProps {
	file: FileItem | null;
	isOpen: boolean;
	onClose: () => void;
}

export function FileDetailPanel({
	file,
	isOpen,
	onClose,
}: FileDetailPanelProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [fileName, setFileName] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus the input when editing starts
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	const handleAction = useCallback(
		(action: string) => {
			console.log(`${action} clicked for:`, file?.name);
			// Handle different actions here
		},
		[file?.name],
	);

	const handleRename = useCallback(() => {
		if (file && fileName.trim()) {
			console.log(`Renaming "${file.name}" to "${fileName}"`);
			setIsEditing(false);
		}
	}, [file, fileName]);

	const handleCopyPath = useCallback(() => {
		if (file?.folder) {
			navigator.clipboard.writeText(`${file.folder}/${file.name}`);
			console.log("Path copied to clipboard");
		}
	}, [file]);

	if (!file || !isOpen) return null;

	return (
		<div
			className={`h-full w-full bg-white overflow-hidden flex flex-col ${
				isOpen ? "flex" : "hidden"
			}`}
		>
			{/* Header */}
			<div className="border-b border-gray-200 p-4">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-gray-900">File Details</h2>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-8 w-8 text-gray-400 hover:text-gray-600"
						aria-label="Close panel"
					>
						<X className="w-4 h-4" />
					</Button>
				</div>

				{/* File Preview */}
				<FilePreview file={file} />

				{/* File Name */}
				<div className="mt-4">
					{isEditing ? (
						<div className="flex items-center gap-2">
							<input
								ref={inputRef}
								type="text"
								value={fileName}
								onChange={(e) => setFileName(e.target.value)}
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								onKeyDown={(e) => {
									if (e.key === "Enter") handleRename();
									if (e.key === "Escape") setIsEditing(false);
								}}
							/>
							<Button
								size="sm"
								onClick={handleRename}
								className="px-3 py-1 text-xs"
							>
								Save
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsEditing(false)}
								className="px-3 py-1 text-xs"
							>
								Cancel
							</Button>
						</div>
					) : (
						<div className="flex items-center justify-between">
							<h3 className="font-medium text-gray-900 truncate pr-2">
								{file.name}
							</h3>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => {
									setFileName(file.name);
									setIsEditing(true);
								}}
								className="h-6 w-6 text-gray-400 hover:text-gray-600"
								aria-label="Rename file"
							>
								<Edit3 className="w-3 h-3" />
							</Button>
						</div>
					)}
					<p className="text-sm text-gray-500">
						{file.fileType?.toUpperCase() || "FOLDER"}
					</p>
				</div>
			</div>

			{/* Actions */}
			<div className="border-b border-gray-200 p-4">
				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleAction("download")}
						className="flex items-center gap-2 justify-center"
					>
						<Download className="w-4 h-4" />
						Download
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleAction("share")}
						className="flex items-center gap-2 justify-center"
					>
						<Share className="w-4 h-4" />
						Share
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleAction("delete")}
						className="flex items-center gap-2 justify-center text-red-600 hover:text-red-700 hover:border-red-300"
					>
						<Trash2 className="w-4 h-4" />
						Delete
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleAction("preview")}
						className="flex items-center gap-2 justify-center"
					>
						<Eye className="w-4 h-4" />
						Preview
					</Button>
				</div>
			</div>

			{/* Details */}
			<div className="flex-1 overflow-y-auto p-4 space-y-6">
				{/* Basic Information */}
				<div>
					<h4 className="text-sm font-semibold text-gray-900 mb-3">
						Information
					</h4>
					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-gray-500 flex items-center gap-2">
								<HardDrive className="w-4 h-4" />
								Size
							</span>
							<span className="font-medium">
								{formatFileSize(file.size || "—")}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-500 flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								Created
							</span>
							<span className="font-medium">
								{formatDate(file.createdDate || file.lastModified)}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-500 flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								Modified
							</span>
							<span className="font-medium">
								{formatDate(file.lastModified)}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-500 flex items-center gap-2">
								<User className="w-4 h-4" />
								Owner
							</span>
							<span className="font-medium">{file.owner || "—"}</span>
						</div>
					</div>
				</div>

				{/* File Type Specific Metadata */}
				<FileMetadata file={file} />

				{/* Location */}
				<div>
					<h4 className="text-sm font-semibold text-gray-900 mb-3">Location</h4>
					<div className="space-y-3">
						<div className="flex justify-between text-sm">
							<span className="text-gray-500 flex items-center gap-2">
								<FolderOpen className="w-4 h-4" />
								Folder
							</span>
							<span className="font-medium truncate ml-2">
								{file.folder || "—"}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-500 flex items-center gap-2">
								<Link className="w-4 h-4" />
								Path
							</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleCopyPath}
								className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
							>
								<Copy className="w-3 h-3 mr-1" />
								Copy
							</Button>
						</div>
					</div>
				</div>

				{/* Tags */}
				<div>
					<h4 className="text-sm font-semibold text-gray-900 mb-3">Tags</h4>
					<div className="flex flex-wrap gap-2">
						{(file.tags || ["work", "important", "draft"]).map(
							(tag: string) => (
								<span
									key={tag}
									className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
								>
									<Tag className="w-3 h-3 mr-1" />
									{tag}
								</span>
							),
						)}
						<Button
							variant="ghost"
							size="sm"
							className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
						>
							+ Add tag
						</Button>
					</div>
				</div>

				{/* Sharing */}
				<div>
					<h4 className="text-sm font-semibold text-gray-900 mb-3">Sharing</h4>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-500">Status</span>
							<span
								className={`font-medium ${
									file.shared ? "text-green-600" : "text-gray-500"
								}`}
							>
								{file.shared ? "Shared" : "Private"}
							</span>
						</div>
						{file.shared && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-500">Shared with</span>
								<span className="font-medium">
									{file.sharedWith || "3 people"}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
