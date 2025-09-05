"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";
import { getButtonStyles, getLinkStyles, theme } from "@/lib/theme";
import { type LoginFormData, loginSchema } from "@/lib/validations/auth";
import {
	createFormSubmitHandler,
	getInputWithErrorStyles,
} from "@/lib/validations/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "aws-amplify/auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthBottomLink from "./AuthBottomLink";
import AuthFormLayout from "./AuthFormLayout";
import GoogleSignInButton from "./GoogleSignInButton";
import OrDivider from "./OrDivider";

export default function Login() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	// Check for verification success message or errors
	useEffect(() => {
		const verified = searchParams.get("verified");
		const error = searchParams.get("error");

		if (verified === "true") {
			setSuccessMessage(
				"Email verified successfully! You can now sign in with your credentials.",
			);
		} else if (error === "missing-email") {
			setLoginError(
				"Unable to verify email. Please try signing in or creating an account.",
			);
		}

		// Clean up URL
		if (verified || error) {
			const url = new URL(window.location.href);
			url.searchParams.delete("verified");
			url.searchParams.delete("error");
			window.history.replaceState({}, "", url.toString());
		}
	}, [searchParams]);

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = createFormSubmitHandler<LoginFormData>(async (data) => {
		// Clear any previous login errors
		setLoginError(null);

		try {
			// Use AWS Cognito signIn
			const { isSignedIn, nextStep } = await signIn({
				username: data.email,
				password: data.password,
			});

			if (isSignedIn) {
				// User is successfully signed in
				router.push("/dashboard"); // Redirect to dashboard
			} else if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
				// User needs to verify their email - pass credentials for auto-login after verification
				const loginData = {
					email: data.email,
					password: data.password,
				};
				const loginDataParam = btoa(JSON.stringify(loginData)); // Base64 encode
				router.push(
					`/verify-email?email=${encodeURIComponent(
						data.email,
					)}&source=login&loginData=${encodeURIComponent(loginDataParam)}`,
				);
			} else if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_TOTP_CODE") {
				// 2FA is required
				router.push("/2fa");
			} else {
				// Handle other nextStep cases as needed
				// You may want to show appropriate UI based on nextStep
			}
		} catch (error: unknown) {
			// Handle authentication errors
			if (
				error instanceof Error &&
				(error.name === "NotAuthorizedException" ||
					error.name === "UserNotFoundException")
			) {
				setLoginError("Invalid email or password. Please try again.");
			} else if (
				error instanceof Error &&
				error.name === "UserNotConfirmedException"
			) {
				setLoginError("Please verify your email before signing in.");
				// Pass credentials for auto-login after verification
				const loginData = {
					email: data.email,
					password: data.password,
				};
				const loginDataParam = btoa(JSON.stringify(loginData)); // Base64 encode
				router.push(
					`/verify-email?email=${encodeURIComponent(
						data.email,
					)}&source=login&loginData=${encodeURIComponent(loginDataParam)}`,
				);
			} else if (
				error instanceof Error &&
				error.name === "TooManyRequestsException"
			) {
				setLoginError("Too many failed attempts. Please try again later.");
			} else if (
				error instanceof Error &&
				error.name === "UserAlreadyAuthenticatedException"
			) {
				setLoginError("You are already signed in. Please log out first.");
			} else {
				setLoginError("An error occurred during sign in. Please try again.");
			}
			throw error; // Re-throw to maintain existing error handling behavior
		}
	}, setIsLoading);

	const {
		formState: { errors },
		register,
		handleSubmit,
	} = form;

	return (
		<AuthFormLayout
			title={config.forms.login.title}
			description={config.app.description}
		>
			<form
				className={theme.components.form.spacing}
				onSubmit={handleSubmit(onSubmit)}
			>
				{/* Success Message Display */}
				{successMessage && (
					<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
						<p className="text-sm text-green-600">{successMessage}</p>
					</div>
				)}

				{/* Login Error Display */}
				{loginError && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
						<p className="text-sm text-red-600">{loginError}</p>
					</div>
				)}

				<div className={theme.components.form.fieldSpacing}>
					<Label htmlFor="email" className={theme.typography.label}>
						Email
					</Label>
					<Input
						id="email"
						type="email"
						placeholder="Enter your email"
						className={getInputWithErrorStyles(errors.email)}
						{...register("email")}
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? "email-error" : undefined}
					/>
					<FormError error={errors.email} id="email-error" />
				</div>

				<div className={theme.components.form.fieldSpacing}>
					<div className="flex items-center justify-between">
						<Label htmlFor="password" className={theme.typography.label}>
							Password
						</Label>
						{config.features.showForgotPassword && (
							<Link href="/forgot-password" className={getLinkStyles()}>
								{config.forms.login.forgotPasswordText}
							</Link>
						)}
					</div>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="Enter your password"
							className={getInputWithErrorStyles(errors.password)}
							{...register("password")}
							aria-invalid={!!errors.password}
							aria-describedby={errors.password ? "password-error" : undefined}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 pr-3 flex items-center"
							onClick={() => setShowPassword(!showPassword)}
							aria-label={showPassword ? "Hide password" : "Show password"}
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
							) : (
								<Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
							)}
						</button>
					</div>
					<FormError error={errors.password} id="password-error" />
				</div>
				<Button
					type="submit"
					disabled={isLoading}
					className={`w-full h-10 sm:h-12 ${getButtonStyles(
						"primary",
					)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{isLoading ? "Signing in..." : config.forms.login.submitButtonText}
				</Button>

				<OrDivider />

				{/* Google Sign-In Button */}
				<GoogleSignInButton text="Sign in with Google" disabled={isLoading} />

				{config.features.showSignUpLink && (
					<AuthBottomLink
						prompt={config.forms.login.signUpPrompt}
						linkText={config.forms.login.signUpText}
						href="/signup"
					/>
				)}
			</form>
		</AuthFormLayout>
	);
}
