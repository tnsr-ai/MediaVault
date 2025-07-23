interface OrDividerProps {
	text?: string;
	className?: string;
}

export default function OrDivider({
	text = "OR",
	className = "",
}: OrDividerProps) {
	return (
		<div className={`relative my-6 ${className}`}>
			<div className="absolute inset-0 flex items-center">
				<span className="w-full border-t border-gray-300" />
			</div>
			<div className="relative flex justify-center text-sm">
				<span className="bg-white px-2 text-gray-500 font-medium">{text}</span>
			</div>
		</div>
	);
}
