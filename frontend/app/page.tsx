import { Metadata } from "next";
import Login from "../components/auth/Login";
import AuthHero from "../components/auth/AuthHero";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `${config.app.name} - Login`,
  description: config.app.tagline,
  keywords: ["media", "vault", "personal files", "storage"],
};

export default function Home() {
  return (
    <main className="flex w-full h-full md:space-x-7">
      <Login />
      <AuthHero className="hidden md:block" />
    </main>
  );
}
