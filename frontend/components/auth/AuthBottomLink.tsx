import { getLinkStyles, theme } from "@/lib/theme";
import Link from "next/link";

interface AuthBottomLinkProps {
	prompt: string;
	linkText: string;
	href: string;
	className?: string;
}

export default function AuthBottomLink({
	prompt,
	linkText,
	href,
	className = "text-center",
}: AuthBottomLinkProps) {
	return (
		<div className={className}>
			<span
				className={`text-sm sm:text-base ${theme.colors.ui.text.secondary} tracking-tight`}
			>
				{prompt}{" "}
			</span>
			<Link href={href} className={getLinkStyles()}>
				{linkText}
			</Link>
		</div>
	);
}
