import React, { useState } from 'react';
import { Service, PropertySize } from '../types';
import { getServiceIcon } from '../utils/serviceIcons';
import { Plus, Minus, AlertCircle } from 'lucide-react';
import { pricingData } from '../data/pricing';

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: Map<string, { price: number; count: number }>;
  onServiceToggle: (service: Service, count?: number) => void;
  selectedSize: PropertySize | null;
  validationErrors: string[];
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ 
  services, 
  selectedServices, 
  onServiceToggle,
  selectedSize,
  validationErrors
}) => {
  const [localCounts, setLocalCounts] = useState<Map<string, number>>(new Map());

  const hasError = validationErrors.some(error => 
    error.toLowerCase().includes('service')
  );

  const getServicePrice = (service: Service): number => {
    if (!selectedSize) return service.price;
    return pricingData[selectedSize][service.id];
  };

  const handleServiceClick = (service: Service) => {
    const currentCount = localCounts.get(service.id) || 1;
    onServiceToggle(service, currentCount);
  };

  const handleCountChange = (service: Service, increment: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLocalCounts(prev => {
      const updated = new Map(prev);
      const currentCount = prev.get(service.id) || 1;
      const newCount = increment ? currentCount + 1 : Math.max(1, currentCount - 1);
      updated.set(service.id, newCount);
      
      // If service is selected, update the count
      if (selectedServices.has(service.name)) {
        onServiceToggle(service, newCount);
      }
      
      return updated;
    });
  };

  return (
    <div>
      <div className="flex items-center mb-3">
        <h2 className={`text-base font-medium ${hasError ? 'text-red-600' : 'text-gray-800'}`}>
          Select Your Services
        </h2>
        {hasError && (
          <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {services.map((service) => {
          const serviceData = selectedServices.get(service.name);
          const isSelected = !!serviceData;
          const ServiceIcon = getServiceIcon(service.id);
          const price = getServicePrice(service);
          const count = serviceData?.count || localCounts.get(service.id) || 1;
          
          return (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className={`
                group relative flex flex-col items-center justify-center p-3
                rounded-md transition-all duration-200 ease-in-out cursor-pointer
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }
              `}
            >
              <div className="mb-2">
                <ServiceIcon className={`w-6 h-6 ${
                  isSelected 
                    ? 'text-white' 
                    : 'text-blue-600 group-hover:text-blue-500'
                }`} />
              </div>
              <span className="text-xs font-medium text-center mb-1">{service.name}</span>
              <span className={`text-xs ${
                isSelected 
                  ? 'text-blue-100'
                  : 'text-gray-500'
              }`}>
                ${price.toFixed(2)}
              </span>
              
              {service.id === 'virtualStaging' && (
                <div className={`absolute top-1 right-1 flex items-center gap-1 ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`}>
                  <button
                    type="button"
                    onClick={(e) => handleCountChange(service, false, e)}
                    className={`p-1 rounded-full ${
                      isSelected 
                        ? 'hover:bg-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-medium min-w-[12px] text-center">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCountChange(service, true, e)}
                    className={`p-1 rounded-full ${
                      isSelected 
                        ? 'hover:bg-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;