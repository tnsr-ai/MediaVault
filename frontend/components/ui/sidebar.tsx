"use client";

import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
});
import {
	Activity,
	Archive,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	File,
	FileText,
	Folder,
	Images,
	LayoutDashboard,
	Music,
	Star,
	Users,
	Video,
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{
		name: "My Files",
		href: "/files",
		icon: Folder,
		subItems: [
			{ name: "Documents", href: "/files/documents", icon: FileText },
			{ name: "Images", href: "/files/images", icon: Images },
			{ name: "Videos", href: "/files/videos", icon: Video },
			{ name: "Audio", href: "/files/audio", icon: Music },
			{ name: "Others", href: "/files/others", icon: File },
		],
	},
	{ name: "Shared", href: "/shared", icon: Users },
	{ name: "Recents", href: "/recents", icon: Clock },
	{ name: "Starred", href: "/starred", icon: Star },
	{ name: "Archived", href: "/archived", icon: Archive },
	{ name: "Activity Log", href: "/activity", icon: Activity },
];

export function Sidebar() {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		const savedCollapsed = localStorage.getItem("sidebar-collapsed");
		const savedExpanded = localStorage.getItem("sidebar-expanded-items");

		if (savedCollapsed) {
			setIsCollapsed(JSON.parse(savedCollapsed));
		}

		if (savedExpanded) {
			setExpandedItems(new Set(JSON.parse(savedExpanded)));
		}
	}, []);

	const toggleExpanded = (itemName: string) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(itemName)) {
			newExpanded.delete(itemName);
		} else {
			newExpanded.add(itemName);
		}
		setExpandedItems(newExpanded);
		if (typeof window !== "undefined") {
			localStorage.setItem(
				"sidebar-expanded-items",
				JSON.stringify(Array.from(newExpanded)),
			);
		}
	};

	const toggleCollapsed = () => {
		const newCollapsed = !isCollapsed;
		setIsCollapsed(newCollapsed);
		if (typeof window !== "undefined") {
			localStorage.setItem("sidebar-collapsed", JSON.stringify(newCollapsed));
		}
	};

	return (
		<div
			className={cn(
				"hidden bg-white md:block transition-all duration-300 h-screen overflow-hidden",
				isMounted && isCollapsed ? "w-20" : "w-64",
				inter.className,
			)}
		>
			<div className="flex h-full flex-col gap-2">
				<div
					className={cn(
						"flex h-18 items-center px-4 lg:h-[80px] cursor-pointer hover:bg-muted/50 transition-colors",
						isCollapsed ? "justify-center" : "justify-between",
					)}
					onClick={toggleCollapsed}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							toggleCollapsed();
						}
					}}
					tabIndex={0}
					role="button"
				>
					<Link
						href="/dashboard"
						className={cn(
							"flex items-center gap-3 font-bold text-2xl",
							isCollapsed && "justify-center",
						)}
						onClick={(e) => e.stopPropagation()}
					>
						<NextImage
							src="/dash-icon.svg"
							alt="MediaVault"
							width={48}
							height={48}
							className="h-8 w-8"
						/>
						{isMounted && !isCollapsed && <span>MediaVault</span>}
					</Link>
					{isCollapsed ? (
						<ChevronRight className="h-4 w-4" />
					) : (
						<ChevronLeft className="h-4 w-4" />
					)}
				</div>
				<div className="flex-1">
					<nav className="grid items-start px-3 text-lg font-medium lg:px-5">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							const hasSubItems = "subItems" in item && item.subItems;
							const isExpanded = expandedItems.has(item.name);

							if (hasSubItems) {
								return (
									<div key={item.name} className="space-y-1">
										<button
											type="button"
											onClick={() => toggleExpanded(item.name)}
											className={cn(
												"flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:text-primary w-full",
												isActive &&
													"bg-gradient-to-r from-[#0a1d12] via-[#15412e] to-[#247050] text-white gradient-animate-ready shadow-md hover:text-white animate-gradient-x",
												isCollapsed && "justify-center px-1",
											)}
											title={isCollapsed ? item.name : undefined}
										>
											<item.icon className="h-6 w-6 flex-shrink-0" />
											{!isCollapsed && (
												<>
													<span className="truncate flex-1 text-left">
														{item.name}
													</span>
													{isExpanded ? (
														<ChevronUp className="h-3 w-3" />
													) : (
														<ChevronDown className="h-3 w-3" />
													)}
												</>
											)}
										</button>
										{isMounted && !isCollapsed && (
											<div
												className={cn(
													"ml-4 space-y-1 overflow-hidden transition-all duration-400",
													isExpanded
														? "max-h-96 opacity-100"
														: "max-h-0 opacity-0",
												)}
											>
												{item.subItems.map((subItem) => {
													const isSubActive = pathname === subItem.href;
													return (
														<Link
															key={subItem.name}
															href={subItem.href}
															className={cn(
																"flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:text-primary",
																isSubActive &&
																	"bg-gradient-to-r from-[#0a1d12] via-[#15412e] to-[#247050] text-white animate-gradient-x shadow-md hover:text-white",
															)}
														>
															{subItem.icon && (
																<subItem.icon className="h-5 w-5 flex-shrink-0" />
															)}
															<span className="truncate text-base">
																{subItem.name}
															</span>
														</Link>
													);
												})}
											</div>
										)}
									</div>
								);
							}

							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:text-primary",
										isActive &&
											"bg-gradient-to-r from-[#0a1d12] via-[#15412e] to-[#247050] text-white gradient-animate-ready shadow-md hover:text-white animate-gradient-x",
										isCollapsed && "justify-center px-1",
									)}
									title={isCollapsed ? item.name : undefined}
								>
									<item.icon className="h-6 w-6 flex-shrink-0" />
									{isMounted && !isCollapsed && (
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
