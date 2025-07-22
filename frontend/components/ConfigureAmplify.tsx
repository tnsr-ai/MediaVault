"use client";

import { Amplify } from "aws-amplify";
import { useEffect } from "react";
import outputs from "../amplify_outputs.json";

export default function ConfigureAmplify() {
	useEffect(() => {
		// Configure Amplify on the client side
		Amplify.configure(outputs, {
			ssr: true, // Enable SSR support
		});
	}, []);

	return null;
}
