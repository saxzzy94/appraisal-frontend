'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { downloadReport } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Download, Share2, Loader2 } from 'lucide-react';

interface AnalysisActionsProps {
  requestId: string;
  propertyAddress: string;
}

export function AnalysisActions({
  requestId,
  propertyAddress,
}: AnalysisActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await downloadReport(`${requestId}.pdf`);
      
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
        title: 'Success',
        description: 'Report downloaded successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download report',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Property Analysis',
      text: `Check out this property analysis for ${propertyAddress}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied',
          description: 'Analysis link copied to clipboard',
          variant: 'success',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share analysis',
        variant: 'destructive',
      });
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
          <Loader2 className="animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Download Report
      </Button>
      <Button variant="outline" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  );
}
