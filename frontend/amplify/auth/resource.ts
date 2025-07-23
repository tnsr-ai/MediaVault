import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
	loginWith: {
		email: true,
		externalProviders: {
			google: {
				clientId: secret("GOOGLE_CLIENT_ID"),
				clientSecret: secret("GOOGLE_CLIENT_SECRET"),
				scopes: ["openid profile email"],
				attributeMapping: {
					email: "email",
					givenName: "given_name",
					familyName: "family_name",
				},
			},
			callbackUrls: [
				"http://localhost:3000/oauth-callback",
				"https://yourdomain.com/oauth-callback",
			],
			logoutUrls: ["http://localhost:3000/", "https://yourdomain.com/"],
		},
	},
	userAttributes: {
		givenName: {
			mutable: true,
			required: true,
		},
		familyName: {
			mutable: true,
			required: true,
		},
	},
});
