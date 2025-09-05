"use client";

import { type UserProfile, userApi } from "@/lib/api/user";
import { config } from "@/lib/config";
import type { Metadata } from "next";
import { useEffect, useState } from "react";

export default function DashboardPage() {
	const [userData, setUserData] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await userApi.getUserMe();
				setUserData(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load user data",
				);
				console.error("Error fetching user data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Loading user data...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-red-500 text-lg">Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Dashboard</h1>

			<div className="bg-white shadow-md rounded-lg p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">User Profile</h2>
				{userData ? (
					<div className="space-y-2">
						<pre className="bg-gray-100 p-4 rounded-md overflow-auto">
							{JSON.stringify(userData, null, 2)}
						</pre>
					</div>
				) : (
					<div>No user data available</div>
				)}
			</div>

			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<p className="text-blue-800">
					Successfully connected to the protected API endpoint:{" "}
					<code>/api/users/me</code>
				</p>
			</div>
		</div>
	);
}
