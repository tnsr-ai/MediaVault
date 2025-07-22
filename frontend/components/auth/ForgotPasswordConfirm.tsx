"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { config } from "@/lib/config";
import {
	RESEND_TIMER_SECONDS,
	VERIFICATION_CODE_LENGTH,
} from "@/lib/constants/auth";
import { getButtonStyles, getLinkStyles, theme } from "@/lib/theme";
import {
	type ResetPasswordFormData,
	resetPasswordSchema,
} from "@/lib/validations/auth";
import {
	createFormSubmitHandler,
	getInputWithErrorStyles,
} from "@/lib/validations/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmResetPassword, resetPassword } from "aws-amplify/auth";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AuthFormLayout from "./AuthFormLayout";

// Configuration for verification code input
const CODE_LENGTH = VERIFICATION_CODE_LENGTH;
const CODE_INPUTS = Array.from({ length: CODE_LENGTH }, (_, i) => ({
	id: `code-${i}`,
	key: `reset-code-input-${i}`,
	index: i,
}));

function ForgotPasswordConfirmContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [resetError, setResetError] = useState<string | null>(null);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isCodeVerified, setIsCodeVerified] = useState(false);
	const [codeVerificationAttempted, setCodeVerificationAttempted] =
		useState(false);
	const [resendTimer, setResendTimer] = useState(0);
	const [canResend, setCanResend] = useState(true);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Get email from query params
	const email = searchParams.get("email") || "";

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			code: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const {
		formState: { errors },
		register,
		handleSubmit,
		watch,
		setValue,
	} = form;
	const newPasswordValue = watch("newPassword");
	const codeValue = watch("code");

	// Timer effect for resend functionality
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (resendTimer > 0) {
			interval = setInterval(() => {
				setResendTimer((prev) => {
					if (prev <= 1) {
						setCanResend(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [resendTimer]);

	const handleResendCode = async () => {
		// Prevent multiple resend attempts
		if (!canResend) return;

		// Clear any previous errors
		setResetError(null);
		setCanResend(false);
		setResendTimer(RESEND_TIMER_SECONDS); // Start 60-second countdown

		try {
			await resetPassword({
				username: email,
			});
			// Reset verification states since new code was sent
			setIsCodeVerified(false);
			setCodeVerificationAttempted(false);
			// Clear the code inputs
			setValue("code", "");
		} catch (error: unknown) {
			// Handle resend errors
			if (error instanceof Error && error.name === "LimitExceededException") {
				setResetError(
					"Too many resend attempts. Please wait before requesting another code.",
				);
			} else {
				setResetError("Failed to resend reset code. Please try again.");
			}
			// Reset timer and allow resend if there was an error
			setCanResend(true);
			setResendTimer(0);
		}
	};

	// Verify the reset code format before allowing password reset
	const verifyResetCode = async (code: string) => {
		if (code.length !== CODE_LENGTH) return;

		setCodeVerificationAttempted(true);
		setResetError(null);

		// Only validate format - don't show "verified successfully" until actual submission
		if (code.length === CODE_LENGTH && /^\d{6}$/.test(code)) {
			setIsCodeVerified(true);
		} else {
			setIsCodeVerified(false);
			setResetError("Please enter a valid 6-digit code.");
		}
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
		let value = e.target.value;
		// Remove non-digit characters
		value = value.replace(/\D/g, "");

		// Handle pasted content (multiple digits)
		if (value.length > 1) {
			const pastedDigits = value.substring(0, CODE_LENGTH);
			setValue("code", pastedDigits);
			verifyResetCode(pastedDigits);

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
		setValue("code", newCode.substring(0, CODE_LENGTH));

		// Verify code when complete
		if (newCode.length === CODE_LENGTH) {
			verifyResetCode(newCode);
		} else {
			setIsCodeVerified(false);
			setCodeVerificationAttempted(false);
		}

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
			verifyResetCode(digits);

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

			// Reset verification when code is incomplete
			if (newCode.length < CODE_LENGTH) {
				setIsCodeVerified(false);
				setCodeVerificationAttempted(false);
			}
		}
	};

	const onSubmit = createFormSubmitHandler<ResetPasswordFormData>(
		async (data) => {
			// Check if code is verified before proceeding
			if (!isCodeVerified) {
				setResetError("Please enter a valid 6-digit reset code first.");
				return;
			}

			// Clear any previous errors
			setResetError(null);

			try {
				// Use AWS Cognito confirmResetPassword - this is where actual validation happens
				await confirmResetPassword({
					username: email,
					confirmationCode: data.code,
					newPassword: data.newPassword,
				});

				setIsSuccess(true);
			} catch (error: unknown) {
				// Handle reset password errors
				if (error instanceof Error && error.name === "CodeMismatchException") {
					setResetError(
						"Invalid reset code. Please check your code and try again.",
					);
					// Reset the verification state so user needs to re-enter code
					setIsCodeVerified(false);
					setCodeVerificationAttempted(false);
				} else if (
					error instanceof Error &&
					error.name === "ExpiredCodeException"
				) {
					setResetError(
						"Reset code has expired. Please request a new password reset.",
					);
					setIsCodeVerified(false);
					setCodeVerificationAttempted(false);
				} else if (
					error instanceof Error &&
					error.name === "InvalidPasswordException"
				) {
					setResetError(
						"Password does not meet requirements. Please check the password policy.",
					);
				} else if (
					error instanceof Error &&
					error.name === "LimitExceededException"
				) {
					setResetError("Too many attempts. Please wait before trying again.");
				} else if (
					error instanceof Error &&
					error.name === "UserNotFoundException"
				) {
					setResetError(
						"User not found. Please check your email or request a new reset.",
					);
				} else {
					setResetError(
						"An error occurred while resetting your password. Please try again.",
					);
				}
				throw error; // Re-throw to maintain existing error handling behavior
			}
		},
		setIsLoading,
	);

	if (isSuccess) {
		return (
			<AuthFormLayout
				title={config.forms.resetPassword.successTitle}
				description={config.forms.resetPassword.successDescription}
				showDivider={false}
			>
				<div className="text-start space-y-4">
					<p className="text-sm text-gray-600">
						{config.forms.resetPassword.successPrompt}
					</p>
					<Link
						href="/"
						className={`${getButtonStyles(
							"primary",
						)} w-full h-10 sm:h-12 font-medium tracking-tight inline-flex items-center justify-center`}
					>
						{config.forms.resetPassword.signInText}
					</Link>
				</div>
			</AuthFormLayout>
		);
	}

	return (
		<AuthFormLayout
			title={config.forms.resetPassword.title}
			description={config.forms.resetPassword.description}
		>
			<form
				className={theme.components.form.spacing}
				onSubmit={handleSubmit(onSubmit)}
			>
				{/* Reset Error Display */}
				{resetError && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
						<p className="text-sm text-red-600">{resetError}</p>
					</div>
				)}

				<div className={theme.components.form.fieldSpacing}>
					<Label htmlFor="code-0" className={theme.typography.label}>
						{config.forms.resetPassword.fields.code.label}
					</Label>
					<div className="flex gap-2 justify-between">
						{CODE_INPUTS.map((input) => (
							<div key={input.key} className="relative flex-1">
								<Input
									id={input.id}
									type="text"
									inputMode="numeric"
									maxLength={1}
									className={`w-full h-12 text-center text-lg font-medium ${
										codeVerificationAttempted && !isCodeVerified
											? "border-red-500 bg-red-50"
											: getInputWithErrorStyles(errors.code)
									}`}
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
									aria-label={`Digit ${input.index + 1} of reset code`}
									aria-invalid={!!errors.code}
									aria-describedby={errors.code ? "code-error" : undefined}
								/>
							</div>
						))}
					</div>
					<FormError error={errors.code} id="code-error" />
				</div>

				<div className={theme.components.form.fieldSpacing}>
					<Label htmlFor="new-password" className={theme.typography.label}>
						{config.forms.resetPassword.fields.newPassword.label}
					</Label>
					<div className="relative">
						<Input
							id="new-password"
							type={showNewPassword ? "text" : "password"}
							placeholder={
								config.forms.resetPassword.fields.newPassword.placeholder
							}
							className={`${getInputWithErrorStyles(errors.newPassword)} ${
								!isCodeVerified ? "bg-gray-50" : ""
							}`}
							{...register("newPassword")}
							aria-invalid={!!errors.newPassword}
							aria-describedby={
								errors.newPassword ? "newPassword-error" : undefined
							}
							disabled={!isCodeVerified}
						/>
						<button
							type="button"
							onClick={() => setShowNewPassword(!showNewPassword)}
							className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 ${
								!isCodeVerified ? "opacity-50 cursor-not-allowed" : ""
							}`}
							aria-label={showNewPassword ? "Hide password" : "Show password"}
							disabled={!isCodeVerified}
						>
							{showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
					<FormError error={errors.newPassword} id="newPassword-error" />

					{/* Password Strength Indicator - only show if code is verified */}
					{newPasswordValue && isCodeVerified && (
						<div className="mt-3">
							<PasswordStrengthIndicator
								password={newPasswordValue}
								autoCollapse={true}
								collapseDelay={1500}
							/>
						</div>
					)}
				</div>

				<div className={theme.components.form.fieldSpacing}>
					<Label htmlFor="confirm-password" className={theme.typography.label}>
						{config.forms.resetPassword.fields.confirmPassword.label}
					</Label>
					<div className="relative">
						<Input
							id="confirm-password"
							type={showConfirmPassword ? "text" : "password"}
							placeholder={
								config.forms.resetPassword.fields.confirmPassword.placeholder
							}
							className={`${getInputWithErrorStyles(errors.confirmPassword)} ${
								!isCodeVerified ? "bg-gray-50" : ""
							}`}
							{...register("confirmPassword")}
							aria-invalid={!!errors.confirmPassword}
							aria-describedby={
								errors.confirmPassword ? "confirmPassword-error" : undefined
							}
							disabled={!isCodeVerified}
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 ${
								!isCodeVerified ? "opacity-50 cursor-not-allowed" : ""
							}`}
							aria-label={
								showConfirmPassword ? "Hide password" : "Show password"
							}
							disabled={!isCodeVerified}
						>
							{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
					<FormError
						error={errors.confirmPassword}
						id="confirmPassword-error"
					/>
				</div>

				<Button
					type="submit"
					disabled={isLoading || !isCodeVerified}
					className={`w-full h-10 sm:h-12 ${getButtonStyles(
						"primary",
					)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{isLoading
						? config.forms.resetPassword.loadingText
						: config.forms.resetPassword.submitButtonText}
				</Button>

				<div className="text-center">
					<span
						className={`text-sm sm:text-base ${theme.colors.ui.text.secondary} tracking-tight`}
					>
						{config.forms.resetPassword.resendPrompt}{" "}
					</span>
					<button
						type="button"
						className={`${getLinkStyles()} ${
							!canResend ? "opacity-50 cursor-not-allowed" : ""
						}`}
						onClick={handleResendCode}
						disabled={!canResend}
					>
						{canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
					</button>
				</div>

				<div className="text-center">
					<Link href="/" className={getLinkStyles()}>
						{config.forms.resetPassword.backToSignInText}
					</Link>
				</div>
			</form>
		</AuthFormLayout>
	);
}

export default function ForgotPasswordConfirm() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ForgotPasswordConfirmContent />
		</Suspense>
	);
}
