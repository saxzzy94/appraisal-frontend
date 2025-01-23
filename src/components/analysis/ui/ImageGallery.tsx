'use client';

import { useImageManager } from "@/hooks/useImageManager";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Grid2X2, Grid3X3 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  columns?: 2 | 3 | 4;
}

export function ImageGallery({ images, columns = 4 }: ImageGalleryProps) {
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

  const [gridColumns, setGridColumns] = useState(columns);

  if (processedImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const gridClassName = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[gridColumns];

  return (
    <div className="space-y-4">
      {/* Layout Controls */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setGridColumns(2)}
          className={gridColumns === 2 ? "bg-muted" : ""}
        >
          <Grid2X2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setGridColumns(4)}
          className={gridColumns === 4 ? "bg-muted" : ""}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Grid */}
      <div className={`grid ${gridClassName} gap-4 auto-rows-[200px]`}>
        {processedImages.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative rounded-lg border overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
            onClick={() => openModal(index)}
          >
            <Image
              src={url}
              alt={`Property image ${index + 1}`}
              fill
              className="object-cover"
              sizes={`(max-width: 768px) 50vw, (max-width: 1200px) ${100 / gridColumns}vw, ${100 / gridColumns}vw`}
              priority={index < 4}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">View</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <div className="relative flex h-full bg-black">
            {/* Main Image */}
            <div className="flex-1 relative">
              <Image
                src={processedImages[currentIndex]}
                alt={`Property image ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="80vw"
                priority
              />

              {/* Navigation Buttons */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {processedImages.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="w-24 bg-background border-l">
              <div className="h-full overflow-auto p-2 space-y-2">
                {processedImages.map((url, index) => (
                  <button
                    key={`thumb-${index}`}
                    className={`relative w-full aspect-square rounded overflow-hidden ${
                      currentIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <Image
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}