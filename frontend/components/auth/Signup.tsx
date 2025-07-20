"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { config } from "@/lib/config";
import { getButtonStyles, theme } from "@/lib/theme";
import { type SignupFormData, signupSchema } from "@/lib/validations/auth";
import {
	createFormSubmitHandler,
	getInputWithErrorStyles,
} from "@/lib/validations/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthBottomLink from "./AuthBottomLink";
import AuthFormLayout from "./AuthFormLayout";

export default function Signup() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = createFormSubmitHandler<SignupFormData>(async (data) => {
		// Handle signup logic here
		console.log("Signup data:", data);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		router.push("/verify-email");
	}, setIsLoading);

	const {
		formState: { errors },
		register,
		handleSubmit,
		watch,
	} = form;
	const passwordValue = watch("password");

	return (
		<AuthFormLayout
			title={config.forms.signup.title}
			description={config.forms.signup.description}
		>
			<form
				className={theme.components.form.spacing}
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
					<div className={theme.components.form.fieldSpacing}>
						<Label htmlFor="firstName" className={theme.typography.label}>
							{config.forms.signup.fields.firstName.label}
						</Label>
						<Input
							id="firstName"
							type="text"
							placeholder={config.forms.signup.fields.firstName.placeholder}
							className={getInputWithErrorStyles(errors.firstName)}
							{...register("firstName")}
							aria-invalid={!!errors.firstName}
							aria-describedby={
								errors.firstName ? "firstName-error" : undefined
							}
						/>
						<FormError error={errors.firstName} id="firstName-error" />
					</div>

					<div className={theme.components.form.fieldSpacing}>
						<Label htmlFor="lastName" className={theme.typography.label}>
							{config.forms.signup.fields.lastName.label}
						</Label>
						<Input
							id="lastName"
							type="text"
							placeholder={config.forms.signup.fields.lastName.placeholder}
							className={getInputWithErrorStyles(errors.lastName)}
							{...register("lastName")}
							aria-invalid={!!errors.lastName}
							aria-describedby={errors.lastName ? "lastName-error" : undefined}
						/>
						<FormError error={errors.lastName} id="lastName-error" />
					</div>
				</div>

				<div className={theme.components.form.fieldSpacing}>
					<Label htmlFor="email" className={theme.typography.label}>
						{config.forms.signup.fields.email.label}
					</Label>
					<Input
						id="email"
						type="email"
						placeholder={config.forms.signup.fields.email.placeholder}
						className={getInputWithErrorStyles(errors.email)}
						{...register("email")}
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? "email-error" : undefined}
					/>
					<FormError error={errors.email} id="email-error" />
				</div>

				<div className={theme.components.form.fieldSpacing}>
					<Label htmlFor="password" className={theme.typography.label}>
						{config.forms.signup.fields.password.label}
					</Label>
					<Input
						id="password"
						type="password"
						placeholder={config.forms.signup.fields.password.placeholder}
						className={getInputWithErrorStyles(errors.password)}
						{...register("password")}
						aria-invalid={!!errors.password}
						aria-describedby={errors.password ? "password-error" : undefined}
					/>
					<FormError error={errors.password} id="password-error" />

					{/* Password Strength Indicator */}
					{passwordValue && (
						<div className="mt-3">
							<PasswordStrengthIndicator
								password={passwordValue}
								autoCollapse={true}
								collapseDelay={1500}
							/>
						</div>
					)}
				</div>

				<div className={theme.components.form.fieldSpacing}>
					<Label htmlFor="confirmPassword" className={theme.typography.label}>
						{config.forms.signup.fields.confirmPassword.label}
					</Label>
					<Input
						id="confirmPassword"
						type="password"
						placeholder={config.forms.signup.fields.confirmPassword.placeholder}
						className={getInputWithErrorStyles(errors.confirmPassword)}
						{...register("confirmPassword")}
						aria-invalid={!!errors.confirmPassword}
						aria-describedby={
							errors.confirmPassword ? "confirmPassword-error" : undefined
						}
					/>
					<FormError
						error={errors.confirmPassword}
						id="confirmPassword-error"
					/>
				</div>

				<Button
					type="submit"
					disabled={isLoading}
					className={`w-full h-10 sm:h-12 ${getButtonStyles(
						"primary",
					)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{isLoading
						? "Creating account..."
						: config.forms.signup.submitButtonText}
				</Button>

				<AuthBottomLink
					prompt={config.forms.signup.signInPrompt}
					linkText={config.forms.signup.signInText}
					href="/"
					className="text-center pb-10 md:pb-0"
				/>
			</form>
		</AuthFormLayout>
	);
}
