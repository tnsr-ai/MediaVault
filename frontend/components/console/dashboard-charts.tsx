"use client";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

const data = [
	{
		month: "Jan",
		documents: 8,
		spacer1: 0.5,
		images: 10,
		spacer2: 0.5,
		videos: 12,
		spacer3: 0.5,
		audio: 7,
	},
	{
		month: "Feb",
		documents: 9,
		spacer1: 0.5,
		images: 11,
		spacer2: 0.5,
		videos: 11,
		spacer3: 0.5,
		audio: 8,
	},
	{
		month: "Mar",
		documents: 7,
		spacer1: 0.5,
		images: 12,
		spacer2: 0.5,
		videos: 13,
		spacer3: 0.5,
		audio: 6,
	},
	{
		month: "Apr",
		documents: 10,
		spacer1: 0.5,
		images: 9,
		spacer2: 0.5,
		videos: 14,
		spacer3: 0.5,
		audio: 9,
	},
	{
		month: "May",
		documents: 8,
		spacer1: 0.5,
		images: 13,
		spacer2: 0.5,
		videos: 12,
		spacer3: 0.5,
		audio: 8,
	},
	{
		month: "Jun",
		documents: 11,
		spacer1: 0.5,
		images: 10,
		spacer2: 0.5,
		videos: 11,
		spacer3: 0.5,
		audio: 7,
	},
	{
		month: "Jul",
		documents: 9,
		spacer1: 0.5,
		images: 11,
		spacer2: 0.5,
		videos: 13,
		spacer3: 0.5,
		audio: 8,
	},
	{
		month: "Aug",
		documents: 10,
		spacer1: 0.5,
		images: 12,
		spacer2: 0.5,
		videos: 12,
		spacer3: 0.5,
		audio: 9,
	},
];

const fileTypeData = [
	{ name: "Video", value: 24.5, color: "#ec4899" },
	{ name: "Image", value: 18.2, color: "#3b82f6" },
	{ name: "Documents", value: 15.8, color: "#f97316" },
	{ name: "Audio", value: 9.9, color: "#10b981" },
];

export function DashboardCharts() {
	return (
		<div className="grid grid-cols-5 gap-4">
			{/* Data Activity Chart - 3 columns */}
			<div className="col-span-3 bg-white rounded-xl border border-gray-200 p-4">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-medium text-gray-900">Data Activity</h2>
					<div className="relative">
						<select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-6 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent">
							<option>Last 8 Months</option>
							<option>Last 6 Months</option>
							<option>Last 12 Months</option>
						</select>
						<div className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none">
							<svg
								className="w-3 h-3 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							margin={{
								top: 10,
								right: 10,
								left: 10,
								bottom: 5,
							}}
							barSize={12}
						>
							<CartesianGrid
								strokeDasharray="2 2"
								stroke="#f5f5f5"
								vertical={false}
							/>
							<XAxis
								dataKey="month"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#9ca3af", fontSize: 11 }}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: "#9ca3af", fontSize: 11 }}
								domain={[0, 40]}
								ticks={[0, 10, 20, 30, 40]}
								tickFormatter={(value: number) => `${value}GB`}
							/>
							<Bar
								dataKey="documents"
								stackId="a"
								fill="#f97316"
								radius={[10, 10, 10, 10]}
							/>
							<Bar
								dataKey="spacer1"
								stackId="a"
								fill="#ffffff"
								radius={[0, 0, 0, 0]}
							/>
							<Bar
								dataKey="images"
								stackId="a"
								fill="#3b82f6"
								radius={[10, 10, 10, 10]}
							/>
							<Bar
								dataKey="spacer2"
								stackId="a"
								fill="#ffffff"
								radius={[0, 0, 0, 0]}
							/>
							<Bar
								dataKey="videos"
								stackId="a"
								fill="#ec4899"
								radius={[10, 10, 10, 10]}
							/>
							<Bar
								dataKey="spacer3"
								stackId="a"
								fill="#ffffff"
								radius={[0, 0, 0, 0]}
							/>
							<Bar
								dataKey="audio"
								stackId="a"
								fill="#10b981"
								radius={[10, 10, 10, 10]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				<div className="flex items-center justify-center mt-4 space-x-4">
					<div className="flex items-center space-x-1.5">
						<div className="w-2 h-2 bg-orange-500 rounded-full" />
						<span className="text-xs text-gray-600">Documents</span>
					</div>
					<div className="flex items-center space-x-1.5">
						<div className="w-2 h-2 bg-blue-500 rounded-full" />
						<span className="text-xs text-gray-600">Images</span>
					</div>
					<div className="flex items-center space-x-1.5">
						<div className="w-2 h-2 bg-pink-500 rounded-full" />
						<span className="text-xs text-gray-600">Videos</span>
					</div>
					<div className="flex items-center space-x-1.5">
						<div className="w-2 h-2 bg-green-500 rounded-full" />
						<span className="text-xs text-gray-600">Audio</span>
					</div>
				</div>
			</div>

			{/* File Type Card - 2 columns */}
			<div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-medium text-gray-900">File Type</h2>
				</div>

				<div className="relative h-48 flex items-center justify-center">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={fileTypeData}
								cx="50%"
								cy="50%"
								innerRadius={80}
								outerRadius={95}
								paddingAngle={2}
								dataKey="value"
								stroke="none"
								animationBegin={0}
								animationDuration={600}
								animationEasing="ease-out"
							>
								{fileTypeData.map((entry) => (
									<Cell key={`cell-${entry.name}`} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>

					{/* Center content */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<div className="text-2xl font-bold text-gray-900">68.4 GB</div>
						<div className="text-xs text-gray-500">of 100 GB capacity</div>
					</div>
				</div>

				{/* Legend */}
				<div className="flex justify-center mt-4">
					<div className="flex flex-col space-y-2">
						{fileTypeData.map((item) => (
							<div
								key={item.name}
								className="flex items-center justify-center space-x-2"
							>
								<div
									className="w-2.5 h-2.5 rounded-full flex-shrink-0"
									style={{ backgroundColor: item.color }}
								/>
								<span className="text-sm text-gray-700">{item.name}</span>
								<span className="text-sm font-medium text-gray-900">
									{item.value}GB
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
