'use client';

import { PropertyData } from '@/types/api';
import { PropertyImages } from './property-images';
import { PropertyInfo } from './property-info';
import { PropertyFeatures } from './property-features';
import { PropertyDescription } from './property-description';

interface PropertyOverviewProps {
  data: PropertyData;
}

export function PropertyOverview({ data }: PropertyOverviewProps) {
  return (
    <div className="space-y-6">
      <PropertyImages images={data.images} />
      <PropertyInfo data={data} />
      <PropertyFeatures features={data.features} />
      <PropertyDescription description={data.description} />
    </div>
  );
}

