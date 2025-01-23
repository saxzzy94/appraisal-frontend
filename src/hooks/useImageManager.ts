import { useState, useMemo } from 'react';

interface ImageManagerState {
  currentIndex: number;
  isModalOpen: boolean;
}

interface ImageManagerResult {
  processedImages: string[];
  currentIndex: number;
  isModalOpen: boolean;
  setCurrentIndex: (index: number) => void;
  openModal: (index: number) => void;
  closeModal: () => void;
  nextImage: () => void;
  previousImage: () => void;
}

export function useImageManager(initialImages: string[]): ImageManagerResult {
  // Deduplicate images and ensure valid URLs
  const processedImages = useMemo(() => {
    const uniqueImages = Array.from(new Set(initialImages));
    return uniqueImages.filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        console.warn(`Invalid image URL skipped: ${url}`);
        return false;
      }
    });
  }, [initialImages]);

  const [state, setState] = useState<ImageManagerState>({
    currentIndex: 0,
    isModalOpen: false,
  });

  const setCurrentIndex = (index: number) => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, processedImages.length - 1)),
    }));
  };

  const openModal = (index: number) => {
    setState({
      currentIndex: index,
      isModalOpen: true,
    });
  };

  const closeModal = () => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
    }));
  };

  const nextImage = () => {
    setState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % processedImages.length,
    }));
  };

  const previousImage = () => {
    setState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 
        ? processedImages.length - 1 
        : prev.currentIndex - 1,
    }));
  };

  return {
    processedImages,
    currentIndex: state.currentIndex,
    isModalOpen: state.isModalOpen,
    setCurrentIndex,
    openModal,
    closeModal,
    nextImage,
    previousImage,
  };
}