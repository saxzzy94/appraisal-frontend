'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card } from '@/components/ui/card';
import type { ComparableProperty } from '@/types/api';

interface MarketComparisonProps {
  property: {
    price: string;
    livingArea: string;
    energyLabel: string;
  };
  comparableProperties: ComparableProperty[];
}

export function MarketComparison({ property, comparableProperties }: MarketComparisonProps) {
  // Calculate average metrics
  const averagePrice = Math.round(
    comparableProperties.reduce((acc, curr) => {
      const price = parseInt(curr.TransactionPrice.split('-')[0].replace(/\D/g, ''));
      return acc + price;
    }, 0) / comparableProperties.length
  );

  const averageArea = Math.round(
    comparableProperties.reduce((acc, curr) => acc + curr.InnerSurfaceArea, 0) /
    comparableProperties.length
  );

  // Prepare data for radar chart
  const radarData = [
    {
      metric: 'Price',
      subject: 'Price (€)',
      property: parseInt(property.price.replace(/\D/g, '')),
      average: averagePrice,
      fullMark: Math.max(parseInt(property.price.replace(/\D/g, '')), averagePrice) * 1.2,
    },
    {
      metric: 'Area',
      subject: 'Living Area (m²)',
      property: parseInt(property.livingArea),
      average: averageArea,
      fullMark: Math.max(parseInt(property.livingArea), averageArea) * 1.2,
    },
  ];

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="font-semibold">Market Comparison</h3>
        <p className="text-sm text-muted-foreground">Property metrics vs. market average</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
            <Radar
              name="Property"
              dataKey="property"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Radar
              name="Market Average"
              dataKey="average"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* <div className="mt-4">
        <h4 className="mb-2 font-medium">Comparable Properties</h4>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {comparableProperties.map((prop, index) => (
              <div
                key={`${prop.Street}-${prop.HouseNumber}-${index}`}
                className="rounded-lg border p-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {prop.Street} {prop.HouseNumber}
                      {prop.HouseAddition && ` ${prop.HouseAddition}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {prop.PostCode} {prop.City}
                    </p>
                  </div>
                  <p className="font-semibold">{prop.TransactionPrice}</p>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <p>Area: {prop.InnerSurfaceArea}m²</p>
                  <p>Year: {prop.BuildYear}</p>
                  <p>Distance: {prop.Distance}m</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div> */}
    </Card>
  );
}