import { useState } from 'react';
import { propertyApi } from '@/lib/api';
import type { ApiResponse, ApiErrorResponse } from '@/types/api';

export function usePropertyAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ApiResponse | ApiErrorResponse | null>(null);

  const analyzeProperty = async (url: string): Promise<void> => {
    setIsAnalyzing(true);
    try {
      const result = await propertyApi.analyzeProperty(url);
      setAnalysisResult(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
  };

  return {
    analyzeProperty,
    clearAnalysis,
    isAnalyzing,
    analysisResult,
  } as const;
}
