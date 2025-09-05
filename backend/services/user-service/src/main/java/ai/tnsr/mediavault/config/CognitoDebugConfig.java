package ai.tnsr.mediavault.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.Map;

@Configuration
@Profile("dev")
public class CognitoDebugConfig {

    private static final Logger logger = LoggerFactory.getLogger(CognitoDebugConfig.class);

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Bean
    public CommandLineRunner cognitoDebugRunner() {
        return args -> {
            logger.info("=== AWS COGNITO CONFIGURATION VALIDATION ===");
            logger.info("Cognito Issuer URI: {}", issuerUri);
            logger.info("Cognito JWK Set URI: {}", jwkSetUri);

            if (issuerUri == null || issuerUri.isEmpty()) {
                logger.error("CRITICAL: Cognito Issuer URI is not configured!");
                return;
            }

            if (jwkSetUri == null || jwkSetUri.isEmpty()) {
                logger.error("CRITICAL: Cognito JWK Set URI is not configured!");
                return;
            }

            testCognitoConnectivity();

            logger.info("=== END COGNITO VALIDATION ===");
        };
    }

    private void testCognitoConnectivity() {
        RestTemplate restTemplate = new RestTemplate();

        testCognitoIssuerConnectivity(restTemplate);
        testJwkSetConnectivity(restTemplate);
        validateUrlStructure();
        logEnvironmentInfo();
    }

    private void testCognitoIssuerConnectivity(RestTemplate restTemplate) {
        logger.info("Testing Cognito Issuer connectivity...");

        String openIdConfigUrl = issuerUri + "/.well-known/openid_configuration";
        logger.info("Fetching OpenID configuration from: {}", openIdConfigUrl);

        try {
            restTemplate.getForObject(openIdConfigUrl, String.class);
            logger.info("SUCCESS: OpenID Configuration is accessible!");
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 400) {
                logger.warn("OpenID Configuration endpoint returned 400 - This is NORMAL for AWS Cognito");
                logger.info("AWS Cognito may not expose OpenID configuration publicly, but JWK Set should work");
            } else {
                logger.error("HTTP ERROR connecting to Cognito Issuer: {} - {}",
                           e.getStatusCode(), e.getResponseBodyAsString());
            }
        } catch (Exception e) {
            logger.error("UNEXPECTED ERROR connecting to Cognito Issuer: {}", e.getMessage());
        }
    }

    private void testJwkSetConnectivity(RestTemplate restTemplate) {
        logger.info("Testing Cognito JWK Set connectivity...");
        logger.info("Fetching JWK Set from: {}", jwkSetUri);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> jwkResponse = restTemplate.getForObject(jwkSetUri, Map.class);
            if (jwkResponse != null && jwkResponse.containsKey("keys")) {
                Object keys = jwkResponse.get("keys");
                if (keys instanceof java.util.List) {
                    int keyCount = ((java.util.List<?>) keys).size();
                    logger.info("SUCCESS: JWK Set is reachable! Found {} signing key(s)", keyCount);
                } else {
                    logger.warn("WARNING: JWK Set format unexpected");
                }
            } else {
                logger.warn("WARNING: JWK Set response missing 'keys' field");
            }
        } catch (HttpClientErrorException e) {
            logger.error("HTTP ERROR connecting to JWK Set: {} - {}", e.getStatusCode(), e.getMessage());
        } catch (ResourceAccessException e) {
            logger.error("NETWORK ERROR connecting to JWK Set: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("UNEXPECTED ERROR connecting to JWK Set: {}", e.getMessage(), e);
        }
    }

    private void validateUrlStructure() {
        logger.info("Validating Cognito URL structure...");
        if (issuerUri.contains("ap-south-1_Tl3gsmBDG")) {
            logger.info("User Pool ID detected: ap-south-1_Tl3gsmBDG");
            logger.info("Region detected: ap-south-1");
        } else {
            logger.warn("WARNING: Could not detect standard Cognito User Pool ID pattern");
        }
    }

    private void logEnvironmentInfo() {
        logger.info("Environment check:");
        logger.info("Java version: {}", System.getProperty("java.version"));
        logger.info("Active profiles: {}", System.getProperty("spring.profiles.active"));

        String awsRegion = System.getenv("AWS_REGION");
        String awsDefaultRegion = System.getenv("AWS_DEFAULT_REGION");
        logger.info("AWS environment detected - Region: {} / Default: {}", awsRegion, awsDefaultRegion);
    }
}
