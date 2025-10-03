import { FileManagement } from "@/components/console/file-management";
import { FileUpload } from "@/components/console/file-upload";
import { StorageUsageCard } from "@/components/console/storage-usage-card";

export default function VideosPage() {
	const storageData = {
		currentUsageGB: 8,
		totalCapacityGB: 100,
		categories: [{ name: "Videos", percentage: 8, color: "#EF4444" }],
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
