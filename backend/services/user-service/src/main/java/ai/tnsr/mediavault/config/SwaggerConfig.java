package ai.tnsr.mediavault.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI userServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MediaVault User Service API")
                        .description("REST API for managing users in MediaVault platform. This service handles user creation from AWS Cognito triggers and user management operations.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("MediaVault Team")
                                .email("support@mediavault.com")
                                .url("https://mediavault.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development Server"),
                        new Server()
                                .url("https://api.mediavault.com")
                                .description("Production Server")
                ));
    }
}
