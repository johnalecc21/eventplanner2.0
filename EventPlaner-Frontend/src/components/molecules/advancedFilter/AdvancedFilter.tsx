import { Dispatch, SetStateAction } from 'react';
import { Search } from 'lucide-react';

interface FilterProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  selectedLocation: string;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
  minPrice: string;
  setMinPrice: Dispatch<SetStateAction<string>>;
  maxPrice: string;
  setMaxPrice: Dispatch<SetStateAction<string>>;
  ratingFilter: string;
  setRatingFilter: Dispatch<SetStateAction<string>>;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  clearFilters: () => void;
  applyFilters: () => void;
}

// You can extend this with your own locations or fetch from an API
const locations = ['Todas las ubicaciones', 'Bogota', 'Medellin', 'Cali', 'Cartagena'];

// Category tabs that will appear at the bottom of the filter
const categoryTabs = [
  'Todos', 
  'Catering', 
  'Música', 
  'Fotografía', 
  'Locaciones', 
  'Decoración', 
  'Regalos'
];

const AdvancedFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  ratingFilter,
  setRatingFilter,
  activeTab,
  setActiveTab,
  clearFilters,
  applyFilters
}: FilterProps) => {
  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Servicios para eventos</h1>
        <p className="text-xl text-gray-600">Encuentra y reserva los mejores servicios para tu próximo evento</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6
">
      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-8 ">
        <div className="flex-1 relative border rounded-lg overflow-hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar servicios, proveedores o ubicaciones"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2 focus:outline-none"
            data-testid="search-input"
          />
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 10h18M3 16h18" />
          </svg>
          Filtros
        </button>
        <button className="border border-gray-300 px-6 py-2 rounded-lg font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          Ordenar
        </button>
      </div>

      {/* Filters */}
      <div className="border-t border-gray-100 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Category Filter */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Categoría</label>
            <select 
              className="w-full p-2 border rounded-lg"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setActiveTab(e.target.value);
              }}
            >
              <option value="Todos">Todas las categorías</option>
              <option value="Catering">Catering</option>
              <option value="Música">Música</option>
              <option value="Fotografía">Fotografía</option>
              <option value="Locaciones">Locaciones</option>
              <option value="Decoración">Decoración</option>
              <option value="Regalos">Regalos</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Ubicación</label>
            <select 
              className="w-full p-2 border rounded-lg"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Rango de precio</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Min" 
                className="w-full p-2 border rounded-lg"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>-</span>
              <input 
                type="text" 
                placeholder="Max" 
                className="w-full p-2 border rounded-lg"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Calificación</label>
            <div className="flex gap-2">
                <button
                className={`px-4 py-2 rounded-lg transition-all ${
                    ratingFilter === 'Todos'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#f0e6ff] hover:text-[#a770ff]'
                }`}
                onClick={() => setRatingFilter('Todos')}
                >
                Todos
                </button>

                <button
                className={`px-4 py-2 rounded-lg transition-all ${
                    ratingFilter === '4+'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#f0e6ff] hover:text-[#a770ff]'
                }`}
                onClick={() => setRatingFilter('4+')}
                >
                4+
                </button>

                <button
                className={`px-4 py-2 rounded-lg transition-all ${
                    ratingFilter === '3+'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#f0e6ff] hover:text-[#a770ff]'
                }`}
                onClick={() => setRatingFilter('3+')}
                >
                3+
                </button>
            </div>
            </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-end mt-6 gap-4">
        {/* Botón "Limpiar filtros" */}
        <button
            className="bg-gray-100 px-6 py-2 rounded-lg text-gray-600 font-medium transition-colors hover:bg-gray-200 hover:text-gray-800"
            onClick={clearFilters}
        >
            Limpiar filtros
        </button>

        {/* Botón "Aplicar filtros" */}
        <button
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium transition-colors hover:bg-secondary hover:shadow-md"
            onClick={applyFilters}
        >
            Aplicar filtros
        </button>
        </div>
      </div>
    </div>

      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
            {categoryTabs.map(tab => (
            <button
                key={tab}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === tab
                    ? 'bg-[#a770ff] text-white'
                    : 'bg-white text-gray-700 hover:bg-[#f0e6ff] hover:text-[#a770ff]'
                }`}
                onClick={() => {
                setActiveTab(tab);
                setSelectedCategory(tab);
                }}
            >
                {tab}
            </button>
            ))}
        </div>
        </div>
    </div>
  );
};

export default AdvancedFilter;