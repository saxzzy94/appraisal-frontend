'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PropertyImagesProps {
  images: string[];
}

export function PropertyImages({ images }: PropertyImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Card className="relative overflow-hidden group">
        {/* Main Image */}
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={images[currentIndex]}
            alt={`Property image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          
          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsFullscreen(true)}
          >
            <Expand className="h-5 w-5" />
          </Button>

          {/* Navigation Buttons */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-black/40 backdrop-blur-sm"
              onClick={previousImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-black/40 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="relative p-4 bg-muted/50">
          <div className="grid grid-cols-5 gap-2">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={index}
                className={cn(
                  "relative aspect-[4/3] rounded-md overflow-hidden ring-offset-background transition-all hover:opacity-80",
                  currentIndex === index && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => setCurrentIndex(index)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
            {images.length > 5 && (
              <button
                className="relative aspect-[4/3] rounded-md overflow-hidden bg-muted/80 flex items-center justify-center text-sm font-medium hover:bg-muted"
                onClick={() => setIsFullscreen(true)}
              >
                +{images.length - 5} more
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={images[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
            
            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-black/40 backdrop-blur-sm"
                onClick={previousImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-black/40 backdrop-blur-sm"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
