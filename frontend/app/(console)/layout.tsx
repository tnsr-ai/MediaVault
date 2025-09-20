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
				<main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
