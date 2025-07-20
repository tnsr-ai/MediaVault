"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";
import { getButtonStyles, getLinkStyles, theme } from "@/lib/theme";
import {
	type ForgotPasswordFormData,
	forgotPasswordSchema,
} from "@/lib/validations/auth";
import {
	createFormSubmitHandler,
	getInputWithErrorStyles,
} from "@/lib/validations/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spectral } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const spectral = Spectral({
	weight: ["400"],
	style: ["italic"],
});

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
									Check your email
								</p>
								<p className={theme.typography.heading.secondary}>
									We've sent password reset instructions to your email address.
								</p>
							</div>
							<div className="text-center">
								<Link href="/" className={getLinkStyles()}>
									Back to Sign In
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
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
								{config.forms.forgotPassword.title}
							</p>
							<p className={theme.typography.heading.secondary}>
								{config.forms.forgotPassword.description}
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
								<Label htmlFor="email" className={theme.typography.label}>
									{config.forms.forgotPassword.fields.email.label}
								</Label>
								<Input
									id="email"
									type="email"
									placeholder={
										config.forms.forgotPassword.fields.email.placeholder
									}
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
								className={`w-full h-12 ${getButtonStyles(
									"primary",
								)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								{isLoading
									? "Sending..."
									: config.forms.forgotPassword.submitButtonText}
							</Button>

							<div className="text-center">
								<span
									className={`${theme.colors.ui.text.secondary} tracking-tight`}
								>
									{config.forms.forgotPassword.signInPrompt}{" "}
								</span>
								<Link href="/" className={getLinkStyles()}>
									{config.forms.forgotPassword.signInText}
								</Link>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
