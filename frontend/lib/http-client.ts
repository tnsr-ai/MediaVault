import { fetchAuthSession } from "aws-amplify/auth";
import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import { apiConfig } from "./api-config";

class HttpClient {
	private client: AxiosInstance;

	constructor(baseURL?: string) {
		this.client = axios.create({
			baseURL: baseURL || apiConfig.baseUrl,
			timeout: apiConfig.timeout,
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Request interceptor
		this.client.interceptors.request.use(
			async (config) => {
				try {
					// Get auth session from Cognito
					const session = await fetchAuthSession();
					const token = session.tokens?.accessToken?.toString();

					if (token) {
						config.headers.Authorization = `Bearer ${token}`;
					}
				} catch {
					// User is not authenticated, continue without token
					console.debug("No auth session available");
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		// Response interceptor
		this.client.interceptors.response.use(
			(response) => response,
			(error) => {
				// Handle common errors
				if (error.response?.status === 401) {
					// Handle unauthorized - for now, just log and don't redirect
					console.error("Unauthorized access - 401 error");
					// TODO: Handle auth redirect when needed
					// window.location.href = "/auth";
				}
				return Promise.reject(error);
			},
		);
	}

	async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.client.get(url, config);
		return response.data;
	}

	async post<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response: AxiosResponse<T> = await this.client.post(
			url,
			data,
			config,
		);
		return response.data;
	}

	async put<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response: AxiosResponse<T> = await this.client.put(url, data, config);
		return response.data;
	}

	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response: AxiosResponse<T> = await this.client.delete(url, config);
		return response.data;
	}

	async patch<T>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response: AxiosResponse<T> = await this.client.patch(
			url,
			data,
			config,
		);
		return response.data;
	}
}

// Create a lazy singleton instance
let _httpClient: HttpClient | null = null;

export function getHttpClient(): HttpClient {
	if (!_httpClient) {
		_httpClient = new HttpClient();
	}
	return _httpClient;
}

// Export the class for testing or custom instances
export { HttpClient };
