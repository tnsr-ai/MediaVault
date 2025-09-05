package ai.tnsr.mediavault.health;

import ai.tnsr.mediavault.common.dto.ApiResponse;
import ai.tnsr.mediavault.common.dto.HealthData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;

import java.time.Instant;

@RestController
@RequestMapping("/api")
@Tag(name = "Health", description = "Health check endpoints for monitoring and load balancers")
public class HealthController {

    @Operation(
        summary = "Health check",
        description = "Simple health check endpoint to verify if the user service is running. No authentication required.",
        tags = {"Health"}
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Service is healthy",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class),
                examples = @ExampleObject(
                    value = """
                    {
                        "apiVersion": "1.0",
                        "code": 200,
                        "message": "Service is healthy",
                        "data": {
                            "service": "user-service",
                            "status": "UP",
                            "version": "1.0.0",
                            "timestamp": "2024-01-01T10:00:00Z"
                        }
                    }
                    """
                )
            )
        )
    })
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<HealthData>> healthCheck() {
        HealthData healthData = new HealthData(
            "user-service",
            "UP",
            "1.0.0",
            Instant.now().toString()
        );

        ApiResponse<HealthData> response = ApiResponse.success("Service is healthy", healthData);
        return ResponseEntity.ok(response);
    }
}
