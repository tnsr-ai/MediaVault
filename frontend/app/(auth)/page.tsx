import { config } from "@/lib/config";
import type { Metadata } from "next";
import { Suspense } from "react";
import Login from "../../components/auth/Login";

export const metadata: Metadata = {
	title: `${config.app.name} - Login`,
	description: config.app.tagline,
	keywords: ["media", "vault", "personal files", "storage"],
};

export default function LoginPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Login />
		</Suspense>
	);
}
