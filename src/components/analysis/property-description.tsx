'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlignLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlignLeft className="h-5 w-5" />
          Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={cn(
              "relative transition-all duration-200",
              !isExpanded && "max-h-[120px] overflow-hidden"
            )}
          >
            <p className="text-muted-foreground whitespace-pre-line">
              {description}
            </p>
            
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
            )}
          </div>
          
          <Button
            variant="ghost"
            className="w-full flex items-center gap-2 hover:bg-muted/50"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Read More</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
