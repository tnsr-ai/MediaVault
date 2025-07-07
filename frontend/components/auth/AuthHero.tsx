"use client";
import AuthHeroWave from "./AuthHeroWave";
import { Spectral } from 'next/font/google'

const spectral = Spectral({
    weight: ['400'],
    style: ['italic'],
});

export default function AuthHero() {
    return (
        <section className="flex-2 flex justify-center items-center h-full rounded-3xl relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-left z-10 w-full max-w-xl px-6">
                <span className={`block text-5xl md:text-6xl italic text-white/90 leading-tight ${spectral.className}`}>
                    Start
                </span>
                <span className={`block text-5xl md:text-6xl italic text-white/90 leading-tight ${spectral.className}`}>
                    storing what matters,
                </span>
                <span className="block text-4xl md:text-5xl font-extralight text-white leading-tight ml-[15%] mt-[2%]">
                    privately and
                </span>
                <span className="block text-4xl md:text-5xl font-extralight text-white leading-tight ml-[15%] mt-[8px]">
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
