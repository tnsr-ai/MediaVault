import UpdatePassword from "@/components/auth/UpdatePassword";
import { config } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `${config.app.name} - Update Password`,
	description: config.app.tagline,
	keywords: ["media", "vault", "personal files", "storage"],
};

export default function UpdatePasswordPage() {
	return <UpdatePassword />;
}
