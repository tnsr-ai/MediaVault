import { referenceAuth } from "@aws-amplify/backend";

function getRequiredEnv(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}

export const auth = referenceAuth({
	userPoolId: getRequiredEnv("COGNITO_USER_POOL_ID"),
	identityPoolId: getRequiredEnv("COGNITO_IDENTITY_POOL_ID"),
	authRoleArn: getRequiredEnv("COGNITO_AUTH_ROLE_ARN"),
	unauthRoleArn: getRequiredEnv("COGNITO_UNAUTH_ROLE_ARN"),
	userPoolClientId: getRequiredEnv("COGNITO_USER_POOL_CLIENT_ID"),
});
