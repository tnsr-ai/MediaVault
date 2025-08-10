package ai.tnsr.mediavault.user;

import ai.tnsr.mediavault.user.dto.CognitoUserSignupRequest;
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
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@Tag(name = "User Management", description = "APIs for managing users in MediaVault platform")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(
        summary = "Create user from AWS Cognito signup",
        description = "This endpoint is called by AWS Lambda when a user completes signup in Cognito. It creates a corresponding user record in the MediaVault database.",
        tags = {"User Management"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "User created successfully",
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
            responseCode = "409",
            description = "User already exists",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "message": "User with this Cognito ID already exists"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    @PostMapping("/cognito-signup")
    public ResponseEntity<UserResponse> createUserFromCognito(
        @Parameter(
            description = "User signup data from AWS Cognito",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CognitoUserSignupRequest.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "cognito_user_id": "us-east-1:12345678-1234-1234-1234-123456789012",
                        "first_name": "John",
                        "last_name": "Doe",
                        "email": "john.doe@example.com"
                    }
                    """
                )
            )
        )
        @Valid @RequestBody CognitoUserSignupRequest request) {
        try {
            UserResponse response = userService.createUserFromCognito(request);

            // Check if creation was successful by looking at the response
            if (response.getId() != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                // User already exists or validation failed
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new UserResponse("Failed to create user: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Get user by Cognito User ID",
        description = "Retrieves user information using their AWS Cognito User ID (sub claim from JWT)",
        tags = {"User Management"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User found successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "message": "User not found"
                    }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error"
        )
    })
    @GetMapping("/cognito/{cognitoUserId}")
    public ResponseEntity<UserResponse> getUserByCognitoId(
        @Parameter(
            description = "AWS Cognito User ID (sub claim from JWT)",
            required = true,
            example = "us-east-1:12345678-1234-1234-1234-123456789012"
        )
        @PathVariable String cognitoUserId) {
        try {
            UserResponse response = userService.getUserByCognitoId(cognitoUserId);

            if (response.getId() != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new UserResponse("Failed to retrieve user: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Health check",
        description = "Simple health check endpoint to verify if the user service is running",
        tags = {"User Management"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Service is healthy",
            content = @Content(
                mediaType = "text/plain",
                examples = @ExampleObject(value = "User service is running")
            )
        )
    })
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("User service is running");
    }
}
