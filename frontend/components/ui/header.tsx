"use client";

import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import NextImage from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
	const pathname = usePathname();

	const getPageName = () => {
		if (pathname === "/dashboard") return "Dashboard";
		if (pathname.startsWith("/files")) return "My Files";
		if (pathname === "/shared") return "Shared";
		if (pathname === "/recents") return "Recents";
		if (pathname === "/starred") return "Starred";
		if (pathname === "/archived") return "Archived";
		if (pathname === "/activity") return "Activity Log";
		return "Dashboard";
	};

	return (
		<header className="sticky top-0 z-50 w-full bg-white">
			<div className="flex h-20 items-center px-4">
				<div className="flex-1">
					<h1 className="text-2xl font-bold">{getPageName()}</h1>
				</div>

				<div className="flex-1 flex justify-center">
					<div className="relative w-full max-w-lg">
						<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search in MediaVault"
							className="w-full h-12 rounded-full bg-[#f6f6f6] border-none pl-12 pr-4"
						/>
					</div>
				</div>

				<div className="flex-1 flex justify-end items-center gap-3">
					<div className="relative h-10 w-10">
						<div className="absolute inset-0 bg-[#e8f5e8] rounded-full flex items-center justify-center">
							<Bell className="h-5 w-5 text-[#15412e]" />
						</div>
					</div>
					<div className="relative h-10 w-10">
						<div className="absolute inset-0 bg-[#e8f5e8] rounded-full flex items-center justify-center">
							<span className="text-[#15412e] font-semibold">JD</span>
						</div>
					</div>
					<span className="font-medium">John Doe</span>
				</div>
			</div>
		</header>
	);
}
