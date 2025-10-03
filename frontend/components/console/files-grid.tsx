"use client";

import {
	Copy,
	Edit3,
	FileText,
	Film,
	Folder,
	Image,
	Info,
	Music,
	Play,
	Scissors,
	Share,
	Trash2,
	Type,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FileItem, FileSelectCallback } from "./types";

interface FilesGridProps {
	searchQuery?: string;
	onFileSelect?: FileSelectCallback;
	onFileOpen?: (file: FileItem) => void;
	onContextMenuAction?: (action: string, item: FileItem) => void;
	selectedFileId?: number | null;
	isDetailPanelOpen?: boolean;
}

// High-resolution folder icon with depth effects
const FolderIcon = ({
	color = "blue",
	size = "large",
}: { color?: string; size?: "small" | "large" }) => {
	const sizeClass = size === "large" ? "w-full h-full" : "w-8 h-8";

	const getColorGradient = (folderColor: string) => {
		switch (folderColor) {
			case "blue":
				return "from-blue-400 to-blue-600";
			case "green":
				return "from-green-400 to-green-600";
			case "purple":
				return "from-purple-400 to-purple-600";
			case "orange":
				return "from-orange-400 to-orange-600";
			case "red":
				return "from-red-400 to-red-600";
			case "yellow":
				return "from-yellow-400 to-yellow-600";
			default:
				return "from-blue-400 to-blue-600";
		}
	};

	return (
		<div className={`${sizeClass} relative`} style={{ aspectRatio: "5/4" }}>
			<div
				className={`absolute inset-0 bg-gradient-to-br ${getColorGradient(
					color,
				)} rounded-lg shadow-lg transform transition-transform hover:scale-105`}
			>
				<Folder className="absolute inset-0 m-auto w-3/4 h-3/4 text-white drop-shadow-md" />
			</div>
			<div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 rounded-lg transition-opacity" />
		</div>
	);
};

// File type icon with enhanced design
const FileIcon = ({
	type,
	size = "large",
}: { type: string; size?: "small" | "large" }) => {
	const sizeClass = size === "large" ? "w-full h-full" : "w-8 h-8";

	const getFileIcon = (fileType: string) => {
		switch (fileType.toLowerCase()) {
			case "pdf":
				return { icon: FileText, gradient: "from-red-400 to-red-600" };
			case "docx":
			case "doc":
				return { icon: FileText, gradient: "from-blue-400 to-blue-600" };
			case "txt":
				return { icon: FileText, gradient: "from-gray-400 to-gray-600" };
			case "jpg":
			case "jpeg":
			case "png":
			case "gif":
			case "webp":
			case "svg":
				return { icon: Image, gradient: "from-green-400 to-green-600" };
			case "mp4":
			case "avi":
			case "mov":
			case "webm":
				return { icon: Film, gradient: "from-purple-400 to-purple-600" };
			case "mp3":
			case "wav":
			case "flac":
				return { icon: Music, gradient: "from-yellow-400 to-yellow-600" };
			default:
				return { icon: FileText, gradient: "from-gray-400 to-gray-600" };
		}
	};

	const { icon: Icon, gradient } = getFileIcon(type);

	return (
		<div className={`${sizeClass} relative`} style={{ aspectRatio: "5/4" }}>
			<div
				className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-lg shadow-md`}
			>
				<Icon className="absolute inset-0 m-auto w-3/4 h-3/4 text-white drop-shadow-md" />
			</div>
		</div>
	);
};

// Image thumbnail component
const ImageThumbnail = ({ src, alt }: { src: string; alt: string }) => (
	<div
		className="w-full h-full relative overflow-hidden rounded-lg"
		style={{ aspectRatio: "5/4" }}
	>
		<img
			src={src}
			alt={alt}
			className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
			loading="lazy"
			style={{ objectPosition: "center" }}
		/>
		<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
	</div>
);

// Video thumbnail component with duration overlay
const VideoThumbnail = ({
	src,
	alt,
	duration,
}: { src: string; alt: string; duration: string }) => (
	<div
		className="w-full h-full relative overflow-hidden rounded-lg group"
		style={{ aspectRatio: "5/4" }}
	>
		<img
			src={src}
			alt={alt}
			className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
			loading="lazy"
			style={{ objectPosition: "center" }}
		/>
		<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
			<div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
				<Play className="w-6 h-6 text-gray-900 ml-1" />
			</div>
		</div>
		<div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
			{duration}
		</div>
	</div>
);

// Context menu component
const ContextMenu = ({
	x,
	y,
	onClose,
	onAction,
	item,
}: {
	x: number;
	y: number;
	onClose: () => void;
	onAction: (action: string, item: FileItem) => void;
	item: FileItem;
}) => {
	const menuRef = useRef<HTMLDivElement>(null);

	// Close the menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [onClose]);

	const handleActionClick = (action: string) => {
		onAction(action, item);
		onClose();
	};

	return (
		<div
			ref={menuRef}
			className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[180px]"
			style={{ left: x, top: y }}
		>
			<button
				type="button"
				className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
				onClick={() => handleActionClick("copy")}
			>
				<Copy className="w-4 h-4" />
				Copy
			</button>
			<button
				type="button"
				className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
				onClick={() => handleActionClick("cut")}
			>
				<Scissors className="w-4 h-4" />
				Cut
			</button>
			<button
				type="button"
				className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
				onClick={() => handleActionClick("paste")}
			>
				<Type className="w-4 h-4" />
				Paste
			</button>
			<div className="border-t border-gray-200 my-1" />
			<button
				type="button"
				className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
				onClick={() => handleActionClick("rename")}
			>
				<Edit3 className="w-4 h-4" />
				Rename
			</button>
			<button
				type="button"
				className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
				onClick={() => handleActionClick("delete")}
			>
				<Trash2 className="w-4 h-4 text-red-600" />
				Delete
			</button>
			<div className="border-t border-gray-200 my-1" />
			<button
				type="button"
				className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
				onClick={() => handleActionClick("share")}
			>
				<Share className="w-4 h-4" />
				Share
			</button>
			<button
				type="button"
				className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
				onClick={() => handleActionClick("info")}
			>
				<Info className="w-4 h-4" />
				File information
			</button>
		</div>
	);
};

// Grid item component with enhanced design
const GridItem = ({
	item,
	onSelect,
	onOpen,
	isSelected,
	onContextMenuAction,
}: {
	item: FileItem;
	onSelect: FileSelectCallback;
	onOpen?: (file: FileItem) => void;
	isSelected: boolean;
	onContextMenuAction?: (action: string, item: FileItem) => void;
}) => {
	const [showActions, setShowActions] = useState(false);
	const [contextMenu, setContextMenu] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastClickTimeRef = useRef<number>(0);

	const handleAction = useCallback(
		(action: string, e: React.MouseEvent) => {
			e.stopPropagation();
			console.log(`${action} clicked for ${item.name}`);
			// Handle different actions here
		},
		[item.name],
	);

	const handleClick = useCallback(() => {
		const now = Date.now();
		const timeSinceLastClick = now - lastClickTimeRef.current;

		// Clear any existing timeout
		if (clickTimeoutRef.current) {
			clearTimeout(clickTimeoutRef.current);
			clickTimeoutRef.current = null;
		}

		// Check if this is a double click (within 300ms)
		if (timeSinceLastClick < 300) {
			// This is a double click - open the file/folder
			if (onOpen) {
				onOpen(item);
			} else {
				console.log(`Opening ${item.name} (${item.type})`);
			}
		} else {
			// This might be a single click - wait to see if a second click follows
			clickTimeoutRef.current = setTimeout(() => {
				// No second click came in time, so treat as single click
				onSelect(item);
			}, 300);
		}

		lastClickTimeRef.current = now;
	}, [item, onSelect, onOpen]);

	const handleContextMenu = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setContextMenu({ x: e.clientX, y: e.clientY });
	}, []);

	const handleContextMenuClose = useCallback(() => {
		setContextMenu(null);
	}, []);

	const handleContextMenuAction = useCallback(
		(action: string) => {
			if (onContextMenuAction) {
				onContextMenuAction(action, item);
			} else {
				console.log(`${action} action for ${item.name}`);
			}
		},
		[item, onContextMenuAction],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				// Enter key should open the file/folder
				if (onOpen) {
					onOpen(item);
				} else {
					console.log(`Opening ${item.name} (${item.type})`);
				}
			} else if (e.key === " ") {
				e.preventDefault();
				// Space key should select the file/folder
				onSelect(item);
			}
		},
		[item, onSelect, onOpen],
	);

	const renderThumbnail = () => {
		if (item.type === "folder") {
			return <FolderIcon color={item.color} size="large" />;
		}

		if (item.thumbnail) {
			if (
				item.fileType?.toLowerCase().includes("mp4") ||
				item.fileType?.toLowerCase().includes("mov") ||
				item.fileType?.toLowerCase().includes("avi")
			) {
				return (
					<VideoThumbnail
						src={item.thumbnail}
						alt={item.name}
						duration={item.duration || ""}
					/>
				);
			}
			return <ImageThumbnail src={item.thumbnail} alt={item.name} />;
		}

		return <FileIcon type={item.fileType || "unknown"} size="large" />;
	};

	return (
		<>
			<div
				className={`group relative cursor-pointer transform transition-all duration-200 hover:scale-[1.02] ${
					isSelected ? "ring-2 ring-[#247050] ring-offset-2" : ""
				}`}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				onContextMenu={handleContextMenu}
				onMouseEnter={() => setShowActions(true)}
				onMouseLeave={() => setShowActions(false)}
				tabIndex={0}
				role="button"
				aria-label={`Select ${item.name}`}
			>
				<div className="aspect-square bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
					<div className="p-4 h-full flex flex-col">
						<div className="flex-1 flex items-center justify-center mb-3">
							{renderThumbnail()}
						</div>
						<div className="space-y-1">
							<h3 className="text-sm font-medium text-gray-900 truncate leading-tight">
								{item.name}
							</h3>
							<p className="text-xs text-gray-500">
								{item.type === "folder" ? `${item.items} items` : item.size}
							</p>
						</div>
					</div>
				</div>
			</div>
			{contextMenu && (
				<ContextMenu
					x={contextMenu.x}
					y={contextMenu.y}
					onClose={handleContextMenuClose}
					onAction={handleContextMenuAction}
					item={item}
				/>
			)}
		</>
	);
};

// Enhanced pagination component
const Pagination = ({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onPrevious,
	onNext,
}: {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onPrevious: () => void;
	onNext: () => void;
}) => {
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

	return (
		<div className="flex items-center justify-between px-6 py-4 bg-white">
			<div className="flex items-center gap-2 text-sm text-gray-600">
				<span>
					Showing {startIndex + 1} to {endIndex} of {totalItems} items
				</span>
			</div>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onPrevious}
					disabled={currentPage === 1}
					className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
						currentPage === 1
							? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
							: "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
					}`}
					aria-label="Previous page"
				>
					Previous
				</button>

				<div className="flex items-center gap-1">
					{Array.from({ length: totalPages }, (_, i) => i + 1)
						.filter((page) => {
							if (page === 1 || page === totalPages) return true;
							if (Math.abs(page - currentPage) <= 2) return true;
							return false;
						})
						.map((page, index, array) => {
							const prevPage = array[index - 1];
							const showEllipsis = prevPage && page - prevPage > 1;

							return (
								<div key={page} className="flex items-center">
									{showEllipsis && (
										<span className="px-2 text-sm text-gray-400">...</span>
									)}
									<button
										type="button"
										onClick={() => onPageChange(page)}
										className={`px-3 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
											currentPage === page
												? "border-[#247050] bg-[#e8f5ee] text-[#10462f] shadow-sm"
												: "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
										}`}
										aria-label={`Go to page ${page}`}
										aria-current={currentPage === page ? "page" : undefined}
									>
										{page}
									</button>
								</div>
							);
						})}
				</div>

				<button
					type="button"
					onClick={onNext}
					disabled={currentPage === totalPages}
					className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-200 ${
						currentPage === totalPages
							? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
							: "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
					}`}
					aria-label="Next page"
				>
					Next
				</button>
			</div>
		</div>
	);
};

// Comprehensive sample data with realistic thumbnails
const sampleItems: FileItem[] = [
	// Folders
	{
		id: 1,
		name: "Documents",
		type: "folder",
		items: 24,
		lastModified: "Sep 28, 2025",
		color: "blue",
	},
	{
		id: 2,
		name: "Images",
		type: "folder",
		items: 156,
		lastModified: "Sep 27, 2025",
		color: "green",
	},
	{
		id: 3,
		name: "Videos",
		type: "folder",
		items: 12,
		lastModified: "Sep 26, 2025",
		color: "purple",
	},
	{
		id: 4,
		name: "Projects",
		type: "folder",
		items: 8,
		lastModified: "Sep 25, 2025",
		color: "orange",
	},
	{
		id: 5,
		name: "Marketing Assets",
		type: "folder",
		items: 34,
		lastModified: "Sep 24, 2025",
		color: "red",
	},
	{
		id: 6,
		name: "Archives",
		type: "folder",
		items: 5,
		lastModified: "Sep 22, 2025",
		color: "yellow",
	},

	// Images with thumbnails
	{
		id: 7,
		name: "sunset-landscape.jpg",
		type: "file",
		size: "4.2 MB",
		lastModified: "Sep 20, 2025",
		fileType: "jpg",
		thumbnail: "https://picsum.photos/seed/sunset/400/400.jpg",
	},
	{
		id: 8,
		name: "team-photo.png",
		type: "file",
		size: "2.8 MB",
		lastModified: "Sep 19, 2025",
		fileType: "png",
		thumbnail: "https://picsum.photos/seed/team/400/400.jpg",
	},
	{
		id: 9,
		name: "product-mockup.webp",
		type: "file",
		size: "1.5 MB",
		lastModified: "Sep 18, 2025",
		fileType: "webp",
		thumbnail: "https://picsum.photos/seed/product/400/400.jpg",
	},
	{
		id: 10,
		name: "logo-design.svg",
		type: "file",
		size: "245 KB",
		lastModified: "Sep 17, 2025",
		fileType: "svg",
		thumbnail: "https://picsum.photos/seed/logo/400/400.jpg",
	},
	{
		id: 11,
		name: "architecture-shot.jpg",
		type: "file",
		size: "6.7 MB",
		lastModified: "Sep 16, 2025",
		fileType: "jpg",
		thumbnail: "https://picsum.photos/seed/architecture/400/400.jpg",
	},
	{
		id: 12,
		name: "nature-photography.png",
		type: "file",
		size: "3.1 MB",
		lastModified: "Sep 15, 2025",
		fileType: "png",
		thumbnail: "https://picsum.photos/seed/nature/400/400.jpg",
	},

	// Videos with thumbnails and duration
	{
		id: 13,
		name: "product-demo.mp4",
		type: "file",
		size: "45.2 MB",
		lastModified: "Sep 22, 2025",
		fileType: "mp4",
		duration: "2:34",
		thumbnail: "https://picsum.photos/seed/demo/400/400.jpg",
	},
	{
		id: 14,
		name: "tutorial-video.mov",
		type: "file",
		size: "128.6 MB",
		lastModified: "Sep 21, 2025",
		fileType: "mov",
		duration: "15:42",
		thumbnail: "https://picsum.photos/seed/tutorial/400/400.jpg",
	},
	{
		id: 15,
		name: "meeting-recording.mp4",
		type: "file",
		size: "89.1 MB",
		lastModified: "Sep 20, 2025",
		fileType: "mp4",
		duration: "45:18",
		thumbnail: "https://picsum.photos/seed/meeting/400/400.jpg",
	},

	// Documents
	{
		id: 16,
		name: "annual-report-2025.pdf",
		type: "file",
		size: "8.4 MB",
		lastModified: "Sep 25, 2025",
		fileType: "pdf",
	},
	{
		id: 17,
		name: "project-proposal.docx",
		type: "file",
		size: "1.2 MB",
		lastModified: "Sep 24, 2025",
		fileType: "docx",
	},
	{
		id: 18,
		name: "meeting-notes.txt",
		type: "file",
		size: "45 KB",
		lastModified: "Sep 23, 2025",
		fileType: "txt",
	},
	{
		id: 19,
		name: "financial-analysis.xlsx",
		type: "file",
		size: "3.7 MB",
		lastModified: "Sep 22, 2025",
		fileType: "xlsx",
	},
	{
		id: 20,
		name: "presentation-slides.pptx",
		type: "file",
		size: "12.3 MB",
		lastModified: "Sep 21, 2025",
		fileType: "pptx",
	},

	// More images
	{
		id: 21,
		name: "urban-photography.jpg",
		type: "file",
		size: "5.6 MB",
		lastModified: "Sep 19, 2025",
		fileType: "jpg",
		thumbnail: "https://picsum.photos/seed/urban/400/400.jpg",
	},
	{
		id: 22,
		name: "portrait-session.png",
		type: "file",
		size: "4.1 MB",
		lastModified: "Sep 18, 2025",
		fileType: "png",
		thumbnail: "https://picsum.photos/seed/portrait/400/400.jpg",
	},
	{
		id: 23,
		name: "food-photography.jpg",
		type: "file",
		size: "3.9 MB",
		lastModified: "Sep 17, 2025",
		fileType: "jpg",
		thumbnail: "https://picsum.photos/seed/food/400/400.jpg",
	},
	{
		id: 24,
		name: "travel-memories.webp",
		type: "file",
		size: "7.2 MB",
		lastModified: "Sep 16, 2025",
		fileType: "webp",
		thumbnail: "https://picsum.photos/seed/travel/400/400.jpg",
	},
];

export function FilesGrid({
	searchQuery = "",
	onFileSelect,
	onFileOpen,
	onContextMenuAction,
	selectedFileId,
	isDetailPanelOpen = false,
}: FilesGridProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	// Filter items based on search query
	const filteredItems = sampleItems.filter((item) =>
		item.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Pagination logic
	const totalItems = filteredItems.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedItems = filteredItems.slice(startIndex, endIndex);

	const handlePageChange = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const handlePrevious = useCallback(() => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	}, [currentPage]);

	const handleNext = useCallback(() => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	}, [currentPage, totalPages]);

	const handleSelect = useCallback(
		(item: FileItem) => {
			if (onFileSelect) {
				onFileSelect(item);
			}
		},
		[onFileSelect],
	);

	// Reset to first page when search query changes
	if (searchQuery && currentPage !== 1) {
		setCurrentPage(1);
	}

	return (
		<div className="w-full rounded-lg flex flex-col h-full">
			{/* Responsive grid layout */}
			<div className="flex-1 overflow-y-auto scrollbar-hide">
				<div
					className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 ${
						isDetailPanelOpen && selectedFileId
							? "lg:grid-cols-4 xl:grid-cols-4"
							: "lg:grid-cols-5 xl:grid-cols-5"
					}`}
				>
					{paginatedItems.map((item) => (
						<GridItem
							key={item.id}
							item={item}
							onSelect={handleSelect}
							onOpen={onFileOpen}
							onContextMenuAction={onContextMenuAction}
							isSelected={selectedFileId === item.id}
						/>
					))}
				</div>

				{/* Empty state */}
				{filteredItems.length === 0 && (
					<div className="flex flex-col items-center justify-center py-16 px-4">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
							<FileText className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No items found
						</h3>
						<p className="text-gray-500 text-center">
							{searchQuery
								? `No items match "${searchQuery}". Try a different search term.`
								: "No items available. Upload some files to get started."}
						</p>
					</div>
				)}
			</div>

			{/* Pagination - Always visible at bottom */}
			<div className="flex-shrink-0 rounded-2xl overflow-hidden">
				{totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						totalItems={totalItems}
						itemsPerPage={itemsPerPage}
						onPageChange={handlePageChange}
						onPrevious={handlePrevious}
						onNext={handleNext}
					/>
				)}
			</div>
		</div>
	);
}
