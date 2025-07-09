import { Metadata } from "next";
import { config } from "@/lib/config";
import Forgot from "@/components/auth/Forgot";

export const metadata: Metadata = {
    title: `${config.app.name} - Forgot Password`,
    description: config.app.tagline,
    keywords: ["media", "vault", "personal files", "storage"],
};

export default function ForgotPasswordPage() {
    return <Forgot />;
}