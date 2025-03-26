# Frontend Implementation Documentation

## Overview

This document outlines the frontend implementation for the Property Appraisal Application using Next.js 14, Tailwind CSS, and shadcn/ui. The application primarily focuses on analyzing properties based on a provided URL input.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation

## Design System

### Color Palette

```css
--primary: #0f172a; /* Dark blue for primary actions */
--secondary: #64748b; /* Slate for secondary elements */
--accent: #2563eb; /* Blue for accents and CTAs */
--background: #ffffff; /* White background */
--success: #22c55e; /* Green for positive indicators */
--warning: #f59e0b; /* Amber for warnings */
--error: #ef4444; /* Red for errors */
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
├── analyze/                 // URL input & results display
│   └── page.tsx            // Handles both input and showing results
└── layout.tsx              // Root layout with navigation
```

### Page Flow

1. **Landing Page (`/`)**

   - Introduction to the service
   - Call to action to start analysis
   - Sample results and features

2. **Analysis Page (`/analyze`)**
   - URL input form
   - Loading state during analysis
   - Results display after successful analysis
   - Error handling and retry options

```typescript
// Analysis page component structure
const AnalyzePage = () => {
	const [analysisData, setAnalysisData] = useState<ApiResponse | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const handleAnalysis = async (url: string) => {
		setIsAnalyzing(true);
		try {
			const result = await analyzeProperty(url);
			setAnalysisData(result);
		} catch (error) {
			// Handle error
		} finally {
			setIsAnalyzing(false);
		}
	};

	return (
		<main>
			<URLInputForm onSubmit={handleAnalysis} isLoading={isAnalyzing} />
			{isAnalyzing && <AnalysisProgress />}
			{analysisData && <AnalysisResults data={analysisData} />}
		</main>
	);
};
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
  forceReanalysis?: boolean; // Optional: force a new analysis even if one exists
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
        locationScores: {
          amenities: number;
          transport: number;
          schoolQuality: number;
          composite: number;
        };
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
      historicalTrends: {
        daysOnMarket: number;
        priceChanges: Array<{
          date: string;
          percentageChange: number;
        }>;
      };
      avmConfidence: string;
    };
    reportUrls: {
      executiveSummary: string;
      visionAnalysis: string;
      marketAnalysis: string;
      assessment: string;
    };
    report: {
      local: string;  // Local path to report
      s3?: string;    // Pre-signed S3 URL
    };
  };
  timestamp: string;
}
```

### Data Fetching

```typescript
const usePropertyAnalysis = (url: string, forceReanalysis: boolean = false) => {
	return useMutation({
		mutationFn: async (params: { url: string; forceReanalysis: boolean }) => {
			const response = await fetch("/api/v1/analyze", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(params),
			});
			return response.json();
		},
	});
};
```

### Chat Session Integration

```typescript
const useChatSession = (
	propertyUrl: string,
	useExistingSession: boolean = false
) => {
	return useMutation({
		mutationFn: async (params: {
			message: string;
			propertyUrl: string;
			useExistingSession: boolean;
		}) => {
			const response = await fetch("/api/v1/chat/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(params),
			});
			return response.json();
		},
	});
};
```

## State Management

### Form State

```typescript
const urlSchema = z.object({
	url: z.string().url("Please enter a valid URL"),
	forceReanalysis: z.boolean().optional().default(false),
});

const URLInput = () => {
	const form = useForm({
		resolver: zodResolver(urlSchema),
		defaultValues: {
			forceReanalysis: false,
		},
	});

	const onSubmit = async (data: { url: string; forceReanalysis: boolean }) => {
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
	historicalTrends: HistoricalTrends;
	reportUrls?: { local: string; s3?: string };
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

````typescript
const AnalysisDisplay = () => {
  // Loading states
  // Error handling
  // Results presentation
};

### 5. Location Analysis Display
```typescript
const LocationAnalysis = ({ scores }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Location Analysis</h3>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Amenities Score"
          value={scores.amenities}
          max={10}
        />
        <MetricCard
          title="Transport Score"
          value={scores.transport}
          max={10}
        />
        <MetricCard title="School Quality" value={scores.schoolQuality} max={10} />
        <MetricCard title="Composite Score" value={scores.composite} max={10} />
      </div>
    </div>
  );
};
````

### 3. Existing Analysis Detection

```typescript
const ExistingAnalysisNotification = ({
	hasExistingAnalysis,
	onUseExisting,
	onForceNew,
}) => {
	if (!hasExistingAnalysis) return null;

	return (
		<div className="bg-blue-50 p-4 rounded-md mb-4">
			<div className="flex items-center">
				<InfoIcon className="h-5 w-5 text-blue-400 mr-2" />
				<p className="text-sm text-blue-700">
					We found an existing analysis for this property. Would you like to use
					it?
				</p>
			</div>
			<div className="mt-3 flex space-x-2">
				<Button variant="outline" size="sm" onClick={onUseExisting}>
					Use Existing Analysis
				</Button>
				<Button variant="default" size="sm" onClick={onForceNew}>
					Perform New Analysis
				</Button>
			</div>
		</div>
	);
};
```

### 4. Chat Session Management

```typescript
const ChatSessionControl = ({ propertyUrl, existingSessionId }) => {
	const [useExisting, setUseExisting] = useState(false);

	const handleStartChat = async (message: string) => {
		await startChatSession({
			message,
			propertyUrl,
			useExistingSession: useExisting,
		});
	};

	return (
		<div>
			{existingSessionId && (
				<div className="mb-4">
					<Checkbox
						id="useExisting"
						checked={useExisting}
						onCheckedChange={setUseExisting}
					/>
					<label htmlFor="useExisting" className="ml-2 text-sm">
						Continue existing chat session
					</label>
				</div>
			)}
			<ChatInput onSendMessage={handleStartChat} />
		</div>
	);
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
