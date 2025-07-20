"use client";
import AuthHero from "@/components/auth/AuthHero";
import type { ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<main className="flex w-full h-full md:space-x-7">
			{children}
			<AuthHero className="hidden md:block" />
		</main>
	);
}
