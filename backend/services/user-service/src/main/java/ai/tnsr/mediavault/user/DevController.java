package ai.tnsr.mediavault.user;

import ai.tnsr.mediavault.user.dto.CognitoUserSignupRequest;
import ai.tnsr.mediavault.user.dto.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/dev")
@Profile("dev")
@Tag(name = "Development", description = "Development-only endpoints for testing and local development")
public class DevController {

    @Autowired
    private UserService userService;

    @Operation(
        summary = "Sync user from Cognito signup (Development Only)",
        description = "Development endpoint to simulate AWS Lambda trigger. Creates a user record after Cognito signup. This endpoint is only available in development profile and does not require authentication.",
        tags = {"Development"}
    )
    @SecurityRequirements() // Override global security - no authentication required
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
                        "cognitoUserId": "ap-south-1:71635d7a-50f1-708e-6f6f-f7d7d1a23e63",
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
            description = "User already exists"
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
        )
    })
    @PostMapping("/sync-user")
    public ResponseEntity<UserResponse> syncUserFromCognito(
        @Parameter(
            description = "User signup data from AWS Cognito",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = CognitoUserSignupRequest.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "cognito_user_id": "ap-south-1:71635d7a-50f1-708e-6f6f-f7d7d1a23e63",
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

            if (response.getId() != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new UserResponse("Failed to create user: " + e.getMessage()));
        }
    }
}
