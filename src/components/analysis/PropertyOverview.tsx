'use client';

import { Card } from "@/components/ui/card";
import { PropertyImages } from "./property-images";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyData {
  images: string[];
  address: string;
  housenumber: number;
  price: string;
  buildYear: string;
  livingArea: string;
  plotSize: string;
  rooms: number;
  propertyType: string;
  energyLabel: string;
  location: {
    city: string;
    neighborhood: string;
    postalCode: string;
  };
  features: string[];
  videos?: string[];
}

interface PropertyOverviewProps {
  data: PropertyData;
}

export function PropertyOverview({ data }: PropertyOverviewProps) {
  const formatPrice = (price: string) => {
    const number = parseInt(price.replace(/\D/g, ''));
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(number);
  };

  const getEnergyLabelColor = (label: string) => {
    const colors: Record<string, string> = {
      'A+++': 'bg-green-100 text-green-800',
      'A++': 'bg-green-100 text-green-800',
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-emerald-100 text-emerald-800',
      'B': 'bg-lime-100 text-lime-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-red-100 text-red-800',
      'F': 'bg-red-100 text-red-800',
      'G': 'bg-red-100 text-red-800'
    };
    return colors[label] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <PropertyImages 
        images={data.images}
        mode="compact"
        maxThumbnails={5}
      />

      {/* Property Details */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {data.address} {data.housenumber}
            </h2>
            <p className="text-muted-foreground">
              {data.location.postalCode} {data.location.city}, {data.location.neighborhood}
            </p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Price</div>
              <div className="font-semibold">{formatPrice(data.price)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Living Area</div>
              <div className="font-semibold">{data.livingArea} m²</div>
            </div>
            {data.plotSize && (
              <div>
                <div className="text-sm text-muted-foreground">Plot Size</div>
                <div className="font-semibold">{data.plotSize} m²</div>
              </div>
            )}
            <div>
              <div className="text-sm text-muted-foreground">Rooms</div>
              <div className="font-semibold">{data.rooms}</div>
            </div>
          </div>

          {/* Property Type & Energy Label */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {data.propertyType}
            </Badge>
            {data.energyLabel && (
              <Badge 
                variant="secondary" 
                className={cn(getEnergyLabelColor(data.energyLabel))}
              >
                Energy Label {data.energyLabel}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Built in {data.buildYear}
            </Badge>
          </div>

          {/* Features List */}
          <div>
            <h3 className="text-sm font-medium mb-2">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {data.features.map((feature, index) => (
                <li key={index} className="text-muted-foreground">
                  • {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
