import { FileManagement } from "@/components/console/file-management";
import { FileUpload } from "@/components/console/file-upload";
import { StorageUsageCard } from "@/components/console/storage-usage-card";

export default function FilesPage() {
	const storageData = {
		currentUsageGB: 45,
		totalCapacityGB: 100,
		categories: [
			{ name: "Documents", percentage: 15, color: "#3B82F6" },
			{ name: "Images", percentage: 20, color: "#10B981" },
			{ name: "Videos", percentage: 8, color: "#EF4444" },
			{ name: "Audio", percentage: 2, color: "#F59E0B" },
		],
	};

	return (
		<div className="space-y-6">
			<StorageUsageCard
				currentUsageGB={storageData.currentUsageGB}
				totalCapacityGB={storageData.totalCapacityGB}
				categories={storageData.categories}
			/>
			<FileUpload expanded={false} />
			<FileManagement />
		</div>
	);
}
