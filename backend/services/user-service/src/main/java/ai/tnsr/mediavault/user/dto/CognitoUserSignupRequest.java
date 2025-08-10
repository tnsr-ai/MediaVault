package ai.tnsr.mediavault.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request payload for creating a user from AWS Cognito signup")
public class CognitoUserSignupRequest {
    @JsonProperty("cognito_user_id")
    @NotBlank(message = "Cognito user ID is required")
    @Size(max = 255, message = "Cognito user ID must not exceed 255 characters")
    @Schema(description = "The unique identifier from AWS Cognito (sub claim from JWT)",
            example = "us-east-1:12345678-1234-1234-1234-123456789012",
            required = true)
    private String cognitoUserId;

    @JsonProperty("first_name")
    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must not exceed 100 characters")
    @Schema(description = "User's first name",
            example = "John",
            required = true,
            maxLength = 100)
    private String firstName;

    @JsonProperty("last_name")
    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must not exceed 100 characters")
    @Schema(description = "User's last name",
            example = "Doe",
            required = true,
            maxLength = 100)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Schema(description = "User's email address",
            example = "john.doe@example.com",
            required = true,
            maxLength = 255,
            format = "email")
    private String email;

    // Default constructor
    public CognitoUserSignupRequest() {}

    // Constructor
    public CognitoUserSignupRequest(String cognitoUserId, String firstName, String lastName, String email) {
        this.cognitoUserId = cognitoUserId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Getters and Setters
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
}
