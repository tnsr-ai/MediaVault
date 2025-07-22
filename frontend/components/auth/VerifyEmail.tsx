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
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AuthBottomLink from "./AuthBottomLink";
import AuthFormLayout from "./AuthFormLayout";

// Configuration for verification code input
const CODE_LENGTH = 6;
const CODE_INPUTS = Array.from({ length: CODE_LENGTH }, (_, i) => ({
	id: `code-${i}`,
	key: `verification-input-${i}`,
	index: i,
}));

export default function VerifyEmail() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [verifyError, setVerifyError] = useState<string | null>(null);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Get email from query params if available
	const email = searchParams.get("email") || "";

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
			// Clear any previous verification errors
			setVerifyError(null);

			try {
				// Use AWS Cognito confirmSignUp
				await confirmSignUp({
					username: email,
					confirmationCode: data.code,
				});

				// Navigate to login page after successful verification
				router.push("/");
			} catch (error: unknown) {
				// Handle verification errors
				if (error instanceof Error && error.name === "CodeMismatchException") {
					setVerifyError(
						"Invalid verification code. Please check your code and try again.",
					);
				} else if (
					error instanceof Error &&
					error.name === "ExpiredCodeException"
				) {
					setVerifyError(
						"Verification code has expired. Please request a new code.",
					);
				} else if (
					error instanceof Error &&
					error.name === "LimitExceededException"
				) {
					setVerifyError("Too many attempts. Please wait before trying again.");
				} else {
					setVerifyError(
						"An error occurred during verification. Please try again.",
					);
				}
				throw error; // Re-throw to maintain existing error handling behavior
			}
		},
		setIsLoading,
	);

	const handleResendCode = async () => {
		// Clear any previous errors
		setVerifyError(null);

		try {
			await resendSignUpCode({
				username: email,
			});
			// You might want to show a success message to the user
		} catch (error: unknown) {
			// Handle resend errors
			if (error instanceof Error && error.name === "LimitExceededException") {
				setVerifyError(
					"Too many resend attempts. Please wait before requesting another code.",
				);
			} else {
				setVerifyError("Failed to resend verification code. Please try again.");
			}
		}
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
		let value = e.target.value;
		// Remove non-digit characters
		value = value.replace(/\D/g, "");

		// Handle pasted content (multiple digits)
		if (value.length > 1) {
			// This is likely a paste operation
			const pastedDigits = value.substring(0, CODE_LENGTH);
			setValue("code", pastedDigits);

			// Focus the last filled input or the next empty input
			const targetIndex = Math.min(pastedDigits.length - 1, CODE_LENGTH - 1);
			if (inputRefs.current[targetIndex]) {
				inputRefs.current[targetIndex]?.focus();
			}
			return;
		}

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

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

		if (pastedData.length > 0) {
			const digits = pastedData.substring(0, CODE_LENGTH);
			setValue("code", digits);

			// Focus the last filled input or the next empty input
			const targetIndex = Math.min(digits.length - 1, CODE_LENGTH - 1);
			if (inputRefs.current[targetIndex]) {
				inputRefs.current[targetIndex]?.focus();
			}
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		idx: number,
	) => {
		// Allow Ctrl+V for paste
		if (e.ctrlKey && e.key === "v") {
			return;
		}

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
			title={config.forms.verifyEmail.title}
			description={config.forms.verifyEmail.description}
		>
			<form
				className={theme.components.form.spacing}
				onSubmit={handleSubmit(onSubmit)}
			>
				{/* Verification Error Display */}
				{verifyError && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
						<p className="text-sm text-red-600">{verifyError}</p>
					</div>
				)}

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
								onPaste={handlePaste}
								aria-label={`Digit ${input.index + 1} of verification code`}
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
					className={`w-full h-10 sm:h-12 ${getButtonStyles(
						"primary",
					)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{isLoading
						? "Verifying..."
						: config.forms.verifyEmail.submitButtonText}
				</Button>

				<div className="text-center">
					<span
						className={`text-sm sm:text-base ${theme.colors.ui.text.secondary} tracking-tight`}
					>
						{config.forms.verifyEmail.retryPrompt}{" "}
					</span>
					<button
						type="button"
						className={getLinkStyles()}
						onClick={() => {
							// Handle resend verification email logic
							handleResendCode();
						}}
					>
						{config.forms.verifyEmail.retryInText}
					</button>
				</div>
			</form>
		</AuthFormLayout>
	);
}
