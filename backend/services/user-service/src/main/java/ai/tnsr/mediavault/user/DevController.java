package ai.tnsr.mediavault.user;

import ai.tnsr.mediavault.common.dto.ApiResponse;
import ai.tnsr.mediavault.user.dto.CognitoUserSignupRequest;
import ai.tnsr.mediavault.user.dto.UserData;
import ai.tnsr.mediavault.user.model.User;
import ai.tnsr.mediavault.user.service.UserDataMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

    @Autowired
    private UserDataMapper userDataMapper;

    @Operation(
        summary = "Sync user from Cognito signup (Development Only)",
        description = "Development endpoint to simulate AWS Lambda trigger. Creates a user record after Cognito signup. This endpoint is only available in development profile and does not require authentication.",
        tags = {"Development"}
    )
    @SecurityRequirements() // Override global security - no authentication required
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "User created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 201,
                        "message": "User created successfully",
                        "data": {
                            "id": "123e4567-e89b-12d3-a456-426614174000",
                            "cognitoUserId": "ap-south-1:71635d7a-50f1-708e-6f6f-f7d7d1a23e63",
                            "firstName": "John",
                            "lastName": "Doe",
                            "email": "john.doe@example.com"
                        }
                    }
                    """
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409",
            description = "User already exists",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 409,
                        "message": "Conflict",
                        "error": {
                            "code": 409,
                            "message": "User already exists",
                            "reason": "A user with this Cognito ID already exists"
                        }
                    }
                    """
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Invalid request data",
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
                            "message": "Invalid request data",
                            "reason": "Required fields are missing or invalid"
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
    @PostMapping("/sync-user")
    public ResponseEntity<ApiResponse<UserData>> syncUserFromCognito(
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
            User newUser = userService.createUserFromCognitoEntity(request);

            if (newUser != null) {
                // Convert User entity to UserData using mapper
                UserData userData = userDataMapper.toUserData(newUser);

                ApiResponse<UserData> response = ApiResponse.created("User created successfully", userData);
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                ApiResponse<UserData> response = ApiResponse.conflict("User already exists", "A user with this Cognito ID or email already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
        } catch (IllegalArgumentException e) {
            ApiResponse<UserData> response = ApiResponse.badRequest("Invalid request data", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            ApiResponse<UserData> response = ApiResponse.internalServerError("Failed to create user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
