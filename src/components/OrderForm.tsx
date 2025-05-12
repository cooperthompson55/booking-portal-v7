import React from 'react';
import { OrderFormData } from '../types';
import { Home, Calendar, MessageSquare, AlertCircle, User, Mail, Phone, Building2 } from 'lucide-react';

interface OrderFormProps {
  formData: OrderFormData;
  onFormChange: (field: keyof Omit<OrderFormData, 'address' | 'agent'>, value: any) => void;
  onAddressChange: (field: keyof OrderFormData['address'], value: string) => void;
  onAgentChange: (field: keyof OrderFormData['agent'], value: string) => void;
  validationErrors: string[];
}

const OrderForm: React.FC<OrderFormProps> = ({
  formData,
  onFormChange,
  onAddressChange,
  onAgentChange,
  validationErrors
}) => {
  const hasError = (fieldName: string): boolean => {
    return validationErrors.some(error => error.toLowerCase().includes(fieldName.toLowerCase()));
  };

  const inputClassName = (fieldName: string) => `
    w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1
    ${hasError(fieldName)
      ? 'border-red-300 focus:ring-red-500 bg-red-50'
      : 'border-gray-300 focus:ring-blue-500'
    }
  `;

  return (
    <div className="space-y-6">
      {/* Agent Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5" />
          Agent Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Your Name"
              value={formData.agent.name}
              onChange={(e) => onAgentChange('name', e.target.value)}
              className={inputClassName('name')}
            />
            {hasError('name') && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.agent.email}
              onChange={(e) => onAgentChange('email', e.target.value)}
              className={inputClassName('email')}
            />
            {hasError('email') && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="relative">
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.agent.phone}
              onChange={(e) => onAgentChange('phone', e.target.value)}
              className={inputClassName('phone')}
            />
            {hasError('phone') && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Company (Optional)"
              value={formData.agent.company}
              onChange={(e) => onAgentChange('company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Property Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Property Address
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Street Address"
              value={formData.address.street}
              onChange={(e) => onAddressChange('street', e.target.value)}
              className={inputClassName('street')}
            />
            {hasError('street') && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            value={formData.address.street2}
            onChange={(e) => onAddressChange('street2', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="City"
                value={formData.address.city}
                onChange={(e) => onAddressChange('city', e.target.value)}
                className={inputClassName('city')}
              />
              {hasError('city') && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Province"
                value={formData.address.province}
                onChange={(e) => onAddressChange('province', e.target.value)}
                className={inputClassName('province')}
              />
              {hasError('province') && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Postal Code"
                value={formData.address.zipCode}
                onChange={(e) => onAddressChange('zipCode', e.target.value)}
                className={inputClassName('postal')}
              />
              {hasError('postal') && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Status
          </label>
          <select
            value={formData.occupancyStatus}
            onChange={(e) => onFormChange('occupancyStatus', e.target.value as OrderFormData['occupancyStatus'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Vacant">Vacant</option>
            <option value="Occupied">Occupied</option>
            <option value="Tenanted">Tenanted</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline-block mr-1" />
            Preferred Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => onFormChange('preferredDate', e.target.value)}
              className={inputClassName('date')}
            />
            {hasError('date') && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MessageSquare className="w-4 h-4 inline-block mr-1" />
          Additional Notes
        </label>
        <textarea
          placeholder="Gate code, special property features, etc."
          value={formData.propertyNotes}
          onChange={(e) => onFormChange('propertyNotes', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default OrderForm;