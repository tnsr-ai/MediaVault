package ai.tnsr.mediavault.user.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request payload for updating user storage usage")
public class UpdateStorageRequest {

    @NotNull(message = "Storage used bytes is required")
    @Min(value = 0, message = "Storage used bytes must be non-negative")
    @Schema(description = "Current storage usage in bytes",
            example = "1073741824",
            required = true,
            minimum = "0")
    private Long storageUsedBytes;

    // Default constructor
    public UpdateStorageRequest() {}

    // Constructor
    public UpdateStorageRequest(Long storageUsedBytes) {
        this.storageUsedBytes = storageUsedBytes;
    }

    // Getter and Setter
    public Long getStorageUsedBytes() {
        return storageUsedBytes;
    }

    public void setStorageUsedBytes(Long storageUsedBytes) {
        this.storageUsedBytes = storageUsedBytes;
    }
}
