"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChatSession, Language } from "@/hooks/useChatSession";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatLanguageSelect } from "@/components/chat/ChatLanguageSelect";
import { usePropertyAnalysis } from "@/hooks/usePropertyAnalysis";

export default function ChatPage() {
	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [propertyUrl, setPropertyUrl] = useState<string>("");
	const [sessionId, setSessionId] = useState<string>("");
	const [language, setLanguage] = useState<Language>("english");

	// Initialize session and URL from query parameters
	useEffect(() => {
		const sessionParam = searchParams.get("session");
		const urlParam = searchParams.get("url");

		if (sessionParam && !sessionId) {
			setSessionId(sessionParam);
		}

		if (urlParam && !propertyUrl) {
			setPropertyUrl(decodeURIComponent(urlParam));
		}
	}, [searchParams, sessionId, propertyUrl]);

	// const {
	//   analysisResult,
	//   isAnalyzing: isAnalysisLoading,
	//   analyzeProperty,
	// } = usePropertyAnalysis();

	// Trigger analysis when property URL is set
	// useEffect(() => {
	//   if (propertyUrl && !analysisResult) {
	//     analyzeProperty(propertyUrl).catch((error) => {
	//       toast({
	//         title: "Analysis Error",
	//         description: error.message || "Failed to analyze property",
	//         variant: "destructive",
	//       });
	//     });
	//   }
	// }, [propertyUrl, analysisResult, analyzeProperty, toast]);

	const { messages, sendMessage, isLoading } = useChatSession({
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
		// Preserve the URL parameter if it exists
		const urlParam = propertyUrl
			? `&url=${encodeURIComponent(propertyUrl)}`
			: "";
		router.push(`/chat?session=${sid}${urlParam}`, { scroll: false });
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
		<div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
			<div className="w-full max-w-4xl">
				<div className="mb-4 flex justify-end px-4">
					<ChatLanguageSelect value={language} onValueChange={setLanguage} />
				</div>
				<ChatContainer
					messages={messages}
					onSendMessage={handleSendMessage}
					isLoading={isLoading}
					onViewAnalytics={propertyUrl ? handleNavigateToAnalytics : undefined}
					showActions={Boolean(propertyUrl)}
					analysisData={undefined}
				/>
			</div>
		</div>
	);
}
