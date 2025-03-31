'use client';

import { useQuery } from '@tanstack/react-query';
import { getAnalysis } from '@/lib/storage';

export function useAnalysisResults(id: string) {
  return useQuery({
    queryKey: ['analysis', id],
    queryFn: () => {
      const analysis = getAnalysis(id);
      if (!analysis) {
        throw new Error('Analysis not found');
      }
      return analysis;
    },
    // No need to refetch since we're using in-memory storage
    refetchInterval: false,
  });
}
