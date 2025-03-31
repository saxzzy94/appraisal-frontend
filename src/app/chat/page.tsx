"use client";

import { useState, useEffect, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChatSession, Language } from "@/hooks/useChatSession";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatLanguageSelect } from "@/components/chat/ChatLanguageSelect";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { usePropertyAnalysis } from "@/hooks/usePropertyAnalysis";

export default function ChatPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}

function ChatPageContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [propertyUrl, setPropertyUrl] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [language, setLanguage] = useState<Language>("english");
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    messages,
    sendMessage,
    loadSession,
    resetSession,
    isLoading,
  } = useChatSession({
    propertyUrl,
    language,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSessionStart: (newSessionId) => {
      setSessionId(newSessionId);
    },
    onPropertyDataLoaded: (url) => {
      setPropertyUrl(url);
    }
  });

  const {
    analysisResult,
    isAnalyzing: isAnalysisLoading,
    clearAnalysis,
  } = usePropertyAnalysis();

  // Initialize from URL parameters once when the component mounts
  useEffect(() => {
    if (isInitialized) return;

    const sessionParam = searchParams.get('session');
    if (sessionParam) {
      loadSession(sessionParam).catch((error) => {
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message || "Failed to load chat session",
            variant: "destructive",
          });
        }
      });
    }

    setIsInitialized(true);
  }, [searchParams, loadSession, toast, isInitialized]);

  // Update URL when session changes
  useEffect(() => {
    if (sessionId) {
      const urlParam = propertyUrl ? `&url=${encodeURIComponent(propertyUrl)}` : '';
      router.replace(`/chat?session=${sessionId}${urlParam}`, { scroll: false });
    }
  }, [sessionId, propertyUrl, router]);

  const handleNavigateToAnalytics = () => {
    if (propertyUrl) {
      router.push(`/analyze?url=${encodeURIComponent(propertyUrl)}`);
    }
  };

  const handleSendMessage = async (message: string): Promise<boolean> => {
    // If this is the first message, require and extract a valid URL
    if (messages.length === 0) {
      const urlMatch = message.match(/https?:\/\/[^\s]+/);
      if (!urlMatch) {
        toast({
          title: "URL Required",
          description: "Please provide a valid property URL to start the chat session.",
          variant: "destructive",
        });
        return false; // Keep the message in the input
      }
      
      setPropertyUrl(urlMatch[0]);
    }
    
    try {
      // Attempt to send the message using the hook function
      await sendMessage(message);
      return true; // Indicate success
    } catch {
      return false; // Indicate failure, keep input (error is handled by onError callback)
    }
  };

  const handleNewChat = () => {
    setPropertyUrl("");
    setSessionId("");
    resetSession();
    clearAnalysis();
    router.replace("/chat", { scroll: false });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <ChatSidebar 
        currentSessionId={sessionId}
        onSelectSession={loadSession}
        onNewChat={handleNewChat}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end px-4 py-2 border-b border-border">
          <ChatLanguageSelect 
            value={language} 
            onValueChange={setLanguage} 
          />
        </div>
        <div className="flex-1">
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading || isAnalysisLoading}
            onViewAnalytics={propertyUrl ? handleNavigateToAnalytics : undefined}
            showActions={Boolean(propertyUrl)}
            analysisData={analysisResult || undefined}
          />
        </div>
      </div>
    </div>
  );
}
