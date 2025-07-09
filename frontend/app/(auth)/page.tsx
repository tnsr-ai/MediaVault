import { Metadata } from "next";
import Login from "../../components/auth/Login";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `${config.app.name} - Login`,
  description: config.app.tagline,
  keywords: ["media", "vault", "personal files", "storage"],
};

export default function LoginPage() {
  return <Login />;
}
