import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatApi } from "@/lib/api";

export type Language = "dutch" | "english";

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

export function useChatSession({ propertyUrl, language, onError, onSessionStart }: ChatSessionHookProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  
  // Start Chat mutation for initial messages or new property URLs
  const startChatMutation = useMutation({
    mutationFn: async (message: string) => {
      return chatApi.startChat(message, propertyUrl, language, sessionId);
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
    onError,
  });

  // Continue Chat mutation for subsequent messages
  const chatMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!sessionId) throw new Error("No active session");
      return chatApi.sendMessage(message, sessionId, language);
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
    },
    onError,
  });

  const checkForUrl = (message: string): boolean => {
    return !!message.match(/https?:\/\/[^\s]+/);
  };

  const sendMessage = async (message: string): Promise<boolean> => {
    try {
      // If this is the first message or contains a URL and user confirms new session
      if (messages.length === 0 || 
          (checkForUrl(message) && window.confirm("This message contains a URL. Would you like to start a new session?"))) {
        await startChatMutation.mutateAsync(message);
      } else {
        await chatMessageMutation.mutateAsync(message);
      }
      return true;
    } catch (error) {
      throw error;
    }
  };

  return {
    messages,
    sendMessage,
    isLoading: startChatMutation.isPending || chatMessageMutation.isPending,
    sessionId,
  };
}
