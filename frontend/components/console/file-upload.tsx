"use client";

import {
	AlertCircle,
	CheckCircle,
	ChevronDown,
	File,
	FileText,
	Image,
	Music,
	Upload,
	Video,
	X,
} from "lucide-react";
import React, { useState, useRef, useCallback } from "react";

// Types for file uploads
interface UploadFile {
	id: string;
	file: File;
	progress: number;
	status: "pending" | "uploading" | "completed" | "error";
	errorMessage?: string;
}

// File type detection helper
const getFileIcon = (fileName: string) => {
	const extension = fileName.split(".").pop()?.toLowerCase();

	switch (extension) {
		case "jpg":
		case "jpeg":
		case "png":
		case "gif":
		case "webp":
		case "svg":
			return <Image className="h-4 w-4" />;
		case "mp4":
		case "avi":
		case "mov":
		case "wmv":
		case "flv":
			return <Video className="h-4 w-4" />;
		case "mp3":
		case "wav":
		case "flac":
		case "aac":
			return <Music className="h-4 w-4" />;
		case "pdf":
		case "doc":
		case "docx":
		case "txt":
		case "rtf":
			return <FileText className="h-4 w-4" />;
		default:
			return <File className="h-4 w-4" />;
	}
};

// Format file size helper
const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export function FileUpload() {
	const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([
		// Dummy data for demonstration
		{
			id: "dummy-1",
			file: {
				name: "Social Media Plan 2035.pdf",
				size: 21 * 1024 * 1024,
			} as File,
			progress: 80,
			status: "uploading",
		},
		{
			id: "dummy-2",
			file: {
				name: "Product Teaser Video.mp4",
				size: 8.3 * 1024 * 1024,
			} as File,
			progress: 60,
			status: "uploading",
		},
		{
			id: "dummy-3",
			file: {
				name: "Event Opening Ceremony.jpg",
				size: 5.5 * 1024 * 1024,
			} as File,
			progress: 100,
			status: "completed",
		},
		{
			id: "dummy-4",
			file: {
				name: "Marketing Presentation.pptx",
				size: 12.7 * 1024 * 1024,
			} as File,
			progress: 45,
			status: "uploading",
		},
		{
			id: "dummy-5",
			file: { name: "User Manual.docx", size: 3.2 * 1024 * 1024 } as File,
			progress: 100,
			status: "completed",
		},
		{
			id: "dummy-6",
			file: { name: "Background Music.mp3", size: 7.8 * 1024 * 1024 } as File,
			progress: 30,
			status: "uploading",
		},
		{
			id: "dummy-7",
			file: { name: "Logo Design.png", size: 2.1 * 1024 * 1024 } as File,
			progress: 100,
			status: "completed",
		},
		{
			id: "dummy-8",
			file: { name: "Training Video.avi", size: 45.6 * 1024 * 1024 } as File,
			progress: 25,
			status: "uploading",
		},
		{
			id: "dummy-9",
			file: { name: "Financial Report.xlsx", size: 4.8 * 1024 * 1024 } as File,
			progress: 100,
			status: "completed",
		},
		{
			id: "dummy-10",
			file: { name: "Podcast Episode.wav", size: 18.9 * 1024 * 1024 } as File,
			progress: 70,
			status: "uploading",
		},
	]);
	const [isDragActive, setIsDragActive] = useState(false);
	const [isExpanded, setIsExpanded] = useState(true); // Start expanded to show files
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Only auto-expand when new files are added, not for existing uploads
	React.useEffect(() => {
		const hasActiveUploads = uploadFiles.some(
			(file) => file.status === "pending", // Only auto-expand for new files, not uploading ones
		);
		if (hasActiveUploads && !isExpanded) {
			setIsExpanded(true);
		}
	}, [uploadFiles, isExpanded]);

	const onDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(true);
	}, []);

	const onDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);
	}, []);

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const onDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);

		const files = Array.from(e.dataTransfer.files);
		handleFiles(files);
	}, []);

	const handleFiles = useCallback((files: File[]) => {
		const newUploadFiles: UploadFile[] = files.map((file) => ({
			id: Math.random().toString(36).substring(2, 15),
			file,
			progress: 0,
			status: "pending",
		}));

		setUploadFiles((prev) => [...prev, ...newUploadFiles]);

		// Simulate upload process
		for (const uploadFile of newUploadFiles) {
			simulateUpload(uploadFile.id);
		}
	}, []);

	const simulateUpload = (fileId: string) => {
		setUploadFiles((prev) =>
			prev.map((file) =>
				file.id === fileId ? { ...file, status: "uploading" as const } : file,
			),
		);

		const interval = setInterval(() => {
			setUploadFiles((prev) => {
				const updatedFiles = prev.map((file) => {
					if (file.id === fileId) {
						if (file.progress >= 100) {
							clearInterval(interval);
							return { ...file, progress: 100, status: "completed" as const };
						}
						return { ...file, progress: file.progress + Math.random() * 15 };
					}
					return file;
				});
				return updatedFiles;
			});
		}, 200);
	};

	const handleFileInputClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		handleFiles(files);
		// Reset input value to allow selecting the same file again
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeFile = (fileId: string) => {
		setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
	};

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	const hasFiles = uploadFiles.length > 0;
	const completedFiles = uploadFiles.filter(
		(f) => f.status === "completed",
	).length;
	const activeUploads = uploadFiles.filter(
		(f) => f.status === "uploading" || f.status === "pending",
	).length;

	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-[calc(100vh-12rem)]">
			{/* Header */}
			<div className="p-4 border-b border-gray-100 flex-shrink-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-[#e8f5e8] rounded-lg">
							<Upload className="h-5 w-5 text-[#15412e]" />
						</div>
						<div>
							<h3 className="font-medium text-gray-900">File Upload</h3>
							{hasFiles && (
								<p className="text-xs text-gray-500">
									{completedFiles} completed, {activeUploads} uploading
								</p>
							)}
						</div>
					</div>
					<button
						type="button"
						className="p-1 hover:bg-gray-100 rounded transition-colors"
					>
						<svg
							className="w-4 h-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Upload Area */}
			<div className="p-4 flex-shrink-0">
				<div
					className={`
            relative border-2 border-dashed rounded-lg p-4 text-center transition-colors
            ${
							isDragActive
								? "border-[#15412e] bg-[#e8f5e8]"
								: "border-gray-300 hover:border-[#15412e] hover:bg-[#f8fdf8]"
						}
          `}
					onDragEnter={onDragEnter}
					onDragLeave={onDragLeave}
					onDragOver={onDragOver}
					onDrop={onDrop}
				>
					<input
						ref={fileInputRef}
						type="file"
						multiple
						onChange={handleFileInputChange}
						className="hidden"
					/>

					<div className="flex flex-col items-center gap-2">
						<div
							className={`p-2 rounded-full ${
								isDragActive ? "bg-[#15412e]" : "bg-gray-100"
							}`}
						>
							<Upload
								className={`h-5 w-5 ${
									isDragActive ? "text-white" : "text-gray-500"
								}`}
							/>
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900 mb-1">
								Drag & drop your files here
							</p>
							<p className="text-xs text-gray-500">
								or{" "}
								<button
									type="button"
									onClick={handleFileInputClick}
									className="text-[#15412e] hover:text-[#247050] font-medium underline"
								>
									browse from your device
								</button>
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Upload Progress Section - Always visible when there are files */}
			{hasFiles && (
				<div className="border-t border-gray-100 flex-1 flex flex-col min-h-0">
					<div
						className="p-4 flex-shrink-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-b-lg"
						onClick={toggleExpanded}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								toggleExpanded();
							}
						}}
						tabIndex={0}
						role="button"
					>
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-medium text-gray-900">
								Uploading Files
							</h4>
							<div className="flex items-center gap-2">
								<span className="text-xs text-gray-500">
									{uploadFiles.length} files
								</span>
								<div
									className={`transition-transform duration-300 ease-in-out ${
										isExpanded ? "rotate-180" : ""
									}`}
								>
									<ChevronDown className="h-4 w-4 text-gray-500" />
								</div>
							</div>
						</div>
					</div>

					{/* File list - conditionally rendered based on isExpanded */}
					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out flex-1 ${
							isExpanded ? "opacity-100" : "max-h-0 opacity-0"
						}`}
					>
						<div className="px-4 pb-4 h-full">
							<div className="space-y-3 overflow-y-auto h-full pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
								{uploadFiles.map((uploadFile) => (
									<div
										key={uploadFile.id}
										className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
									>
										<div className="flex-shrink-0 mt-1">
											{uploadFile.file.name.endsWith(".pdf") && (
												<div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
													<FileText className="h-4 w-4 text-red-600" />
												</div>
											)}
											{uploadFile.file.name.endsWith(".mp4") && (
												<div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
													<Video className="h-4 w-4 text-purple-600" />
												</div>
											)}
											{uploadFile.file.name.endsWith(".jpg") && (
												<div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
													<Image className="h-4 w-4 text-green-600" />
												</div>
											)}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between mb-1">
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900 truncate">
														{uploadFile.file.name}
													</p>
													<p className="text-xs text-gray-500 mt-0.5">
														{formatFileSize(uploadFile.file.size)}
													</p>
												</div>
												<div className="flex items-center gap-2 ml-2">
													{uploadFile.status === "completed" && (
														<div className="flex items-center gap-1">
															<CheckCircle className="h-4 w-4 text-[#15412e]" />
															<span className="text-xs text-[#15412e] font-medium">
																Completed
															</span>
														</div>
													)}
													{uploadFile.status === "uploading" && (
														<span className="text-xs text-blue-600 font-medium">
															{Math.round(uploadFile.progress)}%
														</span>
													)}
													{uploadFile.status === "error" && (
														<AlertCircle className="h-4 w-4 text-red-500" />
													)}
													<button
														type="button"
														onClick={() => removeFile(uploadFile.id)}
														className="p-1 hover:bg-gray-100 rounded transition-colors"
													>
														<X className="h-3 w-3 text-gray-400" />
													</button>
												</div>
											</div>

											{uploadFile.status === "uploading" && (
												<div className="mt-2">
													<div className="w-full bg-gray-200 rounded-full h-1.5">
														<div
															className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
															style={{ width: `${uploadFile.progress}%` }}
														/>
													</div>
												</div>
											)}

											{uploadFile.status === "completed" && (
												<div className="mt-2">
													<div className="w-full bg-[#e8f5e8] rounded-full h-1.5">
														<div className="bg-[#15412e] h-1.5 rounded-full w-full" />
													</div>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
