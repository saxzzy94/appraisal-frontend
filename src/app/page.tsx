'use client';

import { URLInputForm } from "@/components/forms/URLInputForm";
import { usePropertyAnalysis } from "@/hooks/usePropertyAnalysis";
import { useToast } from "@/hooks/use-toast";
import { PropertyOverview } from "@/components/analysis/PropertyOverview";
import { AnalysisMetrics } from "@/components/analysis/AnalysisMetrics";
import { AnalysisActions } from "@/components/analysis/AnalysisActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button 
              variant="outline" 
              className="w-fit"
              onClick={clearAnalysis}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
            
            <AnalysisActions
              requestId={analysisResult.requestId}
              propertyAddress={analysisResult.data.propertyData.address}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            {/* Property Overview */}
            <div className="space-y-8">
              <div className="rounded-lg border bg-card p-6">
                <PropertyOverview data={analysisResult.data.propertyData} />
              </div>
            </div>

            {/* Analysis Results */}
            <div className="space-y-8">
              <div className="rounded-lg border bg-card p-6">
                <AnalysisMetrics
                  visionAnalysis={analysisResult.data.visionAnalysis}
                  assessment={analysisResult.data.assessment}
                />
              </div>
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
