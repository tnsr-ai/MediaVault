"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { config } from "@/lib/config";
import {
	getButtonStyles,
	getInputStyles,
	getLinkStyles,
	theme,
} from "@/lib/theme";
import { Spectral } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const spectral = Spectral({
	weight: ["400"],
	style: ["italic"],
});

export default function UpdatePassword() {
	const [newPassword, setNewPassword] = useState("");
	const [retypePassword, setRetypePassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		if (newPassword !== retypePassword) {
			setError("Passwords do not match."); // fallback string
			return;
		}
		// TODO: Add password update API call here
		setSuccess("Password updated successfully!"); // fallback string
	};

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
							onSubmit={handleSubmit}
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
									className={getInputStyles()}
									required
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
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
									className={getInputStyles()}
									required
									value={retypePassword}
									onChange={(e) => setRetypePassword(e.target.value)}
								/>
							</div>
							{error && (
								<div className="text-red-500 text-sm mb-2 text-center">
									{error}
								</div>
							)}
							{success && (
								<div className="text-green-500 text-sm mb-2 text-center">
									{success}
								</div>
							)}
							<Button
								type="submit"
								className={`w-full h-12 ${getButtonStyles(
									"primary",
								)} font-medium tracking-tight`}
							>
								{config.forms.updatePassword.submitButtonText}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
