import { getErrorMessageStyles } from "@/lib/validations/form-utils";
import type { FieldError } from "react-hook-form";

interface FormErrorProps {
	error?: FieldError;
	id?: string;
	className?: string;
}

export function FormError({ error, id, className }: FormErrorProps) {
	if (!error) return null;

	return (
		<span
			id={id}
			className={`${getErrorMessageStyles()} ${className || ""}`}
			role="alert"
			aria-live="polite"
		>
			{error.message}
		</span>
	);
}
