'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { useImageManager } from '@/hooks/useImageManager';
import { cn } from '@/lib/utils';

interface PropertyImagesProps {
  images: string[];
  mode?: 'compact' | 'detailed';
  maxThumbnails?: number;
}

export function PropertyImages({ 
  images, 
  mode = 'compact',
  maxThumbnails = 5 
}: PropertyImagesProps) {
  const {
    processedImages,
    currentIndex,
    isModalOpen,
    setCurrentIndex,
    openModal,
    closeModal,
    nextImage,
    previousImage,
  } = useImageManager(images);

  if (processedImages.length === 0) {
    return (
      <Card className="relative aspect-[16/9] flex items-center justify-center bg-muted/10">
        <p className="text-muted-foreground">No images available</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="relative overflow-hidden group">
        {/* Main Image */}
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={processedImages[currentIndex]}
            alt={`Property image ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
            priority
          />
          
          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {currentIndex + 1} / {processedImages.length}
          </div>

          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-white hover:bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openModal(currentIndex)}
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
            {processedImages.slice(0, maxThumbnails).map((image, index) => (
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
                  sizes="(max-width: 768px) 20vw, 10vw"
                />
              </button>
            ))}
            {processedImages.length > maxThumbnails && (
              <button
                className="relative aspect-[4/3] rounded-md overflow-hidden bg-muted/80 flex items-center justify-center text-sm font-medium hover:bg-muted"
                onClick={() => openModal(currentIndex)}
              >
                +{processedImages.length - maxThumbnails} more
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Fullscreen Dialog */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={processedImages[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
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
              {currentIndex + 1} / {processedImages.length}
            </div>
          </div>

          {/* Thumbnail Strip in Modal */}
          {mode === 'detailed' && (
            <div className="bg-background p-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {processedImages.map((image, index) => (
                  <button
                    key={`modal-thumb-${index}`}
                    className={cn(
                      "relative w-20 h-16 flex-shrink-0 rounded-md overflow-hidden transition-all",
                      currentIndex === index ? "ring-2 ring-primary" : "hover:opacity-80"
                    )}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
