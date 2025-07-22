"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";
import { RESEND_TIMER_SECONDS } from "@/lib/constants/auth";
import { getButtonStyles, getLinkStyles } from "@/lib/theme";
import {
	type ForgotPasswordFormData,
	forgotPasswordSchema,
} from "@/lib/validations/auth";
import {
	createFormSubmitHandler,
	getInputWithErrorStyles,
} from "@/lib/validations/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "aws-amplify/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthBottomLink from "./AuthBottomLink";
import AuthFormLayout from "./AuthFormLayout";

export default function Forgot() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [forgotError, setForgotError] = useState<string | null>(null);
	const [userEmail, setUserEmail] = useState("");

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = createFormSubmitHandler<ForgotPasswordFormData>(
		async (data) => {
			// Clear any previous errors
			setForgotError(null);

			try {
				// Use AWS Cognito resetPassword
				await resetPassword({
					username: data.email,
				});

				// Store email for the confirmation step
				setUserEmail(data.email);
				setIsSubmitted(true);
			} catch (error: unknown) {
				// Handle forgot password errors
				if (error instanceof Error && error.name === "UserNotFoundException") {
					setForgotError(
						"No account found with this email address. Please check your email or sign up.",
					);
				} else if (
					error instanceof Error &&
					error.name === "LimitExceededException"
				) {
					setForgotError(
						"Too many password reset attempts. Please wait before trying again.",
					);
				} else if (
					error instanceof Error &&
					error.name === "InvalidParameterException"
				) {
					setForgotError(
						"Invalid email format. Please enter a valid email address.",
					);
				} else {
					setForgotError(
						"An error occurred while sending the reset code. Please try again.",
					);
				}
				throw error; // Re-throw to maintain existing error handling behavior
			}
		},
		setIsLoading,
	);

	const {
		formState: { errors },
		register,
		handleSubmit,
	} = form;

	if (isSubmitted) {
		return (
			<AuthFormLayout
				title={config.forms.forgotPassword.successTitle}
				description={config.forms.forgotPassword.successDescription}
				showDivider={false}
			>
				<div className="text-center space-y-4">
					<p className="text-sm text-gray-600">
						{config.forms.forgotPassword.successPrompt}
					</p>
					<div className="space-y-2">
						<Link
							href={`/forgot-password/confirm?email=${encodeURIComponent(
								userEmail,
							)}`}
							className={`${getButtonStyles(
								"primary",
							)} w-full h-10 sm:h-12 font-medium tracking-tight inline-flex items-center justify-center`}
						>
							{config.forms.forgotPassword.enterResetCodeText}
						</Link>
						<Link href="/" className={getLinkStyles()}>
							{config.forms.forgotPassword.backToSignInText}
						</Link>
					</div>
				</div>
			</AuthFormLayout>
		);
	}

	return (
		<AuthFormLayout
			title={config.forms.forgotPassword.title}
			description={config.forms.forgotPassword.description}
		>
			<form
				className="space-y-4 sm:space-y-6"
				onSubmit={handleSubmit(onSubmit)}
			>
				{/* Forgot Password Error Display */}
				{forgotError && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
						<p className="text-sm text-red-600">{forgotError}</p>
					</div>
				)}

				<div className="space-y-1.5 sm:space-y-2">
					<Label
						htmlFor="email"
						className="text-sm sm:text-base font-medium text-black tracking-tight"
					>
						{config.forms.forgotPassword.fields.email.label}
					</Label>
					<Input
						id="email"
						type="email"
						placeholder={config.forms.forgotPassword.fields.email.placeholder}
						className={getInputWithErrorStyles(errors.email)}
						{...register("email")}
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? "email-error" : undefined}
					/>
					<FormError error={errors.email} id="email-error" />
				</div>

				<Button
					type="submit"
					disabled={isLoading}
					className={`w-full h-10 sm:h-12 ${getButtonStyles(
						"primary",
					)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{isLoading
						? "Sending..."
						: config.forms.forgotPassword.submitButtonText}
				</Button>

				<AuthBottomLink
					prompt={config.forms.forgotPassword.signInPrompt}
					linkText={config.forms.forgotPassword.signInText}
					href="/"
				/>
			</form>
		</AuthFormLayout>
	);
}
