package ai.tnsr.mediavault.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Health check response data
 */
@Schema(description = "Health check status information")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HealthData {

    @Schema(description = "Service name", example = "user-service")
    @JsonProperty("service")
    private String service;

    @Schema(description = "Service status", example = "UP")
    @JsonProperty("status")
    private String status;

    @Schema(description = "Service version", example = "1.0.0")
    @JsonProperty("version")
    private String version;

    @Schema(description = "Current timestamp", example = "2024-01-01T10:00:00Z")
    @JsonProperty("timestamp")
    private String timestamp;

    // Constructors
    public HealthData() {}

    public HealthData(String service, String status, String version, String timestamp) {
        this.service = service;
        this.status = status;
        this.version = version;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
