"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";
import { getButtonStyles, theme } from "@/lib/theme";
import { type TwoFAFormData, twoFASchema } from "@/lib/validations/auth";
import {
	createFormSubmitHandler,
	getInputWithErrorStyles,
} from "@/lib/validations/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AuthBottomLink from "./AuthBottomLink";
import AuthFormLayout from "./AuthFormLayout";

export default function TwoFA() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const _form = useForm<TwoFAFormData>({
		resolver: zodResolver(twoFASchema),
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
	} = useForm<TwoFAFormData>({
		resolver: zodResolver(twoFASchema),
		defaultValues: {
			code: "",
		},
	});
	const codeValue = watch("code");

	const onSubmit = createFormSubmitHandler<TwoFAFormData>(async (data) => {
		// Handle 2FA verification logic here
		console.log("2FA data:", data);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		router.push("/dashboard"); // Navigate to dashboard or main app
	}, setIsLoading);

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
			if (idx < 5 && inputRefs.current[idx + 1]) {
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
		<AuthFormLayout
			title={config.forms.twoFA.title}
			description={config.forms.twoFA.description}
		>
			<form
				className={theme.components.form.spacing}
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className={theme.components.form.fieldSpacing}>
					<Label htmlFor="code-0" className={theme.typography.label}>
						{config.forms.twoFA.fields.code.label}
					</Label>
					<div className="flex gap-2 justify-center md:justify-start">
						{Array.from({ length: 6 }, (_, idx) => {
							const inputId = `code-${idx}`;
							return (
								<Input
									key={inputId}
									id={inputId}
									type="text"
									inputMode="numeric"
									maxLength={1}
									className={`w-12 h-12 text-center text-lg font-medium ${getInputWithErrorStyles(
										errors.code,
									)}`}
									ref={(el: HTMLInputElement | null) => {
										inputRefs.current[idx] = el;
									}}
									value={codeValue?.[idx] || ""}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleInput(e, idx)
									}
									onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
										handleKeyDown(e, idx)
									}
									aria-label={`Digit ${idx + 1} of verification code`}
									aria-invalid={!!errors.code}
									aria-describedby={errors.code ? "code-error" : undefined}
								/>
							);
						})}
					</div>
					<FormError error={errors.code} id="code-error" />
				</div>

				<Button
					type="submit"
					disabled={isLoading}
					className={`w-full h-10 sm:h-12 ${getButtonStyles(
						"primary",
					)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{isLoading ? "Verifying..." : config.forms.twoFA.submitButtonText}
				</Button>

				<AuthBottomLink
					prompt={config.forms.twoFA.signInPrompt}
					linkText={config.forms.twoFA.signInText}
					href="/"
				/>
			</form>
		</AuthFormLayout>
	);
}
