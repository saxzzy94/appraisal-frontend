import { ApiResponse } from "@/types/api";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// Property Analysis API
export const propertyApi = {
	analyzeProperty: async (url: string): Promise<ApiResponse> => {
		const response = await fetch(`${API_BASE_URL}/property/analyze`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ url }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to analyze property");
		}

		return response.json();
	},

	getReport: async (reportUrl: string) => {
		const response = await fetch(reportUrl);
		if (!response.ok) {
			throw new Error("Failed to download report");
		}
		return response.blob();
	},

	downloadReport: async (requestId: string) => {
		const response = await fetch(`${API_BASE_URL}/reports/${requestId}`);
		if (!response.ok) {
			throw new Error("Failed to download report");
		}
		return response.blob();
	},
};

interface Message {
	content: string;
	role: "user" | "assistant";
	timestamp: string;
}

interface ChatSession {
	sessionId: string;
	title: string;
}

// Chat API
export const chatApi = {
	getSessions: async (): Promise<{ status: string; data: ChatSession[] }> => {
		// The API now returns an array of objects with sessionId and title
		const response = await fetch(`${API_BASE_URL}/chat/sessions`);
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to fetch chat sessions");
		}
		return response.json();
	},

	getSessionMessages: async (
		sessionId: string
	): Promise<{
		data: {
			messages: Message[];
			propertyUrl: string;
			propertyAnalysis: unknown;
			sessionId: string;
		};
	}> => {
		const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}`);
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to fetch session messages");
		}
		return response.json();
	},

	startChat: async (
		message: string,
		propertyUrl?: string,
		language: string = "english",
		sessionId?: string
	) => {
		const response = await fetch(`${API_BASE_URL}/chat/start`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message,
				propertyUrl,
				language,
				sessionId,
			}),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to start chat");
		}

		return response.json();
	},

	sendMessage: async (
		message: string,
		sessionId: string,
		language: string = "english"
	) => {
		const response = await fetch(`${API_BASE_URL}/chat/message`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message,
				sessionId,
				language,
			}),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to send message");
		}

		return response.json();
	},
};

// Legacy API functions (for backward compatibility)
export async function analyzeProperty(url: string): Promise<ApiResponse> {
	return propertyApi.analyzeProperty(url);
}

export async function startChat(
	message: string,
	propertyUrl?: string,
	language: string = "english",
	sessionId?: string
) {
	return chatApi.startChat(message, propertyUrl, language, sessionId);
}

export async function sendChatMessage(
	message: string,
	sessionId: string,
	language: string = "english"
) {
	return chatApi.sendMessage(message, sessionId, language);
}

export type { Message, ChatSession };
