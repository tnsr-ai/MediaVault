"use client";

import { Button } from "@/components/ui/button";
import { signInWithRedirect } from "aws-amplify/auth";
import { useState } from "react";

interface GoogleSignInButtonProps {
	text?: string;
	className?: string;
	disabled?: boolean;
}

export default function GoogleSignInButton({
	text = "Continue with Google",
	className = "",
	disabled = false,
}: GoogleSignInButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true);
			await signInWithRedirect({
				provider: "Google",
			});
		} catch (error) {
			console.error("Error initiating Google sign-in:", error);
			setIsLoading(false);
		}
	};

	return (
		<Button
			type="button"
			variant="outline"
			disabled={disabled || isLoading}
			onClick={handleGoogleSignIn}
			className={`w-full h-10 sm:h-12 font-medium tracking-tight disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${className}`}
		>
			{isLoading ? (
				<>
					<div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
					<span>Connecting...</span>
				</>
			) : (
				<>
					<GoogleIcon />
					<span>{text}</span>
				</>
			)}
		</Button>
	);
}

// Google Icon SVG Component
function GoogleIcon() {
	return (
		<svg
			className="w-4 h-4"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			role="img"
			aria-label="Google logo"
		>
			<path
				fill="#4285F4"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			/>
			<path
				fill="#34A853"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			/>
			<path
				fill="#FBBC05"
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
			/>
			<path
				fill="#EA4335"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
			/>
		</svg>
	);
}
