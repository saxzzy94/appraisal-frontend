'use client';

import { URLInputForm } from "@/components/forms/URLInputForm";
import { usePropertyAnalysis } from "@/hooks/usePropertyAnalysis";
import { useToast } from "@/hooks/use-toast";
import { PropertyOverview } from "@/components/analysis/PropertyOverview";
import { AnalysisMetrics } from "@/components/analysis/AnalysisMetrics";
import { AnalysisActions } from "@/components/analysis/AnalysisActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CollapsibleSection } from "@/components/analysis/sections/CollapsibleSection";
import { ImageGallery } from "@/components/analysis/ui/ImageGallery";
import { ErrorBoundary, SectionError } from "@/components/providers/ErrorBoundary";
import { PriceTrendChart } from "@/components/analysis/charts/PriceTrendChart";
import { MarketComparison } from "@/components/analysis/charts/MarketComparison";
import { ValuationDashboard } from "@/components/analysis/dashboard/ValuationDashboard";
import { ComparableProperty, parseTransactionPrice } from "@/types/api";

interface PriceData {
  date: string;
  price: number;
  houseType: string;
}

export default function Home() {
  const { analyzeProperty, isAnalyzing, analysisResult, clearAnalysis } = usePropertyAnalysis();
  const { toast } = useToast();

  const handleAnalysis = async (url: string) => {
    try {
      await analyzeProperty(url);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to analyze property",
        variant: "destructive",
      });
    }
  };

  if (analysisResult) {
    // Prepare data for price trend chart with house type information
    const priceData: PriceData[] = analysisResult.data.marketAnalysis.comparableProperties
      .map((prop: ComparableProperty) => ({
        date: `${prop.Transactiondate.toString().slice(0, 4)}-${prop.Transactiondate.toString().slice(4, 6)}`,
        price: parseTransactionPrice(prop.TransactionPrice),
        houseType: prop.HouseType
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" className="w-fit" onClick={clearAnalysis}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
            <AnalysisActions
              requestId={analysisResult.requestId}
              propertyAddress={analysisResult.data.propertyData.address}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-[3fr,2fr]">
            {/* Main Content Column */}
            <div className="space-y-8">
              <ErrorBoundary fallback={<SectionError title="Property Overview" />} context="property-overview">
                <CollapsibleSection title="Property Overview" defaultOpen={true}>
                  <PropertyOverview data={analysisResult.data.propertyData} />
                </CollapsibleSection>
              </ErrorBoundary>

              <ErrorBoundary fallback={<SectionError title="Property Images" />} context="property-images">
                <CollapsibleSection title="Property Images" defaultOpen={true}>
                  <ImageGallery 
                    images={analysisResult.data.propertyData.images}
                    columns={3}
                  />
                </CollapsibleSection>
              </ErrorBoundary>

              <ErrorBoundary fallback={<SectionError title="Vision Analysis" />} context="vision-analysis">
                <CollapsibleSection title="Vision Analysis" defaultOpen={false}>
                  <AnalysisMetrics
                    visionAnalysis={analysisResult.data.visionAnalysis}
                    assessment={analysisResult.data.assessment}
                  />
                </CollapsibleSection>
              </ErrorBoundary>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8 lg:sticky lg:top-4">
              <ErrorBoundary 
                fallback={<SectionError title="Valuation Analysis" />} 
                context="valuation-analysis"
              >
                <CollapsibleSection title="Valuation Analysis" defaultOpen={true}>
                  <ValuationDashboard 
                    valuation={analysisResult.data.valuation}
                    comparableProperties={analysisResult.data.marketAnalysis.comparableProperties}
                  />
                </CollapsibleSection>
              </ErrorBoundary>

              <ErrorBoundary fallback={<SectionError title="Market Analysis" />} context="market-analysis">
                <CollapsibleSection title="Market Analysis" defaultOpen={false}>
                  <div className="space-y-6">
                    <PriceTrendChart
                      data={priceData}
                      estimatedValue={analysisResult.data.valuation.estimatedValue}
                    />
                    <MarketComparison
                      property={analysisResult.data.propertyData}
                      comparableProperties={analysisResult.data.marketAnalysis.comparableProperties}
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

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Property Appraisal</h1>
            <p className="text-muted-foreground">
              Enter a property listing URL to get an instant appraisal analysis
            </p>
          </div>
          
          <div className="p-6 border rounded-lg shadow-sm">
            <URLInputForm 
              onSubmit={handleAnalysis}
              isLoading={isAnalyzing}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
