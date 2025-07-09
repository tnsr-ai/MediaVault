import { Metadata } from "next";
import { config } from "@/lib/config";
import Signup from "@/components/auth/Signup";

export const metadata: Metadata = {
    title: `${config.app.name} - Sign Up`,
    description: config.app.tagline,
    keywords: ["media", "vault", "personal files", "storage"],
};

export default function SignUpPage() {
    return <Signup />;
}