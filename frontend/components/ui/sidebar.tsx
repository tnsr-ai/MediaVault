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
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		const savedExpanded = localStorage.getItem("sidebar-expanded-items");

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

	return (
		<div
			className={cn(
				"hidden bg-white md:block w-64 h-screen overflow-hidden",
				inter.className,
			)}
		>
			<div className="flex h-full flex-col gap-2">
				<div
					className={cn(
						"flex h-18 items-center px-4 lg:h-[80px] justify-between",
					)}
				>
					<Link
						href="/dashboard"
						className={cn("flex items-center gap-3 font-bold text-2xl")}
					>
						<NextImage
							src="/dash-icon.svg"
							alt="MediaVault"
							width={48}
							height={48}
							className="h-8 w-8"
						/>
						{isMounted && <span>MediaVault</span>}
					</Link>
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
										<Link
											href={item.href}
											className={cn(
												"flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all hover:text-primary w-full",
												isActive &&
													"bg-gradient-to-r from-[#0a1d12] via-[#15412e] to-[#247050] text-white gradient-animate-ready shadow-md hover:text-white animate-gradient-x",
											)}
											onClick={(e) => {
												// Only toggle expanded if the click is on the chevron area
												const target = e.target as HTMLElement;
												if (target.closest("svg")) {
													e.preventDefault();
													toggleExpanded(item.name);
												}
											}}
										>
											<item.icon className="h-6 w-6 flex-shrink-0" />
											<>
												<span className="truncate flex-1 text-left">
													{item.name}
												</span>
												<button
													type="button"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														toggleExpanded(item.name);
													}}
													className="p-1 rounded hover:bg-muted-foreground/20"
												>
													{isExpanded ? (
														<ChevronUp className="h-3 w-3" />
													) : (
														<ChevronDown className="h-3 w-3" />
													)}
												</button>
											</>
										</Link>
										{isMounted && (
											<div
												className={cn(
													"ml-4 space-y-1 overflow-hidden transition-all duration-400 relative pl-4",
													isExpanded
														? "max-h-96 opacity-100"
														: "max-h-0 opacity-0",
												)}
											>
												{isExpanded && (
													<div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0a1d12] via-[#15412e] to-[#247050]" />
												)}
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
									)}
								>
									<item.icon className="h-6 w-6 flex-shrink-0" />
									{isMounted && <span className="truncate">{item.name}</span>}
								</Link>
							);
						})}
					</nav>
				</div>
			</div>
		</div>
	);
}
