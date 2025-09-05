package ai.tnsr.mediavault.user;

import ai.tnsr.mediavault.user.dto.CognitoUserSignupRequest;
import ai.tnsr.mediavault.user.dto.UserResponse;
import ai.tnsr.mediavault.user.model.User;
import ai.tnsr.mediavault.user.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

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

    // New method to create user and return User entity
    @Transactional
    public User createUserFromCognitoEntity(CognitoUserSignupRequest request) {
        // Check if user already exists by Cognito ID
        if (userRepository.existsByCognitoUserId(request.getCognitoUserId())) {
            return null; // Indicates user already exists
        }

        // Check if user already exists by email
        if (userRepository.existsByEmail(request.getEmail())) {
            return null; // Indicates user already exists
        }

        // Create new user
        User user = new User();
        user.setCognitoUserId(request.getCognitoUserId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        // Save user to database
        return userRepository.save(user);
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
        try {
            String cognitoUserId = jwtService.getCurrentUserCognitoId();
            return getUserByCognitoId(cognitoUserId);
        } catch (Exception e) {
            logger.error("Failed to get current user from JWT: {}", e.getMessage(), e);
            throw e;
        }
    }

    // New method to get User entity directly
    public User getCurrentUserEntity() {
        try {
            String cognitoUserId = jwtService.getCurrentUserCognitoId();
            return userRepository.findByCognitoUserId(cognitoUserId)
                .orElse(null);
        } catch (Exception e) {
            logger.error("Failed to get current user entity from JWT: {}", e.getMessage(), e);
            throw e;
        }
    }

    // New method to get User entity by Cognito ID
    public User getUserEntityByCognitoId(String cognitoUserId) {
        return userRepository.findByCognitoUserId(cognitoUserId)
            .orElse(null);
    }

    @Transactional
    public UserResponse updateCurrentUserStorage(Long storageUsedBytes) {
        try {
            String cognitoUserId = jwtService.getCurrentUserCognitoId();
            return updateUserStorage(cognitoUserId, storageUsedBytes);
        } catch (Exception e) {
            logger.error("Failed to update current user storage from JWT: {}", e.getMessage(), e);
            throw e;
        }
    }

    // New method to update and return User entity
    @Transactional
    public User updateCurrentUserStorageEntity(Long storageUsedBytes) {
        try {
            String cognitoUserId = jwtService.getCurrentUserCognitoId();
            return userRepository.findByCognitoUserId(cognitoUserId)
                .map(user -> {
                    // Check if the new storage usage exceeds quota
                    if (storageUsedBytes > user.getStorageQuotaBytes()) {
                        throw new IllegalArgumentException("Storage usage exceeds quota limit");
                    }

                    user.setStorageUsedBytes(storageUsedBytes);
                    return userRepository.save(user);
                })
                .orElse(null);
        } catch (Exception e) {
            logger.error("Failed to update current user storage entity from JWT: {}", e.getMessage(), e);
            throw e;
        }
    }
}
