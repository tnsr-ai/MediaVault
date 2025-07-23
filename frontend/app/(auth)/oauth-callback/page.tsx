"use client";

import AuthFormLayout from "@/components/auth/AuthFormLayout";
import { Button } from "@/components/ui/button";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Import OAuth listener for handling redirects
import "aws-amplify/auth/enable-oauth-listener";

export default function OAuthCallback() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = Hub.listen("auth", async ({ payload }) => {
			switch (payload.event) {
				case "signInWithRedirect":
					try {
						const user = await getCurrentUser();
						const userAttributes = await fetchUserAttributes();

						console.log("OAuth sign-in successful:", { user, userAttributes });

						// Redirect to dashboard or main app
						router.push("/dashboard");
					} catch (error) {
						console.error("Error getting user after OAuth:", error);
						setError("Failed to complete sign-in. Please try again.");
						setIsLoading(false);
					}
					break;

				case "signInWithRedirect_failure":
					console.error("OAuth sign-in failed:", payload.data);
					setError("Sign-in failed. Please try again.");
					setIsLoading(false);
					break;

				case "customOAuthState": {
					const state = payload.data;
					console.log("Custom OAuth state received:", state);
					break;
				}

				default:
					console.log("Unhandled auth event:", payload.event);
			}
		});

		// Auto-redirect if taking too long
		const timeout = setTimeout(() => {
			if (isLoading) {
				setError("Sign-in is taking longer than expected. Please try again.");
				setIsLoading(false);
			}
		}, 10000); // 10 second timeout

		return () => {
			unsubscribe();
			clearTimeout(timeout);
		};
	}, [router, isLoading]);

	if (error) {
		return (
			<AuthFormLayout
				title="Sign-in Error"
				description="There was a problem completing your sign-in"
				showDivider={false}
			>
				<div className="text-center space-y-4">
					<div className="p-4 bg-red-50 border border-red-200 rounded-md">
						<p className="text-sm text-red-600">{error}</p>
					</div>
					<Button
						onClick={() => router.push("/login")}
						className="w-full"
						variant="outline"
					>
						Back to Login
					</Button>
				</div>
			</AuthFormLayout>
		);
	}

	return (
		<AuthFormLayout
			title="Completing Sign-in..."
			description="Please wait while we complete your sign-in process"
			showDivider={false}
		>
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
				</div>
				<p className="text-gray-600 text-sm">
					This should only take a few seconds.
				</p>
			</div>
		</AuthFormLayout>
	);
}
