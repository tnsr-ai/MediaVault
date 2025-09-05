package ai.tnsr.mediavault.user.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = CognitoUserIdValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface CognitoUserId {
    String message() default "Invalid Cognito User ID format. Expected format: region:uuid (e.g., ap-south-1:71635d7a-50f1-708e-6f6f-f7d7d1a23e63)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
