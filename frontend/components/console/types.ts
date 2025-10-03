// Base file/folder interface
export interface FileItem {
	id: number;
	name: string;
	type: "file" | "folder";
	lastModified: string;
	// File-specific properties
	size?: string;
	fileType?: string;
	thumbnail?: string;
	duration?: string;
	// Folder-specific properties
	items?: number;
	color?: string;
	// Common properties
	owner?: string;
	members?: string[];
	folder?: string;
	createdDate?: string;
	tags?: string[];
	shared?: boolean;
	sharedWith?: string;
}

// Props for file selection callbacks
export type FileSelectCallback = (file: FileItem) => void;

// Sample data type that matches the structure used in the components
export type SampleFileItem = FileItem & {
	// Allow additional properties that might be in sample data
	[key: string]: string | number | boolean | undefined | string[];
};
