"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";
import {
	getButtonStyles,
	getInputStyles,
	getLinkStyles,
	theme,
} from "@/lib/theme";
import { Spectral } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const spectral = Spectral({
	weight: ["400"],
	style: ["italic"],
});

// Configuration for verification code input
const CODE_LENGTH = 6;
const CODE_INPUTS = Array.from({ length: CODE_LENGTH }, (_, i) => ({
	id: `code-${i}`,
	key: `verification-input-${i}`,
	index: i,
}));

export default function VerifyEmail() {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
		let value = e.target.value;
		// Remove non-digit characters
		value = value.replace(/\D/g, "");
		e.target.value = value;
		if (value.length === 1) {
			if (idx < CODE_LENGTH - 1 && inputRefs.current[idx + 1]) {
				inputRefs.current[idx + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		idx: number,
	) => {
		// Prevent non-digit keys except Backspace, Tab, Arrow keys
		if (
			!/^[0-9]$/.test(e.key) &&
			e.key !== "Backspace" &&
			e.key !== "Tab" &&
			!e.key.startsWith("Arrow")
		) {
			e.preventDefault();
		}
		if (e.key === "Backspace" && !e.currentTarget.value && idx > 0) {
			inputRefs.current[idx - 1]?.focus();
		}
	};

	return (
		<section className={`${theme.layout.section} my-5 md:my-0`}>
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
						<div className="flex justify-center md:justify-start mb-8">
							<Image
								src={config.app.logo}
								width={100}
								height={100}
								alt={`${config.app.name} Logo`}
							/>
						</div>
						<div className="text-center md:text-start space-y-2 mb-10">
							<p className={theme.typography.heading.primary}>
								{config.forms.verifyEmail.title}
							</p>
							<p className={theme.typography.heading.secondary}>
								{config.forms.verifyEmail.description}
							</p>
						</div>
						<hr
							className="mb-5 md:mb-8 h-[1px] border-t-0"
							style={{ background: theme.colors.ui.border }}
						/>

						<form className={theme.components.form.spacing}>
							<div className={theme.components.form.fieldSpacing}>
								<Label htmlFor="code-0" className={theme.typography.label}>
									{config.forms.verifyEmail.fields.code.label}
								</Label>
								<div className="flex gap-2 justify-center md:justify-start">
									{CODE_INPUTS.map((input) => (
										<Input
											key={input.key}
											id={input.id}
											type="text"
											inputMode="numeric"
											pattern="[0-9]"
											maxLength={1}
											minLength={1}
											autoComplete="one-time-code"
											className={`${getInputStyles()}·text-center·w-10·h-12`}
											required
											ref={(el) => {
												inputRefs.current[input.index] = el;
											}}
											onChange={(e) => handleInput(e, input.index)}
											onKeyDown={(e) => handleKeyDown(e, input.index)}
										/>
									))}
								</div>
							</div>

							<Button
								type="submit"
								className={`w-full h-12 ${getButtonStyles(
									"primary",
								)} font-medium tracking-tight`}
							>
								{config.forms.verifyEmail.submitButtonText}
							</Button>

							<div className="text-center">
								<span
									className={`${theme.colors.ui.text.secondary} tracking-tight`}
								>
									{config.forms.verifyEmail.retryPrompt}{" "}
								</span>
								<Link href="/" className={getLinkStyles()}>
									{config.forms.verifyEmail.retryInText}
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
