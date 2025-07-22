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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthBottomLink from "./AuthBottomLink";
import AuthFormLayout from "./AuthFormLayout";

export default function Login() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

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
		// Use AWS Cognito signIn
		const { isSignedIn, nextStep } = await signIn({
			username: data.email,
			password: data.password,
		});

		if (isSignedIn) {
			// User is successfully signed in
			router.push("/dashboard"); // Redirect to your main app
		} else if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
			// User needs to verify their email
			router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
		} else if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_TOTP_CODE") {
			// 2FA is required
			router.push("/2fa");
		} else {
			// Handle other nextStep cases as needed
			// You may want to show appropriate UI based on nextStep
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
					<Input
						id="password"
						type="password"
						placeholder="Enter your password"
						className={getInputWithErrorStyles(errors.password)}
						{...register("password")}
						aria-invalid={!!errors.password}
						aria-describedby={errors.password ? "password-error" : undefined}
					/>
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
