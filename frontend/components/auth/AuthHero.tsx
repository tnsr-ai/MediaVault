"use client";
import AuthHeroWave from "./AuthHeroWave";
import { Spectral } from 'next/font/google'

const spectral = Spectral({
    weight: ['400'],
    style: ['italic'],
});

interface AuthHeroProps {
    className?: string;
}

export default function AuthHero({ className = "" }: AuthHeroProps) {
    return (
        <section className={`flex-2 flex justify-center items-center h-full rounded-3xl relative ${className}`}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-left z-10 w-full max-w-xl px-6">
                <span className={`block text-5xl md:text-6xl text-[#c7dfd4] italic leading-tight tracking-tight ${spectral.className}`}>
                    Start
                </span>
                <span className={`block text-5xl md:text-6xl text-[#c7dfd4] italic leading-tight tracking-tight ${spectral.className}`}>
                    storing what matters,
                </span>
                <span className="block text-4xl md:text-5xl font-extralight text-[#c7dfd4] leading-tight ml-[15%] mt-[2%] tracking-tight">
                    privately and
                </span>
                <span className="block text-4xl md:text-5xl font-extralight text-[#c7dfd4] leading-tight ml-[15%] mt-[8px] tracking-tight">
                    securely
                </span>
            </div>
            <AuthHeroWave
                speed={5}
                scale={0.8}
                color="#10462f"
                noiseIntensity={1.0}
                rotation={60}
            />
        </section>
    );
}
