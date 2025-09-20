"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, User } from "lucide-react";

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full bg-white">
			<div className="flex h-20 items-center px-4">
				<div className="mr-4 flex">
					<div className="mr-4 hidden md:flex">
						<div className="relative flex-1 md:grow-0">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search..."
								className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none">
						<Button variant="outline" className="mr-2 h-8 w-8 p-0 md:hidden">
							<Search className="h-4 w-4" />
							<span className="sr-only">Search</span>
						</Button>
					</div>
					<nav className="flex items-center">
						<Button variant="ghost" size="icon" className="mr-2 h-8 w-8">
							<Bell className="h-4 w-4" />
							<span className="sr-only">Notifications</span>
						</Button>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<User className="h-4 w-4" />
							<span className="sr-only">User menu</span>
						</Button>
					</nav>
				</div>
			</div>
		</header>
	);
}
