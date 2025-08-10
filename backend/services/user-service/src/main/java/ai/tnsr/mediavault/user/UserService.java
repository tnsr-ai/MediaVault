package ai.tnsr.mediavault.user;

import ai.tnsr.mediavault.user.dto.CognitoUserSignupRequest;
import ai.tnsr.mediavault.user.dto.UserResponse;
import ai.tnsr.mediavault.user.model.User;
import ai.tnsr.mediavault.user.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Transactional
    public UserResponse createUserFromCognito(CognitoUserSignupRequest request) {
        // Check if user already exists by Cognito ID
        if (userRepository.existsByCognitoUserId(request.getCognitoUserId())) {
            return new UserResponse("User with this Cognito ID already exists");
        }

        // Check if user already exists by email
        if (userRepository.existsByEmail(request.getEmail())) {
            return new UserResponse("User with this email already exists");
        }

        // Create new user
        User user = new User();
        user.setCognitoUserId(request.getCognitoUserId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        // Save user to database
        User savedUser = userRepository.save(user);

        return new UserResponse(
            savedUser.getId(),
            savedUser.getCognitoUserId(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            savedUser.getEmail()
        );
    }

    public UserResponse getUserByCognitoId(String cognitoUserId) {
        return userRepository.findByCognitoUserId(cognitoUserId)
            .map(user -> new UserResponse(
                user.getId(),
                user.getCognitoUserId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
            ))
            .orElse(new UserResponse("User not found"));
    }

    @Transactional
    public UserResponse updateUserStorage(String cognitoUserId, Long storageUsedBytes) {
        return userRepository.findByCognitoUserId(cognitoUserId)
            .map(user -> {
                // Check if the new storage usage exceeds quota
                if (storageUsedBytes > user.getStorageQuotaBytes()) {
                    return new UserResponse("Storage usage exceeds quota limit");
                }

                user.setStorageUsedBytes(storageUsedBytes);
                User updatedUser = userRepository.save(user);

                return new UserResponse(
                    updatedUser.getId(),
                    updatedUser.getCognitoUserId(),
                    updatedUser.getFirstName(),
                    updatedUser.getLastName(),
                    updatedUser.getEmail()
                );
            })
            .orElse(new UserResponse("User not found"));
    }

    // New JWT-based methods
    public UserResponse getCurrentUser() {
        String cognitoUserId = jwtService.getCurrentUserCognitoId();
        return getUserByCognitoId(cognitoUserId);
    }

    @Transactional
    public UserResponse updateCurrentUserStorage(Long storageUsedBytes) {
        String cognitoUserId = jwtService.getCurrentUserCognitoId();
        return updateUserStorage(cognitoUserId, storageUsedBytes);
    }
}
