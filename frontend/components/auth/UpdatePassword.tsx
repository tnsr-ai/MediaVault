"use client";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { config } from "@/lib/config";
import { getButtonStyles, theme } from "@/lib/theme";
import {
	type UpdatePasswordFormData,
	updatePasswordSchema,
} from "@/lib/validations/auth";
import {
	createFormSubmitHandler,
	getInputWithErrorStyles,
} from "@/lib/validations/form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spectral } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const spectral = Spectral({
	weight: ["400"],
	style: ["italic"],
});

export default function UpdatePassword() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState("");

	const form = useForm<UpdatePasswordFormData>({
		resolver: zodResolver(updatePasswordSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			newPassword: "",
			retypePassword: "",
		},
	});

	const {
		formState: { errors },
		register,
		handleSubmit,
		watch,
	} = form;
	const newPasswordValue = watch("newPassword");

	const onSubmit = createFormSubmitHandler<UpdatePasswordFormData>(
		async (data) => {
			// Handle password update logic here
			console.log("Update password data:", data);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSuccess("Password updated successfully!");
			// Optionally redirect after success
			setTimeout(() => {
				router.push("/");
			}, 2000);
		},
		setIsLoading,
	);

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
								{config.forms.updatePassword.title}
							</p>
							<p className={theme.typography.heading.secondary}>
								{config.forms.updatePassword.description}
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
								<Label
									htmlFor="new-password"
									className={theme.typography.label}
								>
									{"New Password"}
								</Label>
								<Input
									id="new-password"
									type="password"
									placeholder={"Enter new password"}
									className={getInputWithErrorStyles(errors.newPassword)}
									{...register("newPassword")}
									aria-invalid={!!errors.newPassword}
									aria-describedby={
										errors.newPassword ? "newPassword-error" : undefined
									}
								/>
								<FormError error={errors.newPassword} id="newPassword-error" />

								{/* Password Strength Indicator */}
								{newPasswordValue && (
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
								<Label
									htmlFor="retype-password"
									className={theme.typography.label}
								>
									{"Retype Password"}
								</Label>
								<Input
									id="retype-password"
									type="password"
									placeholder={"Retype new password"}
									className={getInputWithErrorStyles(errors.retypePassword)}
									{...register("retypePassword")}
									aria-invalid={!!errors.retypePassword}
									aria-describedby={
										errors.retypePassword ? "retypePassword-error" : undefined
									}
								/>
								<FormError
									error={errors.retypePassword}
									id="retypePassword-error"
								/>
							</div>
							{success && (
								<div className="text-green-500 text-sm mb-2 text-center">
									{success}
								</div>
							)}
							<Button
								type="submit"
								disabled={isLoading}
								className={`w-full h-12 ${getButtonStyles(
									"primary",
								)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								{isLoading
									? "Updating..."
									: config.forms.updatePassword.submitButtonText}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
