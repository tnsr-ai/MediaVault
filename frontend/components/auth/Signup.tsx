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
import { signUp } from "aws-amplify/auth";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthBottomLink from "./AuthBottomLink";
import AuthFormLayout from "./AuthFormLayout";

export default function Signup() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [signupError, setSignupError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
		// Clear any previous signup errors
		setSignupError(null);

		try {
			// Use AWS Cognito signUp
			const { userId } = await signUp({
				username: data.email,
				password: data.password,
				options: {
					userAttributes: {
						email: data.email,
						given_name: data.firstName,
						family_name: data.lastName,
					},
				},
			});

			// Redirect to email verification page with email parameter
			router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
		} catch (error: unknown) {
			// Handle signup errors
			if (error instanceof Error && error.name === "UsernameExistsException") {
				setSignupError(
					"An account with this email already exists. Please try signing in instead.",
				);
			} else if (
				error instanceof Error &&
				error.name === "InvalidPasswordException"
			) {
				setSignupError(
					"Password does not meet requirements. Please check the password policy.",
				);
			} else if (
				error instanceof Error &&
				error.name === "InvalidParameterException"
			) {
				setSignupError(
					"Invalid email format. Please enter a valid email address.",
				);
			} else {
				setSignupError("An error occurred during signup. Please try again.");
			}
			throw error; // Re-throw to maintain existing error handling behavior
		}
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
				{/* Signup Error Display */}
				{signupError && (
					<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
						<p className="text-sm text-red-600">{signupError}</p>
					</div>
				)}

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
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder={config.forms.signup.fields.password.placeholder}
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
					<div className="relative">
						<Input
							id="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							placeholder={
								config.forms.signup.fields.confirmPassword.placeholder
							}
							className={getInputWithErrorStyles(errors.confirmPassword)}
							{...register("confirmPassword")}
							aria-invalid={!!errors.confirmPassword}
							aria-describedby={
								errors.confirmPassword ? "confirmPassword-error" : undefined
							}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 pr-3 flex items-center"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							aria-label={
								showConfirmPassword ? "Hide password" : "Show password"
							}
						>
							{showConfirmPassword ? (
								<EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
							) : (
								<Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
							)}
						</button>
					</div>
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
