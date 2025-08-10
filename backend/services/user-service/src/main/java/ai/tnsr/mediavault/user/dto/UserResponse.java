package ai.tnsr.mediavault.user.dto;

import java.util.UUID;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response payload containing user information or operation result")
public class UserResponse {
    @Schema(description = "Unique identifier of the user",
            example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "AWS Cognito User ID",
            example = "us-east-1:12345678-1234-1234-1234-123456789012")
    private String cognitoUserId;

    @Schema(description = "User's first name",
            example = "John")
    private String firstName;

    @Schema(description = "User's last name",
            example = "Doe")
    private String lastName;

    @Schema(description = "User's email address",
            example = "john.doe@example.com")
    private String email;

    @Schema(description = "Response message indicating the result of the operation",
            example = "User created successfully")
    private String message;

    // Default constructor
    public UserResponse() {}

    // Constructor for success response
    public UserResponse(UUID id, String cognitoUserId, String firstName, String lastName, String email) {
        this.id = id;
        this.cognitoUserId = cognitoUserId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.message = "User created successfully";
    }

    // Constructor for message only
    public UserResponse(String message) {
        this.message = message;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCognitoUserId() {
        return cognitoUserId;
    }

    public void setCognitoUserId(String cognitoUserId) {
        this.cognitoUserId = cognitoUserId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
