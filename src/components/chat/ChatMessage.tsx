import { cn } from "@/lib/utils";
import { Avatar } from "../ui/avatar";
import { Card } from "../ui/card";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  timestamp?: string;
}

export function ChatMessage({ content, role, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn(
      "flex gap-3 px-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 shrink-0 select-none">
        <div className={cn(
          "flex h-full w-full items-center justify-center rounded-full text-xs font-medium",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}>
          {isUser ? "U" : "A"}
        </div>
      </Avatar>
      
      <div className={cn(
        "flex flex-col space-y-1",
        isUser ? "items-end" : "items-start"
      )}>
        <div className="group flex flex-col">
          <Card className={cn(
            "px-4 py-3 break-words max-w-[85%] lg:max-w-[75%] border-border",
            isUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary/10 text-foreground"
          )}>
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </Card>
          
          {timestamp && (
            <span className="text-xs text-muted-foreground px-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}