# Updated useChatSession Hook

Below is the updated code snippet for `src/hooks/useChatSession.ts` to correctly map the assistant’s message from the API response. This update extracts the assistant’s message from `data.data.message` instead of `data.response`.

```tsx
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/api";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatSessionHookProps {
  propertyUrl: string;
  onError?: (error: Error) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export function useChatSession({ propertyUrl, onError }: ChatSessionHookProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  
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

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
    },
    onError: (error: Error) => {
      onError?.(error);
      // Do not modify messages state on error.
    },
  });

  const sendMessage = async (message: string) => {
    try {
      await chatMutation.mutateAsync(message);
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
  };
}
```

## Explanation
- **onSuccess Callback Update:**  
  The assistant's message is now extracted using `const assistant = data.data?.message;` and then mapped to create `assistantMessage` with its `content`, `role`, and `timestamp`. This ensures that the assistant’s response is correctly displayed in the chat.

- **Robust Error Handling:**  
  Errors are handled as before without modifying the message state, so if an error occurs, the chat interface remains stable.

Would you like to switch to Code mode now to implement this change, or do you have any additional modifications in mind?