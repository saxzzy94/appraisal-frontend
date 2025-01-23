'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from 'recharts';
import { normalizeHouseType } from '@/types/api';

interface PriceData {
  date: string;
  price: number;
  houseType: string;
}

interface PriceTrendChartProps {
  data: PriceData[];
  estimatedValue: number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: {
    name: string;
    value: number;
    stroke: string;
    payload: {
      originalType: string;
    };
  }[];
}

const TYPE_COLORS = {
  'detached': '#FB923C',        // orange-400
  'semi-detached': '#A78BFA',   // purple-400
  'townhouse': '#34D399',       // green-400
  'apartment-ground': '#60A5FA', // blue-400
  'apartment-upper': '#22D3EE',  // cyan-400
  'apartment-complex': '#818CF8' // indigo-400
} as const;

function groupByHouseType(data: PriceData[]) {
  const grouped = new Map<string, { type: string; data: PriceData[] }>();
  
  data.forEach(item => {
    const normalizedType = normalizeHouseType(item.houseType);
    if (!grouped.has(item.houseType)) {
      grouped.set(item.houseType, {
        type: normalizedType,
        data: []
      });
    }
    grouped.get(item.houseType)?.data.push(item);
  });
  
  return grouped;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

export function PriceTrendChart({ data, estimatedValue }: PriceTrendChartProps) {
  const groupedData = groupByHouseType(data);

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="font-medium">{label}</div>
          {payload.map((entry, index) => (
            <div
              key={`item-${index}`}
              className="flex items-center gap-2 text-sm"
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.stroke }}
              />
              <span>{entry.payload.originalType}</span>
              <span className="font-medium">{formatPrice(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4">
      <h4 className="mb-4 text-sm font-medium">Price Trends by Property Type</h4>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={formatPrice}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Render a line for each house type */}
            {Array.from(groupedData.entries()).map(([originalType, { type, data }]) => (
              <Line
                key={originalType}
                type="monotone"
                name={originalType}
                data={data}
                dataKey="price"
                stroke={TYPE_COLORS[type as keyof typeof TYPE_COLORS]}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}

            {/* Estimated value reference line */}
            <ReferenceLine
              y={estimatedValue}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{
                value: 'Estimated Value',
                fill: 'hsl(var(--primary))',
                fontSize: 12,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}