import { fetchAuthSession } from "aws-amplify/auth";
import jwt from "jsonwebtoken";

/**
 * Extract AWS region from Cognito JWT token
 * The region is extracted from the 'iss' claim in the format:
 * https://cognito-idp.{region}.amazonaws.com/{userPoolId}
 */
export async function getAwsRegionFromJwt(): Promise<string | null> {
	try {
		const session = await fetchAuthSession();
		const idToken = session.tokens?.idToken?.toString();

		if (!idToken) {
			console.debug("No ID token available in current session");
			return null;
		}

		// Decode the JWT token (no verification needed as it comes from Amplify)
		const decoded = jwt.decode(idToken) as { iss?: string };

		if (!decoded || !decoded.iss) {
			console.debug("No issuer claim found in ID token");
			return null;
		}

		// Extract region from issuer URL
		// Format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
		const issuerMatch = decoded.iss.match(
			/https:\/\/cognito-idp\.([^.]+)\.amazonaws\.com\//,
		);

		if (issuerMatch?.[1]) {
			const region = issuerMatch[1];
			console.debug(`Extracted AWS region from JWT: ${region}`);
			return region;
		}

		console.debug("Could not extract region from issuer:", decoded.iss);
		return null;
	} catch (error) {
		console.debug("Failed to extract region from JWT:", error);
		return null;
	}
}

/**
 * Get AWS region with fallback strategy:
 * 1. Try to extract from JWT token (most reliable)
 * 2. Fall back to environment variable
 * 3. Fall back to hardcoded default
 */
export async function getAwsRegion(): Promise<string> {
	// Try to get region from JWT token first
	const jwtRegion = await getAwsRegionFromJwt();
	if (jwtRegion) {
		return jwtRegion;
	}

	// Fall back to environment variable
	if (typeof window !== "undefined") {
		const envRegion = process.env.NEXT_PUBLIC_AWS_REGION;
		if (envRegion) {
			// Normalize region format (fix common issues)
			const normalizedRegion = envRegion.replace("ap-south1", "ap-south-1");
			if (normalizedRegion !== envRegion) {
				console.warn(
					`Normalized AWS region from ${envRegion} to ${normalizedRegion}`,
				);
			}
			console.debug(`Using environment variable region: ${normalizedRegion}`);
			return normalizedRegion;
		}

		console.warn("NEXT_PUBLIC_AWS_REGION not available in client context");
	}

	// Final fallback
	console.debug("Using fallback AWS region: ap-south-1");
	return "ap-south-1";
}
