# Frontend Implementation Documentation

## Overview
This document outlines the frontend implementation for the Property Appraisal Application using Next.js 14, Tailwind CSS, and shadcn/ui. The application primarily focuses on analyzing properties based on a provided URL input.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation

## Design System

### Color Palette
```css
--primary: #0F172A;    /* Dark blue for primary actions */
--secondary: #64748B;  /* Slate for secondary elements */
--accent: #2563EB;     /* Blue for accents and CTAs */
--background: #FFFFFF; /* White background */
--success: #22C55E;    /* Green for positive indicators */
--warning: #F59E0B;    /* Amber for warnings */
--error: #EF4444;      /* Red for errors */
```

### Typography
- **Headings**: Inter (sans-serif)
- **Body**: Inter (sans-serif)
- **Monospace**: JetBrains Mono (for property data)

## Component Architecture

### Core Components

1. **URLInputForm**
```typescript
interface URLInputFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

const URLInputForm = ({ onSubmit, isLoading }: URLInputFormProps) => {
  // URL validation
  // Loading state handling
  // Error feedback
};
```

2. **AnalysisResults**
```typescript
interface AnalysisResultsProps {
  data: {
    propertyData: PropertyData;
    visionAnalysis: VisionAnalysis;
    assessment: Assessment;
    valuation: Valuation;
  };
}
```

3. **PropertyOverview**
   - Display basic property information
   - Show property images in a carousel
   - Present key metrics

4. **AnalysisMetrics**
   - Vision analysis results
   - Property assessment
   - Valuation details

### Page Structure

```typescript
app/
├── page.tsx                 // Landing page
├── analyze/                 // URL input form
│   └── page.tsx
└── results/                // Analysis results
    └── [id]/
        └── page.tsx
```

### Landing Page

The landing page serves as the entry point to the application, featuring:

1. **Hero Section**
   - Compelling headline about property appraisal
   - Brief description of the service
   - CTA button leading to analysis page

2. **Features Section**
   - Key features of the analysis service
   - Visual representations of the analysis process
   - Sample results preview

3. **How It Works**
   - Step-by-step guide
   - Visual process flow
   - Example use cases

4. **Trust Indicators**
   - Success metrics
   - Sample property analyses
   - Testimonials (if applicable)

```typescript
// Landing page component structure
interface LandingPageProps {
  stats: {
    analysisCount: number;
    averageAccuracy: number;
    supportedPlatforms: string[];
  };
}

const LandingPage = ({ stats }: LandingPageProps) => {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustIndicators stats={stats} />
    </main>
  );
};
```

## API Integration

### Endpoint
```typescript
POST /api/v1/analyze
// Request body:
{
  url: string;
}

// Response structure:
interface ApiResponse {
  requestId: string;
  status: "success" | "error";
  data: {
    propertyData: {
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
      location: {
        city: string;
        neighborhood: string;
        postalCode: string;
      };
      features: string[];
      description: string;
    };
    visionAnalysis: {
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
    };
    assessment: {
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
    };
    valuation: {
      estimatedValue: number;
      confidence: number;
      adjustments: {
        conditionAdjustment: number;
        locationAdjustment: number;
        marketTrendAdjustment: number;
      };
      avmConfidence: string;
    };
    reportUrls: {
      executiveSummary: string;
      visionAnalysis: string;
      marketAnalysis: string;
      assessment: string;
    };
  };
  timestamp: string;
}
```

### Data Fetching
```typescript
const usePropertyAnalysis = (url: string) => {
  return useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      return response.json();
    }
  });
};
```

## State Management

### Form State
```typescript
const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL')
});

const URLInput = () => {
  const form = useForm({
    resolver: zodResolver(urlSchema)
  });
  
  const onSubmit = async (data: { url: string }) => {
    // Handle submission
  };
};
```

### Analysis State
```typescript
interface AnalysisState {
  propertyData: PropertyData;
  visionAnalysis: VisionAnalysis;
  assessment: Assessment;
  valuation: Valuation;
}
```

## Key Features Implementation

### 1. URL Input and Validation
```typescript
const URLValidation = () => {
  // Real-time URL validation
  // Format checking
  // Error messaging
};
```

### 2. Analysis Display
```typescript
const AnalysisDisplay = () => {
  // Loading states
  // Error handling
  // Results presentation
};
```

## Error Handling

1. **Input Validation**
   - URL format validation
   - Accessibility domain checking
   - Network error handling

2. **Analysis Errors**
   - Invalid URL responses
   - Timeout handling
   - Fallback states

## Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktop */
```

### Mobile Considerations
- Single column layout
- Touch-friendly input
- Responsive data visualization

## Testing Strategy

1. **Unit Tests**
   - URL validation
   - Component rendering
   - Error handling

2. **Integration Tests**
   - Form submission
   - API integration
   - State management

## Security Measures

1. **URL Validation**
   - Input sanitization
   - Domain allowlist
   - Rate limiting

2. **Data Protection**
   - Secure API calls
   - Error message sanitization
   - XSS prevention

## Development Guidelines

1. **Code Style**
   - ESLint configuration
   - Prettier setup
   - Component patterns

2. **Version Control**
   - Branch strategy
   - Commit conventions
   - PR templates
