"use client";

import { useRef, useEffect, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ChatReport } from "./ChatReport";
import { ScrollArea } from "../analysis/ui/ScrollArea";
import { Button } from "../ui/button";
import { FileText, BarChart, Loader2, Maximize2, Link } from "lucide-react";
import type { ApiResponse } from "@/types/api";

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
	analysisData,
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
			console.error("Failed to send message:", error);
			return false;
		}
	};

	return (
		<div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background rounded-lg border border-border">
			{messages.length === 0 ? (
				// Centered welcome message and input for first interaction
				<div className="flex flex-col items-center justify-center flex-1 px-4">
					{isLoading ? (
						<div className="flex justify-center items-center py-4">
							<div className="flex items-center space-x-2 text-muted-foreground">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>Thinking...</span>
							</div>
						</div>
					) : (
						<h1 className="text-4xl font-bold mb-12 text-center">
							What property would you like to analyze?
						</h1>
					)}

					<div className="w-full max-w-xl">
						<ChatInput
							onSubmit={handleSendMessage}
							isLoading={isLoading}
							placeholder="Paste a property URL to begin analysis..."
							centered={true}
						/>
					</div>
				</div>
			) : (
				// Regular chat interface for ongoing conversation
				<>
					<ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
						<div className="max-w-3xl mx-auto py-6 space-y-6">
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

						{showActions && (
							<div className="flex justify-center gap-4 py-6 mb-4">
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
					</ScrollArea>

					<div className="p-4">
						<div className="max-w-3xl mx-auto">
							<div className="flex items-center mb-2 space-x-2 text-sm text-gray-500">
								<div className="flex-1"></div>
								<div className="flex items-center space-x-2">
									<Maximize2 className="h-4 w-4" />
									<Link className="h-4 w-4" />
								</div>
							</div>
							<ChatInput
								onSubmit={handleSendMessage}
								isLoading={isLoading}
								placeholder="Ask a follow up..."
								centered={false}
							/>
						</div>
					</div>
				</>
			)}

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
