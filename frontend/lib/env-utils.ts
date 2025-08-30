/**
 * Environment utility functions
 * Shared across the application for consistent environment variable handling
 */

export function getRequiredEnv(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}
