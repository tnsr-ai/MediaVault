package ai.tnsr.mediavault.user;

import ai.tnsr.mediavault.user.dto.UpdateStorageRequest;
import ai.tnsr.mediavault.user.dto.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "User Management", description = "Secure JWT-based APIs for managing users in MediaVault platform")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(
        summary = "Get current user profile",
        description = "Retrieves the profile of the currently authenticated user based on JWT token. The user ID is extracted from the JWT 'sub' claim.",
        tags = {"User Management"},
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User profile retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "cognitoUserId": "us-east-1:12345678-1234-1234-1234-123456789012",
                        "firstName": "John",
                        "lastName": "Doe",
                        "email": "john.doe@example.com"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing JWT token"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found in database"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    @GetMapping("/users/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        try {
            UserResponse response = userService.getCurrentUser();

            if (response.getId() != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new UserResponse("Unauthorized: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new UserResponse("Failed to retrieve user: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Update current user's storage usage",
        description = "Updates the storage usage for the currently authenticated user. Called by media-service after file uploads. User ID is extracted from JWT token.",
        tags = {"User Management"},
        security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Storage updated successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "cognitoUserId": "us-east-1:12345678-1234-1234-1234-123456789012",
                        "firstName": "John",
                        "lastName": "Doe",
                        "email": "john.doe@example.com",
                        "message": "User created successfully"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Storage exceeds quota or invalid request",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "message": "Storage usage exceeds quota limit"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Invalid or missing JWT token"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found in database"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    @PutMapping("/users/me/storage")
    public ResponseEntity<UserResponse> updateCurrentUserStorage(
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
            UserResponse response = userService.updateCurrentUserStorage(request.getStorageUsedBytes());

            if (response.getId() != null) {
                return ResponseEntity.ok(response);
            } else if (response.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new UserResponse("Unauthorized: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new UserResponse("Failed to update storage: " + e.getMessage()));
        }
    }
}
