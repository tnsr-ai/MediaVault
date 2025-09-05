package ai.tnsr.mediavault.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class JwtService {

    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);

    private static final Pattern COGNITO_USER_ID_PATTERN = Pattern.compile(
        "^[a-z0-9-]+:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$"
    );

    public String getCurrentUserCognitoId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            logger.error("No authentication found in SecurityContext");
            throw new SecurityException("No authenticated user found - authentication is null");
        }

        if (authentication.getPrincipal() instanceof Jwt jwt) {
            String subjectUuid = jwt.getSubject();
            String issuer = jwt.getIssuer() != null ? jwt.getIssuer().toString() : null;

            if (subjectUuid == null || subjectUuid.isEmpty()) {
                logger.error("JWT subject (UUID) is null or empty");
                throw new SecurityException("JWT subject is null or empty");
            }

            if (issuer == null || issuer.isEmpty()) {
                logger.error("JWT issuer is null or empty");
                throw new SecurityException("JWT issuer is null or empty");
            }

            String region = extractRegionFromIssuer(issuer);
            if (region == null) {
                logger.error("Could not extract region from issuer: {}", issuer);
                throw new SecurityException("Could not extract region from JWT issuer");
            }

            String cognitoUserId = region + ":" + subjectUuid;

            if (!COGNITO_USER_ID_PATTERN.matcher(cognitoUserId).matches()) {
                logger.warn("Cognito User ID format validation failed. Expected format: region:uuid, got: {}", cognitoUserId);
            }

            return cognitoUserId;
        } else {
            logger.error("Authentication principal is not a JWT. Actual type: {}",
                authentication.getPrincipal().getClass().getSimpleName());
            throw new SecurityException("No authenticated user found - principal is not JWT");
        }
    }

    private String extractRegionFromIssuer(String issuer) {
        try {
            Pattern issuerPattern = Pattern.compile("https://cognito-idp\\.([a-z0-9-]+)\\.amazonaws\\.com/.*");
            java.util.regex.Matcher matcher = issuerPattern.matcher(issuer);

            if (matcher.matches()) {
                return matcher.group(1);
            } else {
                logger.error("Issuer does not match expected Cognito pattern: {}", issuer);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error extracting region from issuer: {}", e.getMessage(), e);
            return null;
        }
    }

    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaimAsString("email");
        }
        logger.error("No authenticated user found for email extraction");
        throw new SecurityException("No authenticated user found");
    }

    public String getCurrentUserFirstName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaimAsString("given_name");
        }
        return null;
    }

    public String getCurrentUserLastName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaimAsString("family_name");
        }
        return null;
    }
}
