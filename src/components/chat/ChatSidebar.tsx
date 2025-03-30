import { useQuery } from "@tanstack/react-query";
import { chatApi, type ChatSession } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/analysis/ui/ScrollArea";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ChatSidebarProps {
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
}

export function ChatSidebar({ currentSessionId, onSelectSession }: ChatSidebarProps) {
  const { data: sessionsData, isLoading } = useQuery<{ status: string; data: ChatSession[] }>({
    queryKey: ["chatSessions"],
    queryFn: async () => chatApi.getSessions(),
  });

  const sessions: ChatSession[] = sessionsData?.data ?? [];

  if (isLoading) {
    return (
      <div className="w-64 border-r border-border p-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="w-64 border-r border-border p-4">
        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
          No chat sessions yet
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-border flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Chat Sessions</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sessions.map((session) => (
            <Button
              key={session.sessionId}
              variant="ghost"
              className={cn(
                "w-full justify-start px-4 py-2 h-auto",
                currentSessionId === session.sessionId && "bg-muted"
              )}
              onClick={() => onSelectSession(session.sessionId)}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="text-sm truncate">
                  {session.title || `Session ${session.sessionId.slice(0, 8)}...`}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}