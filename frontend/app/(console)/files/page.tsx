import { FilesTable } from "@/components/console/files-table";
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
		<div>
			<StorageUsageCard
				currentUsageGB={storageData.currentUsageGB}
				totalCapacityGB={storageData.totalCapacityGB}
				categories={storageData.categories}
			/>
		</div>
	);
}
