import Signup from "@/components/auth/Signup";
import { config } from "@/lib/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `${config.app.name} - Sign Up`,
	description: config.app.tagline,
	keywords: ["media", "vault", "personal files", "storage"],
};

export default function SignUpPage() {
	return <Signup />;
}
