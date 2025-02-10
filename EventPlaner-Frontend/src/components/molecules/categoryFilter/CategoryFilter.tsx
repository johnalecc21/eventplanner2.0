import { useState } from 'react';

const categories = [
  'All Services',
  'Photography',
  'Catering',
  'Music & Entertainment',
  'Venue',
  'Decoration',
  'Planning',
];

const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="glass-effect p-6 rounded-lg space-y-4">
      <h3 className="font-semibold mb-4">Categories</h3>

      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category
                ? 'bg-white/10 text-white'
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
