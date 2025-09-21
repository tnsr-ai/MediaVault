import { FileImage, FileText, Film, Music } from "lucide-react";

export function DashboardCards() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{/* Documents Card */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-medium text-gray-700">Documents</h3>
					<div className="p-1.5 bg-orange-50 rounded">
						<FileText className="h-4 w-4 text-orange-600" />
					</div>
				</div>
				<div>
					<p className="text-2xl font-bold text-gray-900">89</p>
					<p className="text-xs text-gray-500">documents</p>
				</div>
			</div>

			{/* Images Card */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-medium text-gray-700">Images</h3>
					<div className="p-1.5 bg-purple-50 rounded">
						<FileImage className="h-4 w-4 text-purple-600" />
					</div>
				</div>
				<div>
					<p className="text-2xl font-bold text-gray-900">456</p>
					<p className="text-xs text-gray-500">images</p>
				</div>
			</div>

			{/* Videos Card */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-medium text-gray-700">Videos</h3>
					<div className="p-1.5 bg-red-50 rounded">
						<Film className="h-4 w-4 text-red-600" />
					</div>
				</div>
				<div>
					<p className="text-2xl font-bold text-gray-900">23</p>
					<p className="text-xs text-gray-500">videos</p>
				</div>
			</div>

			{/* Audio Card */}
			<div className="bg-white rounded-lg border border-gray-200 p-4">
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-medium text-gray-700">Audio</h3>
					<div className="p-1.5 bg-cyan-50 rounded">
						<Music className="h-4 w-4 text-cyan-600" />
					</div>
				</div>
				<div>
					<p className="text-2xl font-bold text-gray-900">156</p>
					<p className="text-xs text-gray-500">audio files</p>
				</div>
			</div>
		</div>
	);
}
