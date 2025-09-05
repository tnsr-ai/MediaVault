package ai.tnsr.mediavault.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Standard API response wrapper following Google JSON style guide
 * @param <T> Type of the data being returned
 */
@Schema(description = "Standard API response wrapper")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    @Schema(description = "API version", example = "1.0")
    @JsonProperty("apiVersion")
    private String apiVersion = "1.0";

    @Schema(description = "Unique identifier for this response", example = "req_123456789")
    @JsonProperty("id")
    private String id;

    @Schema(description = "HTTP status code", example = "200")
    @JsonProperty("code")
    private Integer code;

    @Schema(description = "Human-readable message", example = "Success")
    @JsonProperty("message")
    private String message;

    @Schema(description = "The actual data payload")
    @JsonProperty("data")
    private T data;

    @Schema(description = "Error details if the request failed")
    @JsonProperty("error")
    private ErrorDetail error;

    // Constructors
    public ApiResponse() {}

    public ApiResponse(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(Integer code, String message, ErrorDetail error) {
        this.code = code;
        this.message = message;
        this.error = error;
    }

    // Static factory methods for success responses
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "Success", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }

    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(201, "Created successfully", data);
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(201, message, data);
    }

    // Static factory methods for error responses
    public static <T> ApiResponse<T> error(Integer code, String message, String reason) {
        ErrorDetail error = new ErrorDetail(code, message, reason);
        return new ApiResponse<>(code, message, error);
    }

    public static <T> ApiResponse<T> badRequest(String message, String reason) {
        return error(400, message, reason);
    }

    public static <T> ApiResponse<T> unauthorized(String message) {
        return error(401, message, "Authentication required or invalid credentials");
    }

    public static <T> ApiResponse<T> forbidden(String message) {
        return error(403, message, "Access to this resource is forbidden");
    }

    public static <T> ApiResponse<T> notFound(String message) {
        return error(404, message, "The requested resource was not found");
    }

    public static <T> ApiResponse<T> conflict(String message, String reason) {
        return error(409, message, reason);
    }

    public static <T> ApiResponse<T> internalServerError(String message) {
        return error(500, message, "An unexpected error occurred");
    }

    // Getters and Setters
    public String getApiVersion() {
        return apiVersion;
    }

    public void setApiVersion(String apiVersion) {
        this.apiVersion = apiVersion;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public ErrorDetail getError() {
        return error;
    }

    public void setError(ErrorDetail error) {
        this.error = error;
    }
}
