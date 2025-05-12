import React from 'react';
import PropertySizeSelector from './PropertySizeSelector';
import ServiceSelector from './ServiceSelector';
import { services } from '../data/services';
import { ArrowRight } from 'lucide-react';
import { PropertySize, Service } from '../types';

interface SimplePackageBuilderProps {
  onShowFullForm: () => void;
  selectedSize: PropertySize | null;
  selectedServices: Map<string, { price: number; count: number }>;
  totalPrice: number;
  validationErrors: string[];
  handleSizeSelect: (size: PropertySize) => void;
  handleServiceToggle: (service: Service, count?: number) => void;
}

const SimplePackageBuilder: React.FC<SimplePackageBuilderProps> = ({
  onShowFullForm,
  selectedSize,
  selectedServices,
  totalPrice,
  validationErrors,
  handleSizeSelect,
  handleServiceToggle,
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 lg:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-primary mb-8">
          RePhotos Quick Quote
        </h1>

        <div className="space-y-10">
          <PropertySizeSelector 
            selectedSize={selectedSize} 
            onSizeSelect={handleSizeSelect}
            validationErrors={validationErrors}
          />

          <ServiceSelector 
            services={services} 
            selectedServices={selectedServices} 
            onServiceToggle={handleServiceToggle}
            selectedSize={selectedSize}
            validationErrors={validationErrors}
          />

          <div className="border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-primary">Estimated Total</span>
              <span className="text-2xl font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={onShowFullForm}
              className="w-full py-4 px-6 bg-primary hover:bg-primary-light text-white rounded-lg text-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              Continue to Booking
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePackageBuilder;