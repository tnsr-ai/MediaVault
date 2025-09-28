import { FilesTable } from "@/components/console/files-table";

export default function FilesPage() {
	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">My Files</h1>
			<FilesTable />
		</div>
	);
}
