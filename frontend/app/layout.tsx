import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunito = Nunito_Sans({
	subsets: ["latin"],
	variable: "--font-nunito",
});

export const metadata: Metadata = {
	title: "MediaVault",
	description: "A media vault for your personal files",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full">
			<body className={`${nunito.variable} antialiased h-full font-sans`}>
				<div className="w-full h-full p-5">{children}</div>
			</body>
		</html>
	);
}
