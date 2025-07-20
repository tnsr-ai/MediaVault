import Forgot from "@/components/auth/Forgot";
import { config } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `${config.app.name} - Forgot Password`,
	description: config.app.tagline,
	keywords: ["media", "vault", "personal files", "storage"],
};

export default function ForgotPasswordPage() {
	return <Forgot />;
}
