import { Metadata } from "next";
import { config } from "@/lib/config";
import VerifyEmail from "@/components/auth/VerifyEmail";

export const metadata: Metadata = {
    title: `${config.app.name} - Two-Factor Authentication`,
    description: config.app.tagline,
    keywords: ["media", "vault", "personal files", "storage"],
};

export default function VerifyEmailPage() {
    return <VerifyEmail />;
}