"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChatSession, type Language } from "@/hooks/useChatSession";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatLanguageSelect } from "@/components/chat/ChatLanguageSelect";

export default function ChatPage() {
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [propertyUrl, setPropertyUrl] = useState<string>("");
	const [sessionId, setSessionId] = useState<string>("");
	const [language, setLanguage] = useState<Language>("english");

	// Initialize sessionId from URL parameters when the page loads
	useEffect(() => {
		const sessionParam = searchParams.get("session");
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
					description:
						"Please provide a valid property URL to start the chat session.",
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
		<div className="flex flex-col h-screen">
			<div className="flex-1 overflow-hidden">
				<div className="h-full max-w-6xl mx-auto px-4">
					<div className="flex justify-end py-2">
						<ChatLanguageSelect value={language} onValueChange={setLanguage} />
					</div>
					<ChatContainer
						messages={messages}
						onSendMessage={handleSendMessage}
						isLoading={isLoading || isAnalysisLoading}
						onDownloadReport={propertyUrl ? downloadReport : undefined}
						onViewAnalytics={
							propertyUrl ? handleNavigateToAnalytics : undefined
						}
						showActions={Boolean(propertyUrl)}
						analysisData={analysisData}
					/>
				</div>
			</div>
		</div>
	);
}
