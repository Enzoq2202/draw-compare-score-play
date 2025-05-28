
import { useEffect, useState } from 'react';
import { CATEGORY_IMAGES, Category } from '../types/game';

export const useImagePreloader = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = Object.values(CATEGORY_IMAGES).map((src) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        // Still set to true to allow the game to continue
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, []);

  return imagesLoaded;
};
