import ForgotPasswordConfirm from "@/components/auth/ForgotPasswordConfirm";
import { config } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `${config.app.name} - Reset Password`,
	description: config.app.tagline,
	keywords: ["media", "vault", "personal files", "storage"],
};

export default function ForgotPasswordConfirmPage() {
	return <ForgotPasswordConfirm />;
}
