"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthBottomLink from "./AuthBottomLink";
import AuthFormLayout from "./AuthFormLayout";

export default function Forgot() {
	const _router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

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
			// Handle forgot password logic here
			console.log("Forgot password data:", data);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setIsSubmitted(true);
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
				title="Check your email"
				description="We've sent password reset instructions to your email address."
				showDivider={false}
			>
				<div className="text-center">
					<Link href="/" className={getLinkStyles()}>
						Back to Sign In
					</Link>
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
