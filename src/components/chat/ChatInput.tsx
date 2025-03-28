import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => Promise<boolean>;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSubmit, isLoading = false, placeholder = "Type a message..." }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    const currentMessage = message.trim();
    if (!currentMessage || isLoading) return;

    try {
      // Only clear the input if the submission was successful
      const success = await onSubmit(currentMessage);
      if (success) {
        setMessage("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    } catch (error) {
      // Do not clear the message on error
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Max height of 200px
    }
  };

  return (
    <div className="flex items-end gap-2 p-4">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setMessage(e.target.value);
          adjustTextareaHeight();
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[50px] max-h-[200px] resize-none rounded-lg bg-secondary/10 border-border focus-visible:ring-1 focus-visible:ring-primary"
        disabled={isLoading}
      />
      <Button
        onClick={handleSubmit}
        disabled={!message.trim() || isLoading}
        className="h-[50px] px-4 rounded-lg shrink-0 bg-primary hover:bg-primary/90"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}