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
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthFormLayout from "./AuthFormLayout";

export default function UpdatePassword() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showRetypePassword, setShowRetypePassword] = useState(false);

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
		<AuthFormLayout
			title={config.forms.updatePassword.title}
			description={config.forms.updatePassword.description}
		>
			<form
				className={theme.components.form.spacing}
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className={theme.components.form.fieldSpacing}>
					<Label htmlFor="new-password" className={theme.typography.label}>
						{"New Password"}
					</Label>
					<div className="relative">
						<Input
							id="new-password"
							type={showNewPassword ? "text" : "password"}
							placeholder={"Enter new password"}
							className={getInputWithErrorStyles(errors.newPassword)}
							{...register("newPassword")}
							aria-invalid={!!errors.newPassword}
							aria-describedby={
								errors.newPassword ? "newPassword-error" : undefined
							}
						/>
						<button
							type="button"
							onClick={() => setShowNewPassword(!showNewPassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
							aria-label={showNewPassword ? "Hide password" : "Show password"}
						>
							{showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
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
					<Label htmlFor="retype-password" className={theme.typography.label}>
						{"Retype Password"}
					</Label>
					<div className="relative">
						<Input
							id="retype-password"
							type={showRetypePassword ? "text" : "password"}
							placeholder={"Retype new password"}
							className={getInputWithErrorStyles(errors.retypePassword)}
							{...register("retypePassword")}
							aria-invalid={!!errors.retypePassword}
							aria-describedby={
								errors.retypePassword ? "retypePassword-error" : undefined
							}
						/>
						<button
							type="button"
							onClick={() => setShowRetypePassword(!showRetypePassword)}
							className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
							aria-label={
								showRetypePassword ? "Hide password" : "Show password"
							}
						>
							{showRetypePassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
					<FormError error={errors.retypePassword} id="retypePassword-error" />
				</div>
				{success && (
					<div className="text-green-500 text-sm mb-2 text-center">
						{success}
					</div>
				)}
				<Button
					type="submit"
					disabled={isLoading}
					className={`w-full h-10 sm:h-12 ${getButtonStyles(
						"primary",
					)} font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{isLoading
						? "Updating..."
						: config.forms.updatePassword.submitButtonText}
				</Button>
			</form>
		</AuthFormLayout>
	);
}
