import { z } from "zod";

// Common validation patterns
const emailSchema = z
	.string()
	.min(1, "Email is required")
	.email("Please enter a valid email address");

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter (a-z)")
	.regex(/[0-9]/, "Password must contain at least one number (0-9)")
	.regex(
		/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
		"Password must contain at least one special character (!@#$%^&*)",
	);

const nameSchema = z
	.string()
	.min(1, "This field is required")
	.min(2, "Must be at least 2 characters long")
	.max(50, "Must be less than 50 characters")
	.regex(/^[a-zA-Z\s]*$/, "Only letters and spaces are allowed");

const codeSchema = z
	.string()
	.min(1, "Verification code is required")
	.regex(/^\d{6}$/, "Please enter a valid 6-digit code");

// Login form schema
export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
});

// Signup form schema
export const signupSchema = z
	.object({
		firstName: nameSchema,
		lastName: nameSchema,
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// Forgot password form schema
export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

// Reset password confirmation schema
export const resetPasswordSchema = z
	.object({
		code: codeSchema,
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your new password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// Two-factor authentication schema
export const twoFASchema = z.object({
	code: codeSchema,
});

// Update password schema
export const updatePasswordSchema = z
	.object({
		newPassword: passwordSchema,
		retypePassword: z.string().min(1, "Please confirm your new password"),
	})
	.refine((data) => data.newPassword === data.retypePassword, {
		message: "Passwords do not match",
		path: ["retypePassword"],
	});

// Verify email schema
export const verifyEmailSchema = z.object({
	code: codeSchema,
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type TwoFAFormData = z.infer<typeof twoFASchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
