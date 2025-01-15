'use client';

import { useQuery } from '@tanstack/react-query';
import { getStoredAnalysis } from '@/lib/api';

export function useAnalysisResults(id: string) {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () => {
      const analysis = getStoredAnalysis(id);
      if (!analysis) {
        throw new Error('Analysis not found');
      }
      return analysis;
    },
    // No need to refetch since we're using in-memory storage
    refetchInterval: false,
  });
}
