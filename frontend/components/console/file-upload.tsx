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
		<div
			className={
				hasFiles
					? "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4"
					: ""
			}
		>
			{!hasFiles ? (
				/* Compact Upload UI - No files */
				<div
					className={`
            group relative border-2 border-dashed rounded-lg px-6 py-6 text-center transition-all duration-200 cursor-pointer flex items-center justify-center gap-3
            ${
							isDragActive
								? "border-[#40916c] bg-[#2d6a4f] scale-[1.01]"
								: "border-[#40916c] bg-[#eff4ef] hover:bg-[#e3eae3] hover:border-[#52b788] hover:scale-[1.01]"
						}
          `}
					role="button"
					tabIndex={0}
					onDragEnter={onDragEnter}
					onDragLeave={onDragLeave}
					onDragOver={onDragOver}
					onDrop={onDrop}
					onClick={handleFileInputClick}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							handleFileInputClick();
						}
					}}
					aria-label="Click to select files or drag and drop files here"
				>
					<input
						ref={fileInputRef}
						type="file"
						multiple
						onChange={handleFileInputChange}
						className="hidden"
					/>

					<Upload
						className={`h-5 w-5 transition-colors ${
							isDragActive
								? "text-white"
								: "text-gray-600 group-hover:text-gray-800"
						}`}
					/>

					<p
						className={`text-sm font-medium transition-colors ${
							isDragActive
								? "text-white"
								: "text-gray-600 group-hover:text-gray-800"
						}`}
					>
						Select a File
					</p>
				</div>
			) : (
				/* Full Upload UI - With files */
				<div className="space-y-4">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-gray-900">
								File Upload
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								{activeUploads > 0 && completedFiles > 0
									? `${completedFiles} completed, ${activeUploads} uploading`
									: activeUploads > 0
									  ? `${activeUploads} file${
												activeUploads === 1 ? "" : "s"
										  } uploading`
									  : `${completedFiles} file${
												completedFiles === 1 ? "" : "s"
										  } uploaded`}
							</p>
						</div>
						<div className="flex items-center gap-2">
							{uploadFiles.length > 0 && (
								<button
									type="button"
									onClick={() => setUploadFiles([])}
									className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
								>
									Clear All
								</button>
							)}
						</div>
					</div>

					<div className="flex gap-6 min-h-80">
						{/* Left side - Drag & Drop */}
						<div className="flex-[3] flex items-center justify-center">
							<div
								className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer w-full h-full flex items-center justify-center
                ${
									isDragActive
										? "border-[#15412e] bg-[#e8f5e8] scale-[1.02]"
										: "border-gray-300 hover:border-[#15412e] hover:bg-[#f8fdf8]"
								}
              `}
								role="button"
								tabIndex={0}
								onDragEnter={onDragEnter}
								onDragLeave={onDragLeave}
								onDragOver={onDragOver}
								onDrop={onDrop}
								onClick={handleFileInputClick}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleFileInputClick();
									}
								}}
								aria-label="Click to select more files or drag and drop files here"
							>
								<input
									ref={fileInputRef}
									type="file"
									multiple
									onChange={handleFileInputChange}
									className="hidden"
								/>

								<div className="flex flex-col items-center gap-4">
									<div
										className={`p-3 rounded-full transition-colors ${
											isDragActive ? "bg-[#15412e]" : "bg-gray-100"
										}`}
									>
										<Upload
											className={`h-6 w-6 transition-colors ${
												isDragActive ? "text-white" : "text-gray-500"
											}`}
										/>
									</div>
									<div className="space-y-2">
										<p className="text-base font-medium text-gray-900">
											Drag & drop more files here
										</p>
										<p className="text-sm text-gray-500">
											or{" "}
											<span className="text-[#15412e] hover:text-[#247050] font-medium underline">
												browse from your device
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Right side - Upload Progress */}
						<div className="flex-[2]">
							<div className="bg-gray-50 rounded-lg p-4 min-h-80 max-h-80 overflow-y-auto">
								<div className="space-y-3">
									{uploadFiles.map((uploadFile) => (
										<div
											key={uploadFile.id}
											className="bg-white rounded-lg p-3 border border-gray-200"
										>
											<div className="flex items-start gap-3">
												<div className="flex-shrink-0 mt-0.5">
													{getFileIcon(uploadFile.file.name)}
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between mb-1">
														<p className="text-sm font-medium text-gray-900 truncate">
															{uploadFile.file.name}
														</p>
														<button
															type="button"
															onClick={() => removeFile(uploadFile.id)}
															className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
															aria-label="Remove file"
														>
															<X className="h-3 w-3 text-gray-400" />
														</button>
													</div>
													<p className="text-xs text-gray-500 mb-2">
														{formatFileSize(uploadFile.file.size)}
													</p>

													{/* Progress Bar */}
													<div className="flex items-center gap-2">
														<div className="flex-1 bg-gray-200 rounded-full h-2">
															<div
																className={`h-2 rounded-full transition-all duration-300 ${
																	uploadFile.status === "completed"
																		? "bg-green-500"
																		: uploadFile.status === "error"
																		  ? "bg-red-500"
																		  : "bg-blue-500"
																}`}
																style={{
																	width: `${Math.min(
																		uploadFile.progress,
																		100,
																	)}%`,
																}}
															/>
														</div>
														<div className="flex items-center gap-1">
															{uploadFile.status === "completed" && (
																<CheckCircle className="h-4 w-4 text-green-500" />
															)}
															{uploadFile.status === "error" && (
																<AlertCircle className="h-4 w-4 text-red-500" />
															)}
															<span className="text-xs text-gray-500 min-w-[3ch]">
																{Math.round(uploadFile.progress)}%
															</span>
														</div>
													</div>

													{uploadFile.status === "error" &&
														uploadFile.errorMessage && (
															<p className="text-xs text-red-500 mt-1">
																{uploadFile.errorMessage}
															</p>
														)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
