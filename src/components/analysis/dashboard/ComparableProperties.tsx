'use client';

import { ScrollArea } from '@/components/analysis/ui/ScrollArea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ComparableProperty } from '@/types/api';
import { normalizeHouseType, parseTransactionPrice } from '@/types/api';
import { Home, MapPin, Hash, Calendar } from 'lucide-react';

interface ComparablePropertiesProps {
  properties: ComparableProperty[];
}

function formatDate(date: number): string {
  const year = Math.floor(date / 100);
  const month = date % 100;
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short'
  }).format(new Date(year, month - 1));
}

function formatPrice(price: string): string {
  const value = parseTransactionPrice(price);
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

function getHouseTypeColor(type: string): string {
  const normalizedType = normalizeHouseType(type);
  switch (normalizedType) {
    case 'detached':
      return 'bg-orange-100 text-orange-800';
    case 'semi-detached':
      return 'bg-purple-100 text-purple-800';
    case 'townhouse':
      return 'bg-green-100 text-green-800';
    case 'apartment-ground':
      return 'bg-blue-100 text-blue-800';
    case 'apartment-upper':
      return 'bg-cyan-100 text-cyan-800';
    case 'apartment-complex':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function ComparableProperties({ properties }: ComparablePropertiesProps) {
  // Sort by weight (most relevant first) and take top 5
  const topComparables = [...properties]
    .sort((a, b) => b.Weight - a.Weight)

  return (
    <Card className="p-4">
      <h4 className="mb-4 text-sm font-medium">Comparable Properties</h4>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {topComparables.map((property, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary"
                      className={`${getHouseTypeColor(property.HouseType)}`}
                    >
                      {property.HouseType}
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(property.Weight * 100)}% match
                    </Badge>
                  </div>
                  <h5 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {property.Street} {property.HouseNumber}
                    {property.HouseAddition && `, ${property.HouseAddition}`}
                  </h5>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {property.InnerSurfaceArea}m²
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        Built {property.BuildYear}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    {formatPrice(property.TransactionPrice)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(property.Transactiondate)}
                  </div>
                </div>
              </div>
              
              {/* Additional metrics */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Distance</div>
                  <div>{property.Distance}m</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Energy Label</div>
                  <div>{property.DefinitiveEnergyLabel || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Price Index</div>
                  <div>{Math.round(property.PriceIndex)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}