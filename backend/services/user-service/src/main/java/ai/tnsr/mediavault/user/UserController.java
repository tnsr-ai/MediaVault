package ai.tnsr.mediavault.user;

import ai.tnsr.mediavault.common.dto.ApiResponse;
import ai.tnsr.mediavault.user.dto.UpdateStorageRequest;
import ai.tnsr.mediavault.user.dto.UserData;
import ai.tnsr.mediavault.user.model.User;
import ai.tnsr.mediavault.user.service.UserDataMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@Tag(name = "User Management", description = "Secure JWT-based APIs for managing users in MediaVault platform")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserDataMapper userDataMapper;

    @Operation(
        summary = "Get current user profile",
        description = "Retrieves the profile of the currently authenticated user based on JWT token. The user ID is extracted from the JWT 'sub' claim.",
        tags = {"User Management"},
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "User profile retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 200,
                        "message": "User profile retrieved successfully",
                        "data": {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "cognitoUserId": "ap-south-1:71635d7a-50f1-708e-6f6f-f7d7d1a23e63",
                            "firstName": "John",
                            "lastName": "Doe",
                            "email": "john.doe@example.com",
                            "storageUsedBytes": 1073741824,
                            "storageQuotaBytes": 5368709120
                        }
                    }
                    """
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing JWT token",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 401,
                        "message": "Unauthorized",
                        "error": {
                            "code": 401,
                            "message": "Unauthorized",
                            "reason": "Authentication required or invalid credentials"
                        }
                    }
                    """
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "User not found in database",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 404,
                        "message": "User not found",
                        "error": {
                            "code": 404,
                            "message": "User not found",
                            "reason": "The requested resource was not found"
                        }
                    }
                    """
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 500,
                        "message": "Internal server error",
                        "error": {
                            "code": 500,
                            "message": "Internal server error",
                            "reason": "An unexpected error occurred"
                        }
                    }
                    """
                )
            )
        )
    })
    @GetMapping("/users/me")
    public ResponseEntity<ApiResponse<UserData>> getCurrentUser(HttpServletRequest request) {
        logger.info("GET /api/users/me - Request received");

        try {
            User userEntity = userService.getCurrentUserEntity();

            if (userEntity != null) {
                logger.info("Successfully retrieved user: {}", userEntity.getEmail());

                // Convert User entity to UserData using mapper
                UserData userData = userDataMapper.toUserData(userEntity);

                ApiResponse<UserData> response = ApiResponse.success("User profile retrieved successfully", userData);
                return ResponseEntity.ok(response);
            } else {
                logger.warn("User not found in database");
                ApiResponse<UserData> response = ApiResponse.notFound("User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (SecurityException e) {
            logger.error("Authentication error: {}", e.getMessage());
            ApiResponse<UserData> response = ApiResponse.unauthorized("Unauthorized: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            logger.error("Unexpected error retrieving current user: {}", e.getMessage(), e);
            ApiResponse<UserData> response = ApiResponse.internalServerError("Failed to retrieve user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @Operation(
        summary = "Update current user's storage usage",
        description = "Updates the storage usage for the currently authenticated user. Called by media-service after file uploads. User ID is extracted from JWT token.",
        tags = {"User Management"},
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Storage updated successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 200,
                        "message": "Storage updated successfully",
                        "data": {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "cognitoUserId": "ap-south-1:71635d7a-50f1-708e-6f6f-f7d7d1a23e63",
                            "firstName": "John",
                            "lastName": "Doe",
                            "email": "john.doe@example.com",
                            "storageUsedBytes": 2147483648,
                            "storageQuotaBytes": 5368709120
                        }
                    }
                    """
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Storage exceeds quota or invalid request",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 400,
                        "message": "Bad Request",
                        "error": {
                            "code": 400,
                            "message": "Storage usage exceeds quota limit",
                            "reason": "The requested storage usage exceeds the user's quota"
                        }
                    }
                    """
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing JWT token",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 401,
                        "message": "Unauthorized",
                        "error": {
                            "code": 401,
                            "message": "Unauthorized",
                            "reason": "Authentication required or invalid credentials"
                        }
                    }
                    """
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "User not found in database",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 404,
                        "message": "User not found",
                        "error": {
                            "code": 404,
                            "message": "User not found",
                            "reason": "The requested resource was not found"
                        }
                    }
                    """
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 500,
                        "message": "Internal server error",
                        "error": {
                            "code": 500,
                            "message": "Internal server error",
                            "reason": "An unexpected error occurred"
                        }
                    }
                    """
                )
            )
        )
    })
    @PutMapping("/users/me/storage")
    public ResponseEntity<ApiResponse<UserData>> updateCurrentUserStorage(
        @Parameter(
            description = "Storage usage update data",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UpdateStorageRequest.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "storageUsedBytes": 1073741824
                    }
                    """
                )
            )
        )
        @Valid @RequestBody UpdateStorageRequest request) {
        try {
            User updatedUser = userService.updateCurrentUserStorageEntity(request.getStorageUsedBytes());

            if (updatedUser != null) {
                // Convert User entity to UserData using mapper
                UserData userData = userDataMapper.toUserData(updatedUser);

                ApiResponse<UserData> response = ApiResponse.success("Storage updated successfully", userData);
                return ResponseEntity.ok(response);
            } else {
                ApiResponse<UserData> response = ApiResponse.notFound("User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (IllegalArgumentException e) {
            ApiResponse<UserData> response = ApiResponse.badRequest("Bad Request", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (SecurityException e) {
            ApiResponse<UserData> response = ApiResponse.unauthorized("Unauthorized: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            ApiResponse<UserData> response = ApiResponse.internalServerError("Failed to update storage: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
