import { useRef, useEffect, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ChatReport } from "./ChatReport";
import { ScrollArea } from "../analysis/ui/ScrollArea";
import { Button } from "../ui/button";
import { FileText, BarChart, Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/api";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<boolean>;
  isLoading?: boolean;
  onDownloadReport?: () => Promise<void>;
  onViewAnalytics?: () => void;
  showActions?: boolean;
  analysisData?: ApiResponse;
}

export function ChatContainer({ 
  messages, 
  onSendMessage, 
  isLoading,
  onDownloadReport,
  onViewAnalytics,
  showActions = false,
  analysisData
}: ChatContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showReport, setShowReport] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleShowReport = () => {
    if (analysisData) {
      setShowReport(true);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      return await onSendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background rounded-lg border border-border">
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-4 py-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                role={message.role}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className="flex justify-center items-center py-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {showActions && (messages.length > 0) && (
            <div className="flex justify-center gap-4 py-6">
              {onDownloadReport && analysisData && (
                <Button
                  onClick={handleShowReport}
                  variant="outline"
                  className="gap-2 border-border hover:bg-accent"
                >
                  <FileText className="h-4 w-4" />
                  View Report
                </Button>
              )}
              
              {onViewAnalytics && (
                <Button
                  onClick={onViewAnalytics}
                  variant="outline"
                  className="gap-2 border-border hover:bg-accent"
                >
                  <BarChart className="h-4 w-4" />
                  View Analytics
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSubmit={handleSendMessage}
            isLoading={isLoading}
            placeholder="Type a message..."
          />
        </div>
      </div>

      {analysisData && (
        <ChatReport
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          propertyData={analysisData.data.propertyData}
          visionAnalysis={analysisData.data.visionAnalysis}
          assessment={analysisData.data.assessment}
          valuation={analysisData.data.valuation}
          onDownload={onDownloadReport || (() => Promise.resolve())}
        />
      )}
    </div>
  );
}