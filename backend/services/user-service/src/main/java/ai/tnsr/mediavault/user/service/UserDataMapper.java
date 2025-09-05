package ai.tnsr.mediavault.user.service;

import ai.tnsr.mediavault.user.dto.UserData;
import ai.tnsr.mediavault.user.model.User;
import org.springframework.stereotype.Service;

/**
 * Service for converting between User entities and UserData DTOs
 */
@Service
public class UserDataMapper {

    /**
     * Convert User entity to UserData DTO
     */
    public UserData toUserData(User user) {
        if (user == null) {
            return null;
        }

        UserData userData = new UserData();
        userData.setId(user.getId());
        userData.setCognitoUserId(user.getCognitoUserId());
        userData.setFirstName(user.getFirstName());
        userData.setLastName(user.getLastName());
        userData.setEmail(user.getEmail());
        userData.setStorageUsedBytes(user.getStorageUsedBytes());
        userData.setStorageQuotaBytes(user.getStorageQuotaBytes());
        userData.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        userData.setUpdatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null);

        return userData;
    }
}
