import { FileManagement } from "@/components/console/file-management";
import { FileUpload } from "@/components/console/file-upload";
import { StorageUsageCard } from "@/components/console/storage-usage-card";

export default function DocumentsPage() {
	const storageData = {
		currentUsageGB: 15,
		totalCapacityGB: 100,
		categories: [{ name: "Documents", percentage: 15, color: "#3B82F6" }],
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
