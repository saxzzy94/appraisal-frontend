'use client';

import { useMutation } from '@tanstack/react-query';
import { analyzeProperty } from '@/lib/api';
import { useState } from 'react';
import { PropertyAnalysis } from '@/types/api';

export function usePropertyAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<PropertyAnalysis | null>(null);

  const mutation = useMutation({
    mutationFn: analyzeProperty,
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
  });

  return {
    analyzeProperty: mutation.mutate,
    isAnalyzing: mutation.isPending,
    error: mutation.error,
    analysisResult,
    clearAnalysis: () => setAnalysisResult(null),
  };
}
