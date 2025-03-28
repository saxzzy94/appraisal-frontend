import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";

export type Language = "en" | "nl";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatSessionHookProps {
  propertyUrl: string;
  language: Language;
  onError?: (error: Error) => void;
  onSessionStart?: (sessionId: string) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function useChatSession({ propertyUrl, language, onError, onSessionStart }: ChatSessionHookProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  
  // Query for property analysis data
  const analysisQuery = useQuery<ApiResponse>({
    queryKey: ["propertyAnalysis", propertyUrl],
    queryFn: async () => {
      if (!propertyUrl) throw new Error("No property URL provided");
      
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: propertyUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch property analysis");
      }

      return response.json();
    },
    enabled: Boolean(propertyUrl),
  });

  // Chat mutation for sending messages
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch(`${API_BASE_URL}/chat/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          propertyUrl,
          sessionId, // Include existing sessionId if we have one
          language, // Add language parameter to the request
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Create user message
      const userMessage: Message = {
        content: variables,
        role: "user",
        timestamp: new Date().toISOString(),
      };

      // Extract assistant message from the API response
      const assistant = data.data?.message;
      const assistantMessage: Message = {
        content: assistant?.content || "",
        role: assistant?.role || "assistant",
        timestamp: assistant?.timestamp || new Date().toISOString(),
      };

      // Update messages state
      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      // Handle session ID
      if (data.data?.sessionId && !sessionId) {
        setSessionId(data.data.sessionId);
        onSessionStart?.(data.data.sessionId);
      }
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const sendMessage = async (message: string): Promise<boolean> => {
    try {
      await chatMutation.mutateAsync(message);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const downloadReport = async () => {
    try {
      if (!propertyUrl) throw new Error("No property URL provided");
      
      const response = await fetch(`${API_BASE_URL}/reports/${encodeURIComponent(propertyUrl)}`);
      if (!response.ok) throw new Error("Failed to download report");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "property-analysis-report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  return {
    messages,
    sendMessage,
    downloadReport,
    isLoading: chatMutation.isPending,
    analysisData: analysisQuery.data,
    isAnalysisLoading: analysisQuery.isLoading,
    sessionId,
  };
}