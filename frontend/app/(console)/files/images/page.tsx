import { FileManagement } from "@/components/console/file-management";
import { FileUpload } from "@/components/console/file-upload";
import { StorageUsageCard } from "@/components/console/storage-usage-card";

export default function ImagesPage() {
	const storageData = {
		currentUsageGB: 20,
		totalCapacityGB: 100,
		categories: [{ name: "Images", percentage: 20, color: "#10B981" }],
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
