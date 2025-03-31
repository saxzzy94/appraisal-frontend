"use client";

import { useState, useEffect, Suspense } from "react";
import { usePropertyAnalysis } from "@/hooks/usePropertyAnalysis";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyOverview } from "@/components/analysis/PropertyOverview";
import { AnalysisMetrics } from "@/components/analysis/AnalysisMetrics";
import { AnalysisActions } from "@/components/analysis/AnalysisActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import { CollapsibleSection } from "@/components/analysis/sections/CollapsibleSection";
import { ImageGallery } from "@/components/analysis/ui/ImageGallery";
import {
	ErrorBoundary,
	SectionError,
} from "@/components/providers/ErrorBoundary";
import { PriceTrendChart } from "@/components/analysis/charts/PriceTrendChart";
import { MarketComparison } from "@/components/analysis/charts/MarketComparison";
import { ValuationDashboard } from "@/components/analysis/dashboard/ValuationDashboard";
import {
	ComparableProperty,
	parseTransactionPrice,
	ApiResponse,
} from "@/types/api";
import { Input } from "@/components/ui/input";

interface PriceData {
	date: string;
	price: number;
	houseType: string;
}

export default function Home() {
	return (
		<Suspense
			fallback={<LoadingView message="Loading" description="Please wait..." />}
		>
			<AnalyzePage />
		</Suspense>
	);
}

function AnalyzePage() {
	const router = useRouter();
	const { analyzeProperty, analysisResult, clearAnalysis, isAnalyzing } =
		usePropertyAnalysis();
	const { toast } = useToast();
	const searchParams = useSearchParams();
	const [inputUrl, setInputUrl] = useState("");
	const propertyUrl = searchParams.get("url");

	useEffect(() => {
		if (propertyUrl && !analysisResult) {
			analyzeProperty(propertyUrl).catch((error) => {
				toast({
					title: "Analysis Error",
					description: error.message || "Failed to analyze property",
					variant: "destructive",
				});
			});
		}
	}, [propertyUrl, analyzeProperty, toast, analysisResult]);

	const handleStartAnalysis = () => {
		if (!inputUrl) {
			toast({
				title: "URL Required",
				description: "Please provide a property URL to analyze.",
				variant: "destructive",
			});
			return;
		}

		router.push(`/analyze?url=${encodeURIComponent(inputUrl)}`);
	};

	if (isAnalyzing) {
		return (
			<LoadingView
				message="Analyzing Property"
				description="Please wait while we analyze the property data..."
			/>
		);
	}

	return analysisResult ? (
		<AnalysisView
			analysisResult={analysisResult}
			onNewAnalysis={() => {
				setInputUrl("");
				clearAnalysis();
				router.replace("/analyze", { scroll: false });
			}}
		/>
	) : (
		<InputView
			inputUrl={inputUrl}
			setInputUrl={setInputUrl}
			onStartAnalysis={handleStartAnalysis}
		/>
	);
}

function LoadingView({
	message,
	description,
}: {
	message: string;
	description: string;
}) {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center">
				<div className="flex items-center justify-center mb-4">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
				<h2 className="text-xl font-semibold mb-2">{message}</h2>
				<p className="text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}

function InputView({
	inputUrl,
	setInputUrl,
	onStartAnalysis,
}: {
	inputUrl: string;
	setInputUrl: (url: string) => void;
	onStartAnalysis: () => void;
}) {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="w-full max-w-md p-6">
				<h1 className="text-2xl font-semibold mb-6 text-center">
					Property Analysis
				</h1>
				<div className="space-y-4">
					<Input
						type="url"
						placeholder="Enter property URL"
						value={inputUrl}
						onChange={(e) => setInputUrl(e.target.value)}
						className="w-full"
					/>
					<Button className="w-full" onClick={onStartAnalysis}>
						<Search className="mr-2 h-4 w-4" />
						Start Analysis
					</Button>
				</div>
			</div>
		</div>
	);
}

function AnalysisView({
	analysisResult,
	onNewAnalysis,
}: {
	analysisResult: ApiResponse;
	onNewAnalysis: () => void;
}) {
	const priceData: PriceData[] =
		analysisResult.data.marketAnalysis.comparableProperties
			.map(
				(prop: ComparableProperty) =>
					({
						date: `${prop.Transactiondate.toString().slice(
							0,
							4
						)}-${prop.Transactiondate.toString().slice(4, 6)}`,
						price: parseTransactionPrice(prop.TransactionPrice),
						houseType: prop.HouseType,
					} as PriceData)
			)
			.sort((a, b) => a.date.localeCompare(b.date));

	return (
		<div className="min-h-screen bg-background">
			<main className="container mx-auto px-4 py-8">
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<Button variant="outline" className="w-fit" onClick={onNewAnalysis}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						New Analysis
					</Button>
					<AnalysisActions
						requestId={analysisResult.requestId}
						propertyAddress={analysisResult.data.propertyData.address}
					/>
				</div>

				<div className="grid gap-8 md:grid-cols-1 lg:grid-cols-[3fr,2fr]">
					<div className="space-y-8">
						<ErrorBoundary
							fallback={<SectionError title="Property Overview" />}
							context="property-overview"
						>
							<CollapsibleSection title="Property Overview" defaultOpen={true}>
								<PropertyOverview data={analysisResult.data.propertyData} />
							</CollapsibleSection>
						</ErrorBoundary>

						<ErrorBoundary
							fallback={<SectionError title="Property Images" />}
							context="property-images"
						>
							<CollapsibleSection title="Property Images" defaultOpen={true}>
								<ImageGallery
									images={analysisResult.data.propertyData.images}
									columns={3}
								/>
							</CollapsibleSection>
						</ErrorBoundary>

						<ErrorBoundary
							fallback={<SectionError title="Vision Analysis" />}
							context="vision-analysis"
						>
							<CollapsibleSection title="Vision Analysis" defaultOpen={false}>
								<AnalysisMetrics
									visionAnalysis={analysisResult.data.visionAnalysis}
									assessment={analysisResult.data.assessment}
								/>
							</CollapsibleSection>
						</ErrorBoundary>
					</div>

					<div className="space-y-8 lg:sticky lg:top-4">
						<ErrorBoundary
							fallback={<SectionError title="Valuation Analysis" />}
							context="valuation-analysis"
						>
							<CollapsibleSection title="Valuation Analysis" defaultOpen={true}>
								<ValuationDashboard
									valuation={analysisResult.data.valuation}
									comparableProperties={
										analysisResult.data.marketAnalysis.comparableProperties
									}
								/>
							</CollapsibleSection>
						</ErrorBoundary>

						<ErrorBoundary
							fallback={<SectionError title="Market Analysis" />}
							context="market-analysis"
						>
							<CollapsibleSection title="Market Analysis" defaultOpen={false}>
								<div className="space-y-6">
									<PriceTrendChart
										data={priceData}
										estimatedValue={
											analysisResult.data.valuation.estimatedValue
										}
									/>
									<MarketComparison
										property={analysisResult.data.propertyData}
										comparableProperties={
											analysisResult.data.marketAnalysis.comparableProperties
										}
									/>
								</div>
							</CollapsibleSection>
						</ErrorBoundary>
					</div>
				</div>
			</main>
		</div>
	);
}
