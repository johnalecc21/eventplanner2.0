import { Dispatch, SetStateAction } from 'react';

interface ViewControlsProps {
  totalResults: number;
  viewMode: 'grid' | 'list';
  setViewMode: Dispatch<SetStateAction<'grid' | 'list'>>;
}

const ViewControls = ({ totalResults, viewMode, setViewMode }: ViewControlsProps) => {
  return (
    <div className="flex items-center justify-between mb-6 mt-8">
      <div className="text-gray-700 font-medium">
        Mostrando {totalResults} resultados
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-700 mr-2">Ver:</span>
        <button
        className={`p-2 rounded transition-all ${
            viewMode === 'list'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-[#f0e6ff] hover:text-[#a770ff]'
        }`}
        onClick={() => setViewMode('list')}
        aria-label="Ver como lista"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
            />
        </svg>
        </button>

        <button
        className={`p-2 rounded transition-all ${
            viewMode === 'grid'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-[#f0e6ff] hover:text-[#a770ff]'
        }`}
        onClick={() => setViewMode('grid')}
        aria-label="Ver como cuadrícula"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
        </svg>
        </button>
      </div>
    </div>
  );
};

export default ViewControls;