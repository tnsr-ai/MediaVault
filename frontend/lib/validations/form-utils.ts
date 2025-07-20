import { theme } from "@/lib/theme";
import type { FieldError, Path, UseFormReturn } from "react-hook-form";

// Error message component styles
export const getErrorMessageStyles = () => {
	return "text-red-500 text-sm mt-1 block";
};

// Enhanced input styles with error state
export const getInputWithErrorStyles = (error?: FieldError) => {
	const baseStyles =
		"flex h-10 sm:h-12 w-full rounded-lg border px-4 py-2 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

	if (error) {
		return `${baseStyles} border-red-500 focus-visible:ring-red-500`;
	}

	return `${baseStyles} border-[${theme.colors.ui.border}] bg-[${theme.colors.ui.background}]`;
};

// Form field error display component props
export interface FormFieldErrorProps {
	error?: FieldError;
	className?: string;
}

// Utility to get form field props for easier integration
export const getFormFieldProps = <T extends Record<string, unknown>>(
	form: UseFormReturn<T>,
	fieldName: Path<T>,
) => {
	const fieldError = form.formState.errors[fieldName] as FieldError | undefined;

	return {
		...form.register(fieldName),
		error: fieldError,
		className: getInputWithErrorStyles(fieldError),
		"aria-invalid": !!fieldError,
		"aria-describedby": fieldError ? `${String(fieldName)}-error` : undefined,
	};
};

// Form submission handler wrapper with loading state
export const createFormSubmitHandler = <T extends Record<string, unknown>>(
	onSubmit: (data: T) => Promise<void> | void,
	setIsLoading?: (loading: boolean) => void,
) => {
	return async (data: T) => {
		try {
			setIsLoading?.(true);
			await onSubmit(data);
		} catch (error) {
			console.error("Form submission error:", error);
			// You can add toast notifications here
		} finally {
			setIsLoading?.(false);
		}
	};
};

// Validation trigger options for different form behaviors
export const validationTriggerOptions = {
	// Validate on submit only (default)
	onSubmit: {
		mode: "onSubmit" as const,
		reValidateMode: "onChange" as const,
	},
	// Validate on blur
	onBlur: {
		mode: "onBlur" as const,
		reValidateMode: "onChange" as const,
	},
	// Validate on every change (more responsive but can be overwhelming)
	onChange: {
		mode: "onChange" as const,
		reValidateMode: "onChange" as const,
	},
	// Validate on submit, then on change for better UX
	hybrid: {
		mode: "onSubmit" as const,
		reValidateMode: "onChange" as const,
	},
};
