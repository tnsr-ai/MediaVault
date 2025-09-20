"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export function Sidebar() {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div
			className={cn(
				"hidden border-r bg-muted/40 md:block transition-all duration-300 h-screen overflow-hidden",
				isCollapsed ? "w-16" : "w-64",
			)}
		>
			<div className="flex h-full flex-col gap-2">
				<div
					className={cn(
						"flex h-14 items-center border-b px-4 lg:h-[60px] cursor-pointer hover:bg-muted/50 transition-colors",
						isCollapsed ? "justify-center" : "justify-between",
					)}
					onClick={() => setIsCollapsed(!isCollapsed)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setIsCollapsed(!isCollapsed);
						}
					}}
					tabIndex={0}
					role="button"
				>
					<Link
						href="/dashboard"
						className={cn(
							"flex items-center gap-2 font-semibold",
							isCollapsed && "hidden",
						)}
						onClick={(e) => e.stopPropagation()}
					>
						<LayoutDashboard className="h-6 w-6" />
						<span>MediaVault</span>
					</Link>
					{isCollapsed ? (
						<ChevronRight className="h-4 w-4" />
					) : (
						<ChevronLeft className="h-4 w-4" />
					)}
				</div>
				<div className="flex-1">
					<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
										isActive && "bg-muted text-primary",
										isCollapsed && "justify-center px-2",
									)}
									title={isCollapsed ? item.name : undefined}
								>
									<item.icon className="h-4 w-4 flex-shrink-0" />
									{!isCollapsed && (
										<span className="truncate">{item.name}</span>
									)}
								</Link>
							);
						})}
					</nav>
				</div>
			</div>
		</div>
	);
}
