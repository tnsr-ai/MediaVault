package ai.tnsr.mediavault.user.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class CognitoUserIdValidator implements ConstraintValidator<CognitoUserId, String> {

    // Pattern to match AWS Cognito User ID format: region:uuid
    // Example: ap-south-1:71635d7a-50f1-708e-6f6f-f7d7d1a23e63
    private static final Pattern COGNITO_USER_ID_PATTERN = Pattern.compile(
        "^[a-z0-9-]+:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$"
    );

    @Override
    public void initialize(CognitoUserId constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return false; // Let @NotBlank handle null/empty validation
        }

        return COGNITO_USER_ID_PATTERN.matcher(value.trim()).matches();
    }
}
