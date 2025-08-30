/**
 * User API Service
 *
 * This module contains all user-related API calls.
 */

import { getHttpClient } from "../http-client";

export interface SyncUserPayload {
	cognito_user_id: string;
	first_name: string;
	last_name: string;
	email: string;
}

export interface SyncUserResponse {
	success: boolean;
	message?: string;
	user_id?: string;
}

class UserApiService {
	/**
	 * Sync user data with the backend after successful Cognito signup
	 */
	async syncUser(payload: SyncUserPayload): Promise<SyncUserResponse> {
		try {
			const response = await getHttpClient().post<SyncUserResponse>(
				"/api/dev/sync-user",
				payload,
			);
			return response;
		} catch (error) {
			console.error("Failed to sync user with backend:", error);

			// Re-throw with a more descriptive error
			if (error instanceof Error) {
				throw new Error(`User sync failed: ${error.message}`);
			}
			throw new Error("User sync failed: Unknown error occurred");
		}
	}

	/**
	 * Future user-related API methods can be added here
	 * For example:
	 * - getUserProfile(userId: string)
	 * - updateUserProfile(userId: string, data: UserProfile)
	 * - deleteUser(userId: string)
	 */
}

// Export singleton instance
export const userApi = new UserApiService();

// Export class for potential custom instances
export { UserApiService };
