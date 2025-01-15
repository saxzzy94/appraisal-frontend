'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check,
  Sparkles,
  Home,
  Car,
  LucideTractor,
  Thermometer,
  Droplets,
} from 'lucide-react';

interface PropertyFeaturesProps {
  features: string[];
}

const featureIcons: Record<string, React.ReactNode> = {
  'Lift': <LucideTractor className="h-4 w-4" />,
  'Cv-ketel': <Thermometer className="h-4 w-4" />,
  'Parkeergarage': <Car className="h-4 w-4" />,
  'Bestaande bouw': <Home className="h-4 w-4" />,
  'Warm water': <Droplets className="h-4 w-4" />,
  // Add more mappings as needed
};

export function PropertyFeatures({ features }: PropertyFeaturesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => {
            const icon = featureIcons[feature] || <Check className="h-4 w-4" />;
            
            return (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1 text-sm"
              >
                {icon}
                <span>{feature}</span>
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
