import React from 'react';
import { Gift } from 'lucide-react';
import { PropertySize } from '../types';
import { discountTiers, getDiscount } from '../data/discounts';

interface PackageSummaryProps {
  selectedServices: Map<string, { price: number; count: number }>;
  totalPrice: number;
  selectedSize: PropertySize | null;
}

const PackageSummary: React.FC<PackageSummaryProps> = ({ 
  selectedServices, 
  totalPrice,
  selectedSize
}) => {
  const hasServices = selectedServices.size > 0;
  const subtotal = totalPrice;
  
  // Calculate volume discount
  const volumeDiscount = getDiscount(subtotal);
  const volumeDiscountAmount = volumeDiscount ? (subtotal * volumeDiscount.percentage) / 100 : 0;
  
  // Calculate final price
  const finalTotal = subtotal - volumeDiscountAmount;
  
  const formatSize = (size: PropertySize | null): string => {
    if (!size) return 'Not selected';
    
    switch (size) {
      case '<1000': return 'Under 1000 sq ft';
      case '1000-2000': return '1000–2000 sq ft';
      case '2000-3000': return '2000–3000 sq ft';
      case '3000-4000': return '3000–4000 sq ft';
      case '4000-5000': return '4000–5000 sq ft';
      default: return size;
    }
  };

  // Find next discount tier
  const nextDiscountTier = discountTiers.find(tier => subtotal < tier.threshold);

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Your Package
      </h2>
      
      {selectedSize && (
        <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <Gift className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Property Size</p>
            <p className="font-medium">{formatSize(selectedSize)}</p>
          </div>
        </div>
      )}
      
      {hasServices && (
        <div className="mb-6">
          <ul className="space-y-2">
            {Array.from(selectedServices.entries()).map(([name, { price, count }]) => (
              <li key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">
                  {name}
                  {count > 1 && ` (x${count})`}
                </span>
                <span className="text-gray-700">${(price * count).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Volume Discount Section */}
      {hasServices && volumeDiscount && (
        <div className="mb-6 bg-primary/5 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-primary/10">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Volume Discount Applied!</h3>
                <p className="text-sm text-primary/80">
                  {volumeDiscount.percentage}% off your order
                </p>
                <p className="text-sm font-medium text-primary mt-1">
                  You save ${volumeDiscountAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          {nextDiscountTier && (
            <div className="p-4 bg-primary/10">
              <p className="text-sm font-medium text-primary">
                🎉 Add ${(nextDiscountTier.threshold - subtotal).toFixed(2)} more to save {nextDiscountTier.percentage}%
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Price Summary */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {volumeDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-primary font-medium">
            <span>Volume Discount</span>
            <span>-${volumeDiscountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-xl font-bold">
          <span className="text-primary">Total</span>
          <span className="text-primary">${finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PackageSummary;