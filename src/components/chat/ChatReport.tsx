"use client";

import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../analysis/ui/ScrollArea";
import { Download, Loader2 } from "lucide-react";
import { PropertyData, VisionAnalysis, Assessment, ValuationData } from "@/types/api";

interface ChatReportProps {
  isOpen: boolean;
  onClose: () => void;
  propertyData: PropertyData;
  visionAnalysis: VisionAnalysis;
  assessment: Assessment;
  valuation: ValuationData;
  onDownload: () => Promise<void>;
}

export function ChatReport({
  isOpen,
  onClose,
  propertyData,
  visionAnalysis,
  assessment,
  valuation,
  onDownload,
}: ChatReportProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);
      await onDownload();
    } catch (error) {
      console.error('Failed to download report:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [onDownload]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Property Analysis Report</DialogTitle>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="absolute right-4 top-4 bg-primary hover:bg-primary/90"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="ml-2">Download PDF</span>
          </Button>
        </DialogHeader>
        
        <ScrollArea className="h-full pr-4">
          <div className="space-y-8 pb-8">
            {/* Property Overview */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Property Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-foreground">Location</h3>
                  <p className="text-muted-foreground">{propertyData.address}</p>
                  <p className="text-muted-foreground">
                    {propertyData.location.city}, {propertyData.location.neighborhood}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Key Details</h3>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    <li>Price: {propertyData.price}</li>
                    <li>Living Area: {propertyData.livingArea}</li>
                    <li>Rooms: {propertyData.rooms}</li>
                    <li>Build Year: {propertyData.buildYear}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Vision Analysis */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Vision Analysis</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">Overall Assessment</h3>
                  <p className="text-muted-foreground">Condition: {visionAnalysis.overallCondition}/10</p>
                  <p className="text-muted-foreground">Quality: {visionAnalysis.overallQuality}/10</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Value Factors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-500">Positives</h4>
                      <ul className="list-disc pl-4 text-muted-foreground">
                        {visionAnalysis.valueFactors.positives.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-500">Negatives</h4>
                      <ul className="list-disc pl-4 text-muted-foreground">
                        {visionAnalysis.valueFactors.negatives.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Assessment */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Property Assessment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">Maintenance Requirements</h3>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    {assessment.maintenanceRequirements.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Market Appeal</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Strengths</h4>
                      <ul className="list-disc pl-4 text-muted-foreground">
                        {assessment.marketAppeal.strengths.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Target Market</h4>
                      <ul className="list-disc pl-4 text-muted-foreground">
                        {assessment.marketAppeal.targetMarket.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Valuation */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Valuation Analysis</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">Estimated Value</h3>
                  <p className="text-2xl font-bold text-primary">{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(valuation.estimatedValue)}</p>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {valuation.confidence}%
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Adjustments</h3>
                  <ul className="list-disc pl-4 text-muted-foreground">
                    <li>Condition: {valuation.adjustments.conditionAdjustment}%</li>
                    <li>Location: {valuation.adjustments.locationAdjustment}%</li>
                    <li>Market Trend: {valuation.adjustments.marketTrendAdjustment}%</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}