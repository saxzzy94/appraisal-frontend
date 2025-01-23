import type { ApiResponse } from "@/types/api";

interface PropertyApiOptions {
	baseUrl?: string;
	headers?: HeadersInit;
}

const defaultOptions: PropertyApiOptions = {
	baseUrl: "http://localhost:4000/api/v1",
	headers: {
		"Content-Type": "application/json",
	},
};

class PropertyApi {
	private baseUrl: string;
	private headers: HeadersInit;

	constructor(options: PropertyApiOptions = {}) {
		this.baseUrl = options.baseUrl || defaultOptions.baseUrl!;
		this.headers = {
			...defaultOptions.headers,
			...options.headers,
		};
	}

	private async fetchWithError(
		url: string,
		init?: RequestInit
	): Promise<Response> {
		const response = await fetch(url, {
			...init,
			headers: {
				...this.headers,
				...(init?.headers || {}),
			},
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ message: "An error occurred" }));
			throw new Error(
				error.message || `HTTP error! status: ${response.status}`
			);
		}

		return response;
	}

	async analyzeProperty(url: string): Promise<ApiResponse> {
		const response = await this.fetchWithError(`${this.baseUrl}/analyze`, {
			method: "POST",
			body: JSON.stringify({ url }),
		});

		return response.json();
	}

	async getAnalysis(requestId: string): Promise<ApiResponse> {
		const response = await this.fetchWithError(
			`${this.baseUrl}/analysis/${requestId}`
		);
		return response.json();
	}

	async getReport(reportUrl: string): Promise<Blob> {
		const response = await this.fetchWithError(`${this.baseUrl}${reportUrl}`, {
			headers: {
				Accept: "application/pdf",
			},
		});
		return response.blob();
	}
}

// Export singleton instance
export const propertyApi = new PropertyApi();

// Export type for use in components
export type { ApiResponse };
