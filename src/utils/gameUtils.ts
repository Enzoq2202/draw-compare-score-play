
import { Category, CATEGORIES } from '../types/game';

export const getRandomCategory = (excludeCategory?: Category): Category => {
  if (!excludeCategory || CATEGORIES.length <= 1) {
    return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  }

  const availableCategories = CATEGORIES.filter(cat => cat !== excludeCategory);
  return availableCategories[Math.floor(Math.random() * availableCategories.length)];
};
