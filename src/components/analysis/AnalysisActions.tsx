'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { propertyApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, Loader2 } from 'lucide-react';

const isBrowser = typeof window !== 'undefined';

const downloadFile = (blob: Blob, filename: string) => {
  if (!isBrowser) return;
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const useShare = () => {
  const [canShare, setCanShare] = useState(false);
  
  useEffect(() => {
    setCanShare(isBrowser && !!navigator.share);
  }, []);
  
  return { canShare };
};

interface AnalysisActionsProps {
  requestId: string;
  propertyAddress: string;
}

export function AnalysisActions({ requestId, propertyAddress }: AnalysisActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { canShare } = useShare();

  const handleDownload = async () => {
    if (!isBrowser) return;
    
    setIsDownloading(true);
    try {
      const reportUrl = `/api/reports/executive_summary_${requestId}.pdf`;
      const blob = await propertyApi.getReport(reportUrl);
      
      downloadFile(blob, `Property Analysis - ${propertyAddress}.pdf`);

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
    if (!canShare) {
      toast({
        title: "Error",
        description: "Sharing is not supported on this device",
        variant: "destructive",
      });
      return;
    }

    const shareData = {
      title: `Property Analysis - ${propertyAddress}`,
      text: `Check out this property analysis for ${propertyAddress}`,
      url: isBrowser ? window.location.href : '',
    };

    try {
      await navigator.share(shareData);
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
