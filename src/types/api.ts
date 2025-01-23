export interface PropertyData {
  images: string[];
  videos: string[];
  address: string;
  housenumber: number;
  price: string;
  buildYear: string;
  livingArea: string;
  plotSize: string;
  rooms: number;
  propertyType: string;
  energyLabel: string;
  location: Location;
  features: string[];
  description: string;
}

export interface Location {
  city: string;
  neighborhood: string;
  postalCode: string;
}

export interface ValuationData {
  estimatedValue: number;
  confidence: number;
  adjustments: {
    conditionAdjustment: number;
    locationAdjustment: number;
    marketTrendAdjustment: number;
  };
  avmConfidence: string;
  foundation: {
    marketBaseline: {
      avmEstimate: {
        value: number;
        range: string;
        confidence: string;
      };
      listingPrice: {
        value: number | null;
        range: string;
        confidence: string;
      };
      comparablesRange: {
        min: number;
        max: number;
        count: number;
      };
    };
    assessmentAdjustments: Array<{
      factor: string;
      value: number | string;
      adjustment: string;
      rationale: string;
    }>;
    calculationSteps: {
      avmBase: number;
      visionAdjusted: number;
      weightedAverage: number;
      adjustments: {
        condition: number;
        location: number;
        marketTrend: number;
      };
      totalAdjustment: number;
      finalValue: number;
    };
  };
}

export interface VisionAnalysis {
  propertyType: string;
  overallCondition: number;
  overallQuality: number;
  rooms: Array<{
    type: string;
    features: string[];
    condition: number;
  }>;
  exteriorFeatures: string[];
  maintenanceRequirements: string[];
  valueFactors: {
    positives: string[];
    negatives: string[];
    improvements: string[];
  };
  marketAppeal: {
    strengths: string[];
    challenges: string[];
    targetMarket: string[];
  };
}

export interface MarketAnalysis {
  comparableProperties: ComparableProperty[];
  trends: {
    priceGrowth: number;
    demandLevel: number;
    averageDaysOnMarket: number;
    listingPriceTrend: {
      estimatedValue: number;
      listingPrice: number | null;
      priceDifference: number | null;
    };
  };
  location: {
    amenitiesScore: number;
    transportScore: number;
    schoolsScore: number;
  };
  avmInsights: {
    estimatedValue: number;
    confidence: string;
    listingConfidence: string;
    propertyDetails: {
      surfaceArea: Record<string, number | null>;
    };
  };
}

export interface Assessment {
  propertyType: string;
  overallCondition: number;
  overallQuality: number;
  rooms: Array<{
    type: string;
    features: string[];
    condition: number;
  }>;
  exteriorFeatures: string[];
  maintenanceRequirements: string[];
  valueFactors: {
    positives: string[];
    negatives: string[];
    improvements: string[];
  };
  marketAppeal: {
    strengths: string[];
    challenges: string[];
    targetMarket: string[];
  };
}

export interface ApiResponse {
  requestId: string;
  status: string;
  data: {
    propertyData: PropertyData;
    visionAnalysis: VisionAnalysis;
    marketAnalysis: MarketAnalysis;
    assessment: Assessment;
    valuation: ValuationData;
    reportUrls: {
      executiveSummary: string;
      visionAnalysis: string;
      marketAnalysis: string;
      assessment: string;
    };
  };
  timestamp: string;
}

export type NormalizedHouseType = 
  | 'detached'
  | 'semi-detached'
  | 'townhouse'
  | 'apartment-ground'
  | 'apartment-upper'
  | 'apartment-complex';

export interface ComparableProperty {
  PostCode: string;
  HouseNumber: number;
  HouseAddition: string | null;
  Street: string;
  BuurtCode: string;
  WijkCode: string;
  City: string;
  HouseType: string;
  BuildYear: number;
  InnerSurfaceArea: number;
  OuterSurfaceArea: number | null;
  Volume: number;
  DefinitiveEnergyLabel: string | null;
  DefinitiveType: string | null;
  DefinitiveValidity: string | null;
  Longitude: number;
  Latitude: number;
  Transactiondate: number;
  Image: string | null;
  TransactionPrice: string;
  IndexedTransactionPrice: string;
  PriceIndex: number;
  Distance: number;
  VisualSimilarityScore: number | null;
  Weight: number;
}

export function normalizeHouseType(type: string): NormalizedHouseType {
  const normalized = type.toLowerCase();
  if (normalized.includes('vrijstaande')) return 'detached';
  if (normalized.includes('2-onder-1-kap') || normalized.includes('geschakelde')) return 'semi-detached';
  if (normalized.includes('tussenwoning') || normalized.includes('hoekwoning') || normalized.includes('eindwoning')) return 'townhouse';
  if (normalized.includes('benedenwoning')) return 'apartment-ground';
  if (normalized.includes('bovenwoning') || normalized.includes('maisonnette')) return 'apartment-upper';
  if (normalized.includes('flat') || normalized.includes('appartement')) return 'apartment-complex';
  return 'apartment-complex';
}

export function parseTransactionPrice(price: string): number {
  const [min, max] = price.split('-').map(p => parseInt(p.replace(/\D/g, '')));
  return max || min;
}
