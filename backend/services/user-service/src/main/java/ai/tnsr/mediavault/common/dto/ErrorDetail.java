package ai.tnsr.mediavault.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * Error detail structure following Google JSON style guide
 */
@Schema(description = "Error details for failed API responses")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorDetail {

    @Schema(description = "Error code", example = "400")
    @JsonProperty("code")
    private Integer code;

    @Schema(description = "Error message", example = "Invalid request")
    @JsonProperty("message")
    private String message;

    @Schema(description = "Detailed reason for the error", example = "The 'email' field is required")
    @JsonProperty("reason")
    private String reason;

    @Schema(description = "Location of the error (e.g., field name)", example = "email")
    @JsonProperty("location")
    private String location;

    @Schema(description = "Type of error location", example = "parameter")
    @JsonProperty("locationType")
    private String locationType;

    @Schema(description = "Additional error details for complex errors")
    @JsonProperty("errors")
    private List<ErrorDetail> errors;

    // Constructors
    public ErrorDetail() {}

    public ErrorDetail(Integer code, String message, String reason) {
        this.code = code;
        this.message = message;
        this.reason = reason;
    }

    public ErrorDetail(Integer code, String message, String reason, String location, String locationType) {
        this.code = code;
        this.message = message;
        this.reason = reason;
        this.location = location;
        this.locationType = locationType;
    }

    // Getters and Setters
    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLocationType() {
        return locationType;
    }

    public void setLocationType(String locationType) {
        this.locationType = locationType;
    }

    public List<ErrorDetail> getErrors() {
        return errors;
    }

    public void setErrors(List<ErrorDetail> errors) {
        this.errors = errors;
    }
}
