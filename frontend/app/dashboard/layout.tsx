import { config } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `${config.app.name} - Dashboard`,
	description: config.app.tagline,
	keywords: ["media", "vault", "personal files", "storage"],
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
