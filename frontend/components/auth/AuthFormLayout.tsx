"use client";
import { config } from "@/lib/config";
import { theme } from "@/lib/theme";
import { Spectral } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";

const spectral = Spectral({
	weight: ["400"],
	style: ["italic"],
	subsets: ["latin"],
});

interface AuthFormLayoutProps {
	title: string;
	description?: string;
	children: ReactNode;
	showDivider?: boolean;
}

export default function AuthFormLayout({
	title,
	description,
	children,
	showDivider = true,
}: AuthFormLayoutProps) {
	return (
		<section className={`${theme.layout.section} my-3 sm:my-5 md:my-0`}>
			<div className="flex flex-col justify-center w-full h-full items-center">
				{config.features.showBrandName && (
					<div className="w-full justify-center hidden md:flex md:justify-start md:ml-10">
						<p
							className={`block ${theme.typography.brand.logo} ${spectral.className}`}
						>
							{config.app.name}
						</p>
					</div>
				)}
				<div className="flex justify-center items-center w-full h-full px-4 md:px-10">
					<div className={theme.layout.container}>
						<div className="flex justify-center md:justify-start mb-6 sm:mb-8">
							<Image
								src={config.app.logo}
								width={80}
								height={80}
								className="sm:w-[100px] sm:h-[100px]"
								alt={`${config.app.name} Logo`}
							/>
						</div>
						<div className="text-center md:text-start space-y-1 sm:space-y-2 mb-6 sm:mb-8 md:mb-10">
							<p className={theme.typography.heading.primary}>{title}</p>
							{description && (
								<p className={theme.typography.heading.secondary}>
									{description}
								</p>
							)}
						</div>
						{showDivider && (
							<hr
								className="mb-4 sm:mb-5 md:mb-8 h-[1px] border-t-0"
								style={{ background: theme.colors.ui.border }}
							/>
						)}
						{children}
					</div>
				</div>
			</div>
		</section>
	);
}
