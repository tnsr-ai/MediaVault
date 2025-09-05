package ai.tnsr.mediavault.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

/**
 * User data response DTO for API responses
 */
@Schema(description = "User information data")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserData {

    @Schema(description = "Unique identifier of the user", example = "123e4567-e89b-12d3-a456-426614174000")
    @JsonProperty("id")
    private UUID id;

    @Schema(description = "AWS Cognito User ID", example = "us-east-1:12345678-1234-1234-1234-123456789012")
    @JsonProperty("cognitoUserId")
    private String cognitoUserId;

    @Schema(description = "User's first name", example = "John")
    @JsonProperty("firstName")
    private String firstName;

    @Schema(description = "User's last name", example = "Doe")
    @JsonProperty("lastName")
    private String lastName;

    @Schema(description = "User's email address", example = "john.doe@example.com")
    @JsonProperty("email")
    private String email;

    @Schema(description = "User's current storage usage in bytes", example = "1073741824")
    @JsonProperty("storageUsedBytes")
    private Long storageUsedBytes;

    @Schema(description = "User's storage quota in bytes", example = "5368709120")
    @JsonProperty("storageQuotaBytes")
    private Long storageQuotaBytes;

    @Schema(description = "Account creation timestamp", example = "2024-01-01T10:00:00Z")
    @JsonProperty("createdAt")
    private String createdAt;

    @Schema(description = "Last update timestamp", example = "2024-01-01T10:00:00Z")
    @JsonProperty("updatedAt")
    private String updatedAt;

    // Constructors
    public UserData() {}

    public UserData(UUID id, String cognitoUserId, String firstName, String lastName, String email) {
        this.id = id;
        this.cognitoUserId = cognitoUserId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
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

    public Long getStorageUsedBytes() {
        return storageUsedBytes;
    }

    public void setStorageUsedBytes(Long storageUsedBytes) {
        this.storageUsedBytes = storageUsedBytes;
    }

    public Long getStorageQuotaBytes() {
        return storageQuotaBytes;
    }

    public void setStorageQuotaBytes(Long storageQuotaBytes) {
        this.storageQuotaBytes = storageQuotaBytes;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
