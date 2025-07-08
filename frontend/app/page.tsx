import { Metadata } from "next";
import Login from "../components/auth/Login";
import AuthHero from "../components/auth/AuthHero";

export const metadata: Metadata = {
  title: "MediaVault - Login",
  description: "A media vault for your personal files",
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
