"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";
import { getButtonStyles, getLinkStyles, theme } from "@/lib/theme";
import {
	type VerifyEmailFormData,
	verifyEmailSchema,
} from "@/lib/validations/auth";
import {
	createFormSubmitHandler,
	getInputWithErrorStyles,
} from "@/lib/validations/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spectral } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

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
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const _form = useForm<VerifyEmailFormData>({
		resolver: zodResolver(verifyEmailSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			code: "",
		},
	});

	const {
		formState: { errors },
		handleSubmit,
		setValue,
		watch,
	} = useForm<VerifyEmailFormData>({
		resolver: zodResolver(verifyEmailSchema),
		defaultValues: {
			code: "",
		},
	});
	const codeValue = watch("code");

	const onSubmit = createFormSubmitHandler<VerifyEmailFormData>(
		async (data) => {
			// Handle email verification logic here
			console.log("Verify email data:", data);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			router.push("/"); // Navigate to login or dashboard
		},
		setIsLoading,
	);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
		let value = e.target.value;
		// Remove non-digit characters
		value = value.replace(/\D/g, "");
		e.target.value = value;

		// Update the form field with the complete code
		const currentCode = codeValue || "";
		const newCode =
			currentCode.substring(0, idx) + value + currentCode.substring(idx + 1);
		setValue("code", newCode.substring(0, 6));

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
		if (e.key === "Backspace") {
			if (!e.currentTarget.value && idx > 0) {
				inputRefs.current[idx - 1]?.focus();
			}
			// Clear the digit from the code
			const currentCode = codeValue || "";
			const newCode =
				currentCode.substring(0, idx) + currentCode.substring(idx + 1);
			setValue("code", newCode);
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

						<form
							className={theme.components.form.spacing}
							onSubmit={handleSubmit(onSubmit)}
						>
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
											maxLength={1}
											className={`w-12 h-12 text-center text-lg font-medium ${getInputWithErrorStyles(
												errors.code,
											)}`}
											ref={(el: HTMLInputElement | null) => {
												inputRefs.current[input.index] = el;
											}}
											value={codeValue?.[input.index] || ""}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												handleInput(e, input.index)
											}
											onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
												handleKeyDown(e, input.index)
											}
											aria-label={`Digit ${
												input.index + 1
											} of verification code`}
											aria-invalid={!!errors.code}
											aria-describedby={errors.code ? "code-error" : undefined}
										/>
									))}
								</div>
								<FormError error={errors.code} id="code-error" />
							</div>

							<Button
								type="submit"
								disabled={isLoading}
								className={`w-full h-12 ${getButtonStyles(
									"primary",
								)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								{isLoading
									? "Verifying..."
									: config.forms.verifyEmail.submitButtonText}
							</Button>

							<div className="text-center">
								<span
									className={`${theme.colors.ui.text.secondary} tracking-tight`}
								>
									{config.forms.verifyEmail.retryPrompt}{" "}
								</span>
								<button
									type="button"
									className={getLinkStyles()}
									onClick={() => {
										// Handle resend verification email logic here
										console.log("Resending verification email...");
									}}
								>
									{config.forms.verifyEmail.retryInText}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
