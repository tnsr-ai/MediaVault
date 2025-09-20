"use client";

import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className="fixed inset-0 grid overflow-hidden"
			style={{ gridTemplateColumns: "auto 1fr" }}
		>
			<Sidebar />
			<div className="flex flex-col overflow-hidden">
				<Header />
				<main className="flex-1 overflow-y-auto pt-6 pb-8 px-5 lg:pt-8 lg:pb-10 lg:px-7 bg-[#f6f6f6] rounded-tl-2xl">
					{children}
				</main>
			</div>
		</div>
	);
}
