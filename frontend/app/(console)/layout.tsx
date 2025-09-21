"use client";

import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
});

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
			<div className={`flex flex-col overflow-hidden ${inter.className}`}>
				<Header />
				<main className="flex-1 overflow-y-auto pt-2 pb-8 px-9 lg:pt-4 lg:pb-10 lg:px-10 bg-[#f6f6f6] rounded-tl-2xl">
					{children}
				</main>
			</div>
		</div>
	);
}
