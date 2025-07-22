export const config = {
	// Application metadata
	app: {
		name: "MediaVault",
		tagline: "A media vault for your personal files",
		description: "Welcome to MediaVault - Login to your account",
		logo: "/icon.png",
	},

	// Hero section content
	hero: {
		title: ["Start", "storing what matters,"],
		subtitle: ["privately and", "securely"],
	},

	// Form configuration
	forms: {
		login: {
			title: "Sign in to MediaVault",
			submitButtonText: "Sign In",
			forgotPasswordText: "Forgot password?",
			signUpPrompt: "Don't have an account?",
			signUpText: "Create one",
		},
		signup: {
			title: "Create your MediaVault account",
			description: "Sign up to securely store and manage your personal files.",
			submitButtonText: "Create Account",
			signInPrompt: "Already have an account?",
			signInText: "Sign in",
			fields: {
				firstName: {
					label: "First Name",
					placeholder: "Enter your first name",
				},
				lastName: {
					label: "Last Name",
					placeholder: "Enter your last name",
				},
				email: {
					label: "Email Address",
					placeholder: "Enter your email address",
				},
				password: {
					label: "Password",
					placeholder: "Create a password",
				},
				confirmPassword: {
					label: "Confirm Password",
					placeholder: "Re-enter your password",
				},
			},
		},
		forgotPassword: {
			title: "Forgot your password?",
			description: "Enter your email to reset password.",
			submitButtonText: "Send Reset Link",
			signInPrompt: "Remembered your password?",
			signInText: "Sign in",
			successTitle: "Check your email",
			successDescription:
				"We've sent password reset instructions to your email address.",
			successPrompt:
				"Didn't receive the email? Check your spam folder or try again.",
			enterResetCodeText: "Enter Reset Code",
			backToSignInText: "Back to Sign In",
			fields: {
				email: {
					label: "Email Address",
					placeholder: "Enter your email address",
				},
			},
		},
		resetPassword: {
			title: "Reset Your Password",
			description:
				"Enter the reset code sent to your email and choose a new password.",
			submitButtonText: "Reset Password",
			loadingText: "Resetting Password...",
			successTitle: "Password Reset Successful",
			successDescription: "Your password has been successfully reset.",
			successPrompt: "You can now sign in with your new password.",
			signInText: "Sign In",
			resendPrompt: "Didn't receive the code?",
			resendText: "Request New Reset",
			backToSignInText: "Back to Sign In",
			fields: {
				code: {
					label: "Reset Code",
					placeholder: "Enter 6-digit reset code",
				},
				newPassword: {
					label: "New Password",
					placeholder: "Enter new password",
				},
				confirmPassword: {
					label: "Confirm New Password",
					placeholder: "Confirm new password",
				},
			},
		},
		updatePassword: {
			title: "Update your password",
			description: "Enter your new password.",
			submitButtonText: "Update Password",
			fields: {
				newPassword: {
					label: "New Password",
					placeholder: "Enter new password",
				},
				retypePassword: {
					label: "Retype Password",
					placeholder: "Retype new password",
				},
			},
			errors: {
				passwordsDoNotMatch: "Passwords do not match.",
			},
			successMessage: "Password updated successfully!",
		},
		twoFA: {
			title: "Two-Factor Authentication",
			description: "Enter the 6-digit code from your authenticator app.",
			submitButtonText: "Verify",
			signInPrompt: "Having trouble?",
			signInText: "Back to login",
			fields: {
				code: {
					label: "Authentication Code",
					placeholder: "Enter 6-digit code",
				},
			},
		},
		verifyEmail: {
			title: "Verify Your Email",
			description: "Please check your email for a verification code.",
			submitButtonText: "Verify Email",
			retryPrompt: "Didn't receive a code?",
			retryInText: "Resend Code",
			fields: {
				code: {
					label: "Verification Code",
					placeholder: "Enter the 6 digit code sent to your email",
				},
			},
		},
	},

	// Wave animation settings
	waveAnimation: {
		speed: 5,
		scale: 0.8,
		noiseIntensity: 1.0,
		rotation: 60,
	},

	// Features that can be toggled
	features: {
		showBrandName: true,
		showForgotPassword: true,
		showSignUpLink: true,
		enableAnimations: true,
	},
} as const;

export type AppConfig = typeof config;
