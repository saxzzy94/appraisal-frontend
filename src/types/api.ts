export interface PropertyLocation {
  city: string;
  neighborhood: string;
  postalCode: string;
}

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
  location: PropertyLocation;
  features: string[];
  description: string;
}

export interface RoomAnalysis {
  type: string;
  features: string[];
  condition: number;
}

export interface ValueFactors {
  positives: string[];
  negatives: string[];
  improvements: string[];
}

export interface MarketAppeal {
  strengths: string[];
  challenges: string[];
  targetMarket: string[];
}

export interface VisionAnalysis {
  propertyType: string;
  overallCondition: number;
  overallQuality: number;
  rooms: RoomAnalysis[];
  exteriorFeatures: string[];
  maintenanceRequirements: string[];
  valueFactors: ValueFactors;
  marketAppeal: MarketAppeal;
}

export interface Assessment {
  propertyType: string;
  overallCondition: number;
  overallQuality: number;
  rooms: RoomAnalysis[];
  exteriorFeatures: string[];
  maintenanceRequirements: string[];
  valueFactors: ValueFactors;
}

export interface PropertyAnalysis {
  requestId: string;
  status: "success" | "error";
  data: {
    propertyData: PropertyData;
    visionAnalysis: VisionAnalysis;
    assessment: Assessment;
  };
}
