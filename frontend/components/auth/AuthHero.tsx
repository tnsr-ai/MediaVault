"use client";
import AuthHeroWave from "./AuthHeroWave";

export default function AuthHero() {
    return (
        <section className="flex-1 flex justify-center items-center h-full rounded-3xl">
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
