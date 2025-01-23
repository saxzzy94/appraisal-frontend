'use client';

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ComparableProperty, ValuationData } from "@/types/api";
import { ComparableProperties } from "./ComparableProperties";

interface ValuationDashboardProps {
  valuation: ValuationData;
  comparableProperties: ComparableProperty[];
}

export function ValuationDashboard({ valuation, comparableProperties }: ValuationDashboardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Primary Valuation Card */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Estimated Value</h3>
            <div className="mt-2 text-3xl font-bold text-primary">
              {formatPrice(valuation.estimatedValue)}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Confidence Level</span>
              <span>{formatPercentage(valuation.confidence)}</span>
            </div>
            <Progress value={valuation.confidence * 100} className="h-2" />
          </div>

          {/* Value Range */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">AVM Confidence Range</h4>
            <div className="text-sm text-muted-foreground">
              {valuation.avmConfidence}
            </div>
          </div>
        </div>
      </Card>

      {/* Calculation Steps */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Valuation Breakdown</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Base AVM</div>
              <div className="font-semibold">{formatPrice(valuation.foundation.calculationSteps.avmBase)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Vision Adjusted</div>
              <div className="font-semibold">{formatPrice(valuation.foundation.calculationSteps.visionAdjusted)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Weighted Average</div>
              <div className="font-semibold">{formatPrice(valuation.foundation.calculationSteps.weightedAverage)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Adjustment</div>
              <div className="font-semibold">{formatPercentage(valuation.foundation.calculationSteps.totalAdjustment)}</div>
            </div>
          </div>

          {/* Assessment Adjustments */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-sm font-medium">Assessment Adjustments</h4>
            {valuation.foundation.assessmentAdjustments.map((adjustment, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{adjustment.factor}:</span>{' '}
                  <span className="font-medium">{adjustment.value}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Impact:</span>{' '}
                  <span className={`font-medium ${
                    adjustment.adjustment.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {adjustment.adjustment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Comparables */}
      <ComparableProperties properties={comparableProperties} />
    </div>
  );
}