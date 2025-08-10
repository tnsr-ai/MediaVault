package ai.tnsr.mediavault.health;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Tag(name = "Health", description = "Health check endpoints for monitoring and load balancers")
public class HealthController {

    @Operation(
        summary = "Health check",
        description = "Simple health check endpoint to verify if the user service is running. No authentication required.",
        tags = {"Health"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Service is healthy",
            content = @Content(
                mediaType = "text/plain",
                examples = @ExampleObject(value = "User service is running")
            )
        )
    })
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("User service is running");
    }
}
