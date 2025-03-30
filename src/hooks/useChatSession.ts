import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { chatApi, type Message } from "@/lib/api";

export type Language = "dutch" | "english";

interface ChatSessionHookProps {
  propertyUrl: string;
  language: Language;
  onError?: (error: Error) => void;
  onSessionStart?: (sessionId: string) => void;
  onPropertyDataLoaded?: (url: string) => void;
}

export function useChatSession({ 
  propertyUrl, 
  language, 
  onError, 
  onSessionStart,
  onPropertyDataLoaded
}: ChatSessionHookProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  
  const { data: sessionsData } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: chatApi.getSessions,
  });

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

      // Handle property data from analysis
      if (data.data?.propertyAnalysis?.propertyUrl) {
        onPropertyDataLoaded?.(data.data.propertyAnalysis.propertyUrl);
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

  // Session loading mutation
  const loadSessionMutation = useMutation({
    mutationFn: chatApi.getSessionMessages,
    onSuccess: (data) => {
      setMessages(data.data.messages);
      
      // Handle property data from existing session
      if (data.data.propertyUrl) {
        onPropertyDataLoaded?.(data.data.propertyUrl);
      }
      
      // Handle session ID
      if (data.data.sessionId) {
        setSessionId(data.data.sessionId);
        onSessionStart?.(data.data.sessionId);
      }
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

  const loadSession = async (newSessionId: string) => {
    await loadSessionMutation.mutateAsync(newSessionId);
  };

  const resetSession = () => {
    setMessages([]);
    setSessionId("");
  };

  return {
    messages,
    sendMessage,
    loadSession,
    isLoading: startChatMutation.isPending || chatMessageMutation.isPending || loadSessionMutation.isPending,
    sessionId,
    resetSession,
    sessions: sessionsData?.data ?? [],
  };
}
