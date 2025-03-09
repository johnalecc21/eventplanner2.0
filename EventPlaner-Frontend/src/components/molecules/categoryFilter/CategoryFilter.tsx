
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
    <div className="glass-effect p-6 rounded-2xl shadow-lg space-y-4">
      <h3 className="text-xl font-bold text-primary mb-4">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`w-full text-left px-6 py-3 rounded-2xl transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-primary text-white shadow-md'
                : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
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