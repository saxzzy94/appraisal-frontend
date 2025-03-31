'use client';

import { PropertyData } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin,
  Euro,
  Maximize2,
  Users,
  Calendar,
  Leaf
} from 'lucide-react';

interface PropertyInfoProps {
  data: PropertyData;
}

export function PropertyInfo({ data }: PropertyInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{data.address}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{data.location.city}, {data.location.neighborhood}</span>
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                <Euro className="h-6 w-6" />
                <span>{data.price}</span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4">
            <PropertyDetail
              icon={<Maximize2 className="h-4 w-4" />}
              label="Living Area"
              value={data.livingArea}
            />
            <PropertyDetail
              icon={<Users className="h-4 w-4" />}
              label="Rooms"
              value={data.rooms.toString()}
            />
            <PropertyDetail
              icon={<Calendar className="h-4 w-4" />}
              label="Build Year"
              value={data.buildYear.toString()}
            />
            <PropertyDetail
              icon={<Leaf className="h-4 w-4" />}
              label="Energy Label"
              value={data.energyLabel}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyDetail({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-medium">{value}</p>
    </div>
  );
}
