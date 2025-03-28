"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChatSession, Language } from "@/hooks/useChatSession";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatLanguageSelect } from "@/components/chat/ChatLanguageSelect";

export default function ChatPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [propertyUrl, setPropertyUrl] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [language, setLanguage] = useState<Language>("en");

  // Initialize sessionId from URL parameters when the page loads
  useEffect(() => {
    const sessionParam = searchParams.get('session');
    if (sessionParam && !sessionId) {
      setSessionId(sessionParam);
    }
  }, [searchParams, sessionId]);
  
  const {
    messages,
    sendMessage,
    downloadReport,
    isLoading,
    analysisData,
    isAnalysisLoading,
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
      updateUrlWithSession(newSessionId);
    },
  });

  const handleNavigateToAnalytics = () => {
    if (propertyUrl) {
      router.push(`/analyze?url=${encodeURIComponent(propertyUrl)}`);
    }
  };

  const updateUrlWithSession = (sid: string) => {
    // Update the URL without triggering a page reload
    router.push(`/chat?session=${sid}`, { scroll: false });
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
    } catch (error) {
      console.error("Error caught in handleSendMessage:", error);
      return false; // Indicate failure, keep input
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-end px-4">
          <ChatLanguageSelect 
            value={language} 
            onValueChange={setLanguage} 
          />
        </div>
        <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading || isAnalysisLoading}
          onDownloadReport={propertyUrl ? downloadReport : undefined}
          onViewAnalytics={propertyUrl ? handleNavigateToAnalytics : undefined}
          showActions={Boolean(propertyUrl)}
          analysisData={analysisData}
        />
      </div>
    </div>
  );
}
