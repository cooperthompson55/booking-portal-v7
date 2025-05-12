import React from 'react';
import PropertySizeSelector from './PropertySizeSelector';
import ServiceSelector from './ServiceSelector';
import PackageSummary from './PackageSummary';
import OrderForm from './OrderForm';
import { services } from '../data/services';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { OrderFormData, PropertySize, Service } from '../types';

interface PackageBuilderProps {
  selectedSize: PropertySize | null;
  selectedServices: Map<string, { price: number; count: number }>;
  totalPrice: number;
  formData: OrderFormData;
  isSubmitting: boolean;
  showSuccess: boolean;
  validationErrors: string[];
  handleSizeSelect: (size: PropertySize) => void;
  handleServiceToggle: (service: Service, count?: number) => void;
  handleFormChange: (field: keyof Omit<OrderFormData, 'address' | 'agent'>, value: any) => void;
  handleAddressChange: (field: keyof OrderFormData['address'], value: string) => void;
  handleAgentChange: (field: keyof OrderFormData['agent'], value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleReset: () => void;
}

const PackageBuilder: React.FC<PackageBuilderProps> = ({
  selectedSize,
  selectedServices,
  totalPrice,
  formData,
  isSubmitting,
  showSuccess,
  validationErrors,
  handleSizeSelect,
  handleServiceToggle,
  handleFormChange,
  handleAddressChange,
  handleAgentChange,
  handleSubmit,
  handleReset
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 lg:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-primary mb-8">
          RePhotos Booking Request
        </h1>
        
        {validationErrors.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-medium">Please fix the following issues:</h3>
            </div>
            <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form 
          id="bookingForm" 
          onSubmit={handleSubmit} 
          className="space-y-8"
        >
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
          
          <PackageSummary 
            selectedServices={selectedServices} 
            totalPrice={totalPrice} 
            selectedSize={selectedSize}
          />

          <OrderForm 
            formData={formData}
            onFormChange={handleFormChange}
            onAddressChange={handleAddressChange}
            onAgentChange={handleAgentChange}
            validationErrors={validationErrors}
          />

          <div className="pt-6 border-t border-gray-100">
            {!showSuccess ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full py-4 px-6 rounded-lg text-white font-medium text-lg
                  transition-all duration-200
                  ${!isSubmitting
                    ? 'bg-primary hover:bg-primary-light'
                    : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-semibold text-primary mb-2">Booking Submitted Successfully!</h2>
                <p className="text-gray-600 mb-6">Thank you for your booking request. We'll be in touch shortly.</p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors text-base"
                >
                  Submit Another Booking
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageBuilder;