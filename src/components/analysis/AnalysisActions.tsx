'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { propertyApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, Loader2 } from 'lucide-react';

interface AnalysisActionsProps {
  requestId: string;
  propertyAddress: string;
}

export function AnalysisActions({ requestId, propertyAddress }: AnalysisActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const reportUrl = `/api/reports/executive_summary_${requestId}.pdf`;
      const blob = await propertyApi.getReport(reportUrl);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Property Analysis - ${propertyAddress}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to download report",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      toast({
        title: "Error",
        description: "Sharing is not supported on this device",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.share({
        title: `Property Analysis - ${propertyAddress}`,
        text: `Check out this property analysis for ${propertyAddress}`,
        url: window.location.href,
      });
    } catch (err) {
      // Ignore AbortError as it's triggered when user cancels share dialog
      if ((err as Error).name !== 'AbortError') {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to share analysis",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Download Report
      </Button>
      
      <Button
        variant="outline"
        onClick={handleShare}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  );
}
