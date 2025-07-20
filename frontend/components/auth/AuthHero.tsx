"use client";
import { config } from "@/lib/config";
import { theme } from "@/lib/theme";
import { Spectral } from "next/font/google";
import AuthHeroWave from "./AuthHeroWave";

const spectral = Spectral({
	weight: ["400"],
	style: ["italic"],
});

interface AuthHeroProps {
	className?: string;
}

export default function AuthHero({ className = "" }: AuthHeroProps) {
	return (
		<section className={`${theme.layout.heroSection} ${className}`}>
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-left z-10 w-full max-w-xl px-6">
				{config.hero.title.map((line, _index) => (
					<span
						key={`title-${line}`}
						className={`block ${theme.typography.brand.hero} ${spectral.className}`}
					>
						{line}
					</span>
				))}
				{config.hero.subtitle.map((line, index) => (
					<span
						key={`subtitle-${line}`}
						className={`block ${
							theme.typography.brand.heroSecondary
						} ml-[15%] ${index === 0 ? "mt-[2%]" : "mt-[8px]"}`}
					>
						{line}
					</span>
				))}
			</div>
			<AuthHeroWave
				speed={config.waveAnimation.speed}
				scale={config.waveAnimation.scale}
				color={theme.colors.brand.primary}
				noiseIntensity={config.waveAnimation.noiseIntensity}
				rotation={config.waveAnimation.rotation}
			/>
		</section>
	);
}
