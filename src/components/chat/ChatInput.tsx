"use client";

import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
	onSubmit: (message: string) => Promise<boolean>;
	isLoading?: boolean;
	placeholder?: string;
	centered?: boolean;
}

export function ChatInput({
	onSubmit,
	isLoading = false,
	placeholder = "Type a message...",
	centered = false,
}: ChatInputProps) {
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
		<div className={cn("relative w-full", centered ? "max-w-xl mx-auto" : "")}>
			<div className="relative bg-black/80 rounded-lg border border-gray-700 overflow-hidden">
				<Textarea
					ref={textareaRef}
					value={message}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
						setMessage(e.target.value);
						adjustTextareaHeight();
					}}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className="min-h-[50px] max-h-[200px] resize-none border-0 bg-transparent text-white placeholder-gray-400 focus-visible:ring-0 py-3 px-4"
					disabled={isLoading}
				/>

				<div className="absolute bottom-0 right-0 flex items-center p-2 space-x-1">
					<Button
						onClick={handleSubmit}
						disabled={!message.trim() || isLoading}
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
					>
						<ArrowUp className="h-4 w-4" />
						<span className="sr-only">Send message</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
