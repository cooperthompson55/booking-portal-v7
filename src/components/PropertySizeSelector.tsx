import React from 'react';
import { Home, AlertCircle } from 'lucide-react';
import { PropertySize } from '../types';

interface PropertySizeSelectorProps {
  selectedSize: PropertySize | null;
  onSizeSelect: (size: PropertySize) => void;
  validationErrors: string[];
}

const PropertySizeSelector: React.FC<PropertySizeSelectorProps> = ({ 
  selectedSize, 
  onSizeSelect,
  validationErrors
}) => {
  const sizes: PropertySize[] = [
    '<1000',
    '1000-2000',
    '2000-3000',
    '3000-4000',
    '4000-5000'
  ];

  const getSizeLabel = (size: PropertySize): string => {
    switch (size) {
      case '<1000': return '< 1000 sq ft';
      case '1000-2000': return '1000–2000 sq ft';
      case '2000-3000': return '2000–3000 sq ft';
      case '3000-4000': return '3000–4000 sq ft';
      case '4000-5000': return '4000–5000 sq ft';
      default: return size;
    }
  };

  const hasError = validationErrors.some(error => 
    error.toLowerCase().includes('property size')
  );

  return (
    <div className="mb-8">
      <div className="flex items-center mb-3">
        <Home className={`w-5 h-5 ${hasError ? 'text-red-500' : 'text-blue-600'} mr-2`} />
        <h2 className={`text-lg md:text-xl font-medium ${hasError ? 'text-red-600' : 'text-gray-800'}`}>
          Select Property Size
        </h2>
        {hasError && (
          <AlertCircle className="w-5 h-5 text-red-500 ml-2" />
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSizeSelect(size)}
            className={`
              px-3 py-3 text-sm md:text-base rounded-lg 
              transition-all duration-200 ease-in-out 
              ${selectedSize === size
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {getSizeLabel(size)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertySizeSelector;