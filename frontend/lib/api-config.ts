import { getRequiredEnv } from "./env-utils";

/**
 * API configuration - separated to avoid loading environment variables
 * in components that don't need them
 */
export const apiConfig = {
	get baseUrl() {
		// Check if we're in a browser environment
		if (typeof window !== "undefined") {
			// Client-side: try to get the env var, use fallback if not available
			const envUrl = process.env.NEXT_PUBLIC_API_URL;
			if (!envUrl) {
				console.warn(
					"NEXT_PUBLIC_API_URL not available in client context, using fallback",
				);
				return "http://localhost:8080";
			}
			return envUrl;
		}
		// Server-side: use the required env function
		return getRequiredEnv("NEXT_PUBLIC_API_URL");
	},
	get awsRegion() {
		// Check if we're in a browser environment
		if (typeof window !== "undefined") {
			// Client-side: try to get the env var, use fallback if not available
			const envRegion = process.env.NEXT_PUBLIC_AWS_REGION;
			if (!envRegion) {
				console.warn(
					"NEXT_PUBLIC_AWS_REGION not available in client context, using fallback",
				);
				return "ap-south-1";
			}
			return envRegion;
		}
		// Server-side: use the required env function
		return getRequiredEnv("NEXT_PUBLIC_AWS_REGION");
	},
	timeout: 10000, // 10 seconds
	endpoints: {
		syncUser: "/api/dev/sync-user",
	},
};
