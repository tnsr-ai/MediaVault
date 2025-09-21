import {
	Clock,
	File,
	Folder,
	Trash2,
	TrendingDown,
	TrendingUp,
} from "lucide-react";

export function DashboardCards() {
	return (
		<div className="grid grid-cols-4 gap-4">
			{/* Total Folders Card */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
				<div className="p-6">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-sm font-medium text-gray-600">Total Folders</h3>
						<div className="p-2 bg-blue-100 rounded-lg">
							<Folder className="h-6 w-6 text-blue-600" />
						</div>
					</div>
					<div className="flex items-end justify-between mb-4">
						<div>
							<p className="text-3xl font-bold text-gray-900">24</p>
							<p className="text-sm text-gray-500">folders</p>
						</div>
					</div>
				</div>
				<div className="border-t border-gray-200" />
				<div className="bg-[#e8f5e8] rounded-b-xl p-6">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-[#15412e]" />
						<span className="text-sm font-medium text-[#15412e]">6%</span>
					</div>
					<p className="text-xs text-[#15412e] mt-1">from last week</p>
				</div>
			</div>

			{/* Total Files Card */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
				<div className="p-6">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-sm font-medium text-gray-600">Total Files</h3>
						<div className="p-2 bg-green-100 rounded-lg">
							<File className="h-6 w-6 text-green-600" />
						</div>
					</div>
					<div className="flex items-end justify-between mb-4">
						<div>
							<p className="text-3xl font-bold text-gray-900">1,234</p>
							<p className="text-sm text-gray-500">files</p>
						</div>
					</div>
				</div>
				<div className="border-t border-gray-200" />
				<div className="bg-[#e8f5e8] rounded-b-xl p-6">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-[#15412e]" />
						<span className="text-sm font-medium text-[#15412e]">12%</span>
					</div>
					<p className="text-xs text-[#15412e] mt-1">from last week</p>
				</div>
			</div>

			{/* Recent Uploads Card */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
				<div className="p-6">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-sm font-medium text-gray-600">
							Recent Uploads
						</h3>
						<div className="p-2 bg-purple-100 rounded-lg">
							<Clock className="h-6 w-6 text-purple-600" />
						</div>
					</div>
					<div className="flex items-end justify-between mb-4">
						<div>
							<p className="text-3xl font-bold text-gray-900">8</p>
							<p className="text-sm text-gray-500">today</p>
						</div>
					</div>
				</div>
				<div className="border-t border-gray-200" />
				<div className="bg-[#e8f5e8] rounded-b-xl p-6">
					<div className="flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-[#15412e]" />
						<span className="text-sm font-medium text-[#15412e]">33%</span>
					</div>
					<p className="text-xs text-[#15412e] mt-1">from yesterday</p>
				</div>
			</div>

			{/* Trash Size Card */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
				<div className="p-6">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-sm font-medium text-gray-600">Trash Size</h3>
						<div className="p-2 bg-red-100 rounded-lg">
							<Trash2 className="h-6 w-6 text-red-600" />
						</div>
					</div>
					<div className="flex items-end justify-between mb-4">
						<div>
							<p className="text-3xl font-bold text-gray-900">156 MB</p>
							<p className="text-sm text-gray-500">in trash</p>
						</div>
					</div>
				</div>
				<div className="border-t border-gray-200" />
				<div className="bg-[#e8f5e8] rounded-b-xl p-6">
					<div className="flex items-center gap-2">
						<TrendingDown className="h-4 w-4 text-red-600" />
						<span className="text-sm font-medium text-[#15412e]">8%</span>
					</div>
					<p className="text-xs text-[#15412e] mt-1">from last week</p>
				</div>
			</div>
		</div>
	);
}
