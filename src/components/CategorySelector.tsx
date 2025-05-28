
import React from 'react';
import { Category, CATEGORY_LABELS } from '../types/game';

interface CategorySelectorProps {
  categories: Category[];
  categoryLabels: Record<Category, string>;
  onCategorySelect: (category: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  categoryLabels,
  onCategorySelect
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Choose What to Draw
        </h3>
        <p className="text-gray-600">
          Select a category and you'll have 1 minute to draw it!
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-2 border-transparent hover:border-purple-300 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="text-4xl mb-3">
              {categoryLabels[category].split(' ')[0]}
            </div>
            <div className="text-lg font-medium text-gray-700">
              {categoryLabels[category].split(' ').slice(1).join(' ')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
