'use client';

import { VisionAnalysis, Assessment } from '@/types/api';
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ThumbsUp, ThumbsDown, LineChart, Users, TrendingUp, PenToolIcon as Tool } from 'lucide-react';

interface AnalysisMetricsProps {
  visionAnalysis: VisionAnalysis;
  assessment: Assessment;
}

export function AnalysisMetrics({
  visionAnalysis,
  assessment,
}: AnalysisMetricsProps) {
  return (
    <div className="space-y-8">
      <OverallMetrics assessment={assessment} />
      <ValueFactors assessment={assessment} />
      <MarketAnalysis visionAnalysis={visionAnalysis} />
      <MaintenanceRequirements assessment={assessment} />
    </div>
  );
}

function OverallMetrics({ assessment }: { assessment: Assessment }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Overall Metrics</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Overall Condition"
            value={assessment.overallCondition}
            maxValue={10}
          />
          <MetricCard
            title="Overall Quality"
            value={assessment.overallQuality}
            maxValue={10}
          />
          <MetricCard
            title="Property Type"
            value={assessment.propertyType}
            type="text"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ValueFactors({ assessment }: { assessment: Assessment }) {
  const factors = [
    { title: "Positive Points", items: assessment.valueFactors.positives, icon: ThumbsUp, color: "text-green-500" },
    { title: "Areas of Concern", items: assessment.valueFactors.negatives, icon: ThumbsDown, color: "text-red-500" },
    { title: "Potential Improvements", items: assessment.valueFactors.improvements, icon: LineChart, color: "text-blue-500" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Value Factors</h2>
        <div className="space-y-6">
          {factors.map((factor, index) => (
            <div key={index}>
              <h3 className={`flex items-center gap-2 ${factor.color} text-base font-medium mb-2`}>
                <factor.icon className="h-4 w-4" />
                {factor.title}
              </h3>
              <ul className="space-y-1">
                {factor.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MarketAnalysis({ visionAnalysis }: { visionAnalysis: VisionAnalysis }) {
  const analyses = [
    { title: "Target Market", items: visionAnalysis.marketAppeal.targetMarket, icon: Users, color: "text-purple-500" },
    { title: "Market Strengths", items: visionAnalysis.marketAppeal.strengths, icon: TrendingUp, color: "text-emerald-500" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Market Analysis</h2>
        <div className="space-y-6">
          {analyses.map((analysis, index) => (
            <div key={index}>
              <h3 className={`flex items-center gap-2 ${analysis.color} text-base font-medium mb-2`}>
                <analysis.icon className="h-4 w-4" />
                {analysis.title}
              </h3>
              <ul className="space-y-1">
                {analysis.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MaintenanceRequirements({ assessment }: { assessment: Assessment }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Maintenance Requirements</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {assessment.maintenanceRequirements.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tool className="h-4 w-4 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function MetricCard({
  title,
  value,
  maxValue,
  type = "progress",
}: {
  title: string;
  value: string | number;
  maxValue?: number;
  type?: "progress" | "text";
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {type === "progress" ? (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold">{value}</span>
            <span className="text-sm text-muted-foreground">/ {maxValue}</span>
          </div>
          <Progress value={(Number(value) / Number(maxValue)) * 100} className="h-1.5" />
        </div>
      ) : (
        <p className="text-lg font-semibold break-words leading-tight">{value}</p>
      )}
    </div>
  );
}

