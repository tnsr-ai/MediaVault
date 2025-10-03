import { FileManagement } from "@/components/console/file-management";
import { FileUpload } from "@/components/console/file-upload";
import { StorageUsageCard } from "@/components/console/storage-usage-card";

export default function AudioPage() {
	const storageData = {
		currentUsageGB: 2,
		totalCapacityGB: 100,
		categories: [{ name: "Audio", percentage: 2, color: "#F59E0B" }],
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
