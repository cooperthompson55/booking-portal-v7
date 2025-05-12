import React from 'react';
import { PropertySize } from '../types';
import { pricingData, packageInclusions } from '../data/pricing';
import { Package, Camera, Bone as Drone, Video, Film, Globe } from 'lucide-react';

interface PackageSelectorProps {
  selectedSize: PropertySize;
  selectedPackage: string | null;
  onPackageSelect: (packageName: keyof typeof packageInclusions) => void;
}

const PackageSelector: React.FC<PackageSelectorProps> = ({
  selectedSize,
  selectedPackage,
  onPackageSelect
}) => {
  const getPackageIcon = (packageName: string) => {
    switch (packageName) {
      case 'justPhotos':
        return Camera;
      case 'core':
        return Drone;
      case 'premium':
        return Video;
      case 'elite':
        return Film;
      case 'ultimate':
        return Globe;
      default:
        return Package;
    }
  };

  const getPackageDescription = (packageName: string) => {
    const inclusions = packageInclusions[packageName as keyof typeof packageInclusions];
    return inclusions ? inclusions.join(', ') : 'Description not available';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(pricingData[selectedSize]).map(([name, price]) => {
        const isSelected = selectedPackage === name;
        const PackageIcon = getPackageIcon(name);
        
        return (
          <button
            key={name}
            onClick={() => onPackageSelect(name as keyof typeof packageInclusions)}
            className={`
              relative p-4 rounded-xl transition-all duration-200 ease-in-out
              ${isSelected 
                ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-800 border border-gray-200 hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center mb-2">
              <PackageIcon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-blue-600'} mr-2`} />
              <h3 className="font-medium capitalize">
                {name.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
            </div>
            <p className={`text-sm mb-2 ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>
              {getPackageDescription(name)}
            </p>
            <div className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-blue-600'}`}>
              ${price.toFixed(2)}
            </div>
            
            {isSelected && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PackageSelector;