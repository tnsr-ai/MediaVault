"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userApi } from "@/lib/api/user";
import { config } from "@/lib/config";
import {
	RESEND_TIMER_SECONDS,
	VERIFICATION_CODE_LENGTH,
} from "@/lib/constants/auth";
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
import { confirmSignUp, resendSignUpCode, signIn } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AuthFormLayout from "./AuthFormLayout";

// Configuration for verification code input
const CODE_LENGTH = VERIFICATION_CODE_LENGTH;
const CODE_INPUTS = Array.from({ length: CODE_LENGTH }, (_, i) => ({
	id: `code-${i}`,
	key: `verification-input-${i}`,
	index: i,
}));

function VerifyEmailContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [verifyError, setVerifyError] = useState<string | null>(null);
	const [resendTimer, setResendTimer] = useState(0);
	const [canResend, setCanResend] = useState(true);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Get user data from query params
	const dataParam = searchParams.get("data");
	const emailParam = searchParams.get("email"); // Fallback for old URLs or login redirects
	const sourceParam = searchParams.get("source"); // Track source (login, signup)
	const loginDataParam = searchParams.get("loginData"); // Login credentials for auto-login

	// Parse user data or use email fallback
	let userData: {
		email: string;
		firstName: string;
		lastName: string;
		userId: string;
		password?: string; // Password for auto-login after verification
	} | null = null;

	let loginCredentials: {
		email: string;
		password: string;
	} | null = null;

	let email = "";
	let isFromSignup = false; // Track if user came from signup or login

	// Parse login credentials if coming from login flow
	if (loginDataParam) {
		try {
			loginCredentials = JSON.parse(atob(loginDataParam));
		} catch (error) {
			console.error("Failed to parse login data from URL:", error);
		}
	}

	if (dataParam) {
		// User came from signup flow with full data
		try {
			userData = JSON.parse(atob(dataParam));
			email = userData?.email || "";
			isFromSignup = true;
		} catch (error) {
			console.error("Failed to parse user data from URL:", error);
			email = emailParam || "";
			isFromSignup = sourceParam !== "login"; // Default to signup unless explicitly from login
		}
	} else {
		// User came from login flow with only email, or direct access
		email = emailParam || loginCredentials?.email || "";
		isFromSignup = sourceParam !== "login"; // If source=login, it's from login flow
	}

	// Initialize hooks unconditionally (before any early returns)
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
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [resendTimer]);

	// Redirect to login if no email is provided
	useEffect(() => {
		if (!email) {
			console.error("No email provided for verification");
			// Small delay to show error before redirect
			const timeout = setTimeout(() => {
				router.push("/?error=missing-email");
			}, 2000);
			return () => clearTimeout(timeout);
		}
	}, [email, router]);

	// Show error state if no email is provided
	if (!email) {
		return (
			<AuthFormLayout
				title="Verification Error"
				description="Unable to verify email - missing required information."
			>
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
					<p className="text-sm text-red-600">
						No email address provided for verification. Redirecting you back to
						the login page...
					</p>
				</div>
				<div className="text-center">
					<button
						type="button"
						onClick={() => router.push("/")}
						className={`${getButtonStyles()} w-full`}
					>
						Go to Login
					</button>
				</div>
			</AuthFormLayout>
		);
	}

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

				// After successful verification, sync user with backend (only for signup flow)
				if (userData && isFromSignup) {
					try {
						await userApi.syncUser({
							cognito_user_id: userData.userId,
							first_name: userData.firstName,
							last_name: userData.lastName,
							email: userData.email,
						});
						console.log(
							"User successfully synced with backend after verification",
						);
					} catch (syncError: unknown) {
						console.error(
							"Failed to sync user with backend after verification:",
							syncError,
						);
						// If user already exists (409 conflict), that's okay - continue with flow
						if (
							syncError &&
							typeof syncError === "object" &&
							"response" in syncError &&
							(syncError.response as { status?: number })?.status === 409
						) {
							console.log(
								"User already exists in backend - continuing with verification flow",
							);
						} else {
							// Don't fail the verification process if backend sync fails
							// The user is still verified and can proceed to login
						}
					}
				} else if (!isFromSignup) {
					console.log("User verified from login flow - skipping backend sync");
				} else {
					console.warn("No user data available for sync after verification");
				}

				// Handle post-verification flow based on how user got here
				if (isFromSignup && userData?.password) {
					// User came from signup - attempt auto-login with signup credentials
					try {
						const { isSignedIn } = await signIn({
							username: email,
							password: userData.password,
						});

						if (isSignedIn) {
							// User is automatically signed in after verification
							console.log(
								"User automatically signed in after signup verification",
							);
							router.push("/dashboard"); // Redirect to dashboard after successful signup
							return;
						}
					} catch (signInError) {
						console.error(
							"Auto-login failed after signup verification:",
							signInError,
						);
						// If auto-login fails, redirect to login page with success message
						router.push("/?verified=true");
						return;
					}
				} else if (!isFromSignup && loginCredentials) {
					// User came from login flow - attempt auto-login with login credentials
					try {
						const { isSignedIn } = await signIn({
							username: loginCredentials.email,
							password: loginCredentials.password,
						});

						if (isSignedIn) {
							// User is automatically signed in after verification
							console.log(
								"User automatically signed in after login verification",
							);
							router.push("/dashboard"); // Redirect to dashboard after successful verification
							return;
						}
					} catch (signInError) {
						console.error(
							"Auto-login failed after login verification:",
							signInError,
						);
						// If auto-login fails, redirect to login page with success message
						router.push("/?verified=true");
						return;
					}
				} else {
					// No credentials available - redirect to login with success message
					console.log(
						"No credentials available for auto-login - redirecting to login",
					);
					router.push("/?verified=true");
					return;
				}

				// Fallback: redirect to login with verification success message
				router.push("/?verified=true");
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
		// Prevent multiple resend attempts
		if (!canResend) return;

		// Clear any previous errors
		setVerifyError(null);
		setCanResend(false);
		setResendTimer(RESEND_TIMER_SECONDS); // Start 60-second countdown

		try {
			await resendSignUpCode({
				username: email,
			});
			// Show success message or update UI as needed
		} catch (error: unknown) {
			// Handle resend errors
			if (error instanceof Error && error.name === "LimitExceededException") {
				setVerifyError(
					"Too many resend attempts. Please wait before requesting another code.",
				);
			} else {
				setVerifyError("Failed to resend verification code. Please try again.");
			}
			// Reset timer and allow resend if there was an error
			setCanResend(true);
			setResendTimer(0);
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
			description={
				isFromSignup
					? "Please check your email for a verification code to complete your account setup."
					: "Please check your email for a verification code to complete sign-in."
			}
		>
			{/* Contextual Info Message */}
			{!isFromSignup && (
				<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
					<p className="text-sm text-blue-600">
						{loginCredentials
							? "Your account needs to be verified before you can sign in. After verification, you'll be automatically signed in."
							: "Your account needs to be verified before you can sign in. After verification, you'll be redirected back to sign in."}
					</p>
				</div>
			)}

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
						className={`${getLinkStyles()} ${
							!canResend ? "opacity-50 cursor-not-allowed" : ""
						}`}
						onClick={handleResendCode}
						disabled={!canResend}
					>
						{canResend
							? config.forms.verifyEmail.retryInText
							: `Resend in ${resendTimer}s`}
					</button>
				</div>
			</form>
		</AuthFormLayout>
	);
}

export default function VerifyEmail() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VerifyEmailContent />
		</Suspense>
	);
}
