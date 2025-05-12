import { useState, useCallback, useMemo } from 'react';
import { Service, PropertySize, OrderFormData } from '../types';
import { pricingData } from '../data/pricing';
import { services } from '../data/services';
import { supabase } from '../lib/supabase';

const initialFormData: OrderFormData = {
  address: {
    street: '',
    street2: '',
    city: '',
    province: '',
    zipCode: '',
  },
  occupancyStatus: 'Vacant',
  preferredDate: '',
  propertyNotes: '',
  agent: {
    name: '',
    email: '',
    phone: '',
    company: ''
  }
};

interface ServiceCount {
  price: number;
  count: number;
}

export const usePackageBuilder = () => {
  const [selectedSize, setSelectedSize] = useState<PropertySize | null>(null);
  const [selectedServices, setSelectedServices] = useState<Map<string, ServiceCount>>(new Map());
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!selectedSize) {
      errors.push('Please select a property size');
    }

    if (selectedServices.size === 0) {
      errors.push('Please select at least one service');
    }

    if (!formData.address.street) {
      errors.push('Please enter the street address');
    }

    if (!formData.address.city) {
      errors.push('Please enter the city');
    }

    if (!formData.address.province) {
      errors.push('Please enter the province');
    }

    if (!formData.address.zipCode) {
      errors.push('Please enter the postal code');
    }

    if (!formData.preferredDate) {
      errors.push('Please select a preferred date');
    }

    if (!formData.agent.name) {
      errors.push('Please enter your name');
    }

    if (!formData.agent.email) {
      errors.push('Please enter your email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.agent.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.agent.phone) {
      errors.push('Please enter your phone number');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSizeSelect = useCallback((size: PropertySize) => {
    setSelectedSize(size);
    setValidationErrors([]);
    
    setSelectedServices(prev => {
      const updated = new Map<string, ServiceCount>();
      prev.forEach((serviceData, serviceName) => {
        const service = services.find(s => s.name === serviceName);
        if (service) {
          updated.set(serviceName, {
            price: pricingData[size][service.id],
            count: serviceData.count
          });
        }
      });
      return updated;
    });
  }, []);

  const handleServiceToggle = useCallback((service: Service, count: number = 1) => {
    setValidationErrors([]);
    setSelectedServices(prev => {
      const updated = new Map(prev);
      const isSelected = updated.has(service.name);
      
      if (isSelected) {
        updated.delete(service.name);
      } else {
        const price = selectedSize ? pricingData[selectedSize][service.id] : service.price;
        updated.set(service.name, { price, count });
      }
      
      return updated;
    });
  }, [selectedSize]);

  const handleAddressChange = useCallback((field: keyof OrderFormData['address'], value: string) => {
    setValidationErrors([]);
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  }, []);

  const handleAgentChange = useCallback((field: keyof OrderFormData['agent'], value: string) => {
    setValidationErrors([]);
    setFormData(prev => ({
      ...prev,
      agent: {
        ...prev.agent,
        [field]: value
      }
    }));
  }, []);

  const handleFormChange = useCallback((field: keyof Omit<OrderFormData, 'address' | 'agent'>, value: any) => {
    setValidationErrors([]);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const totalPrice = useMemo(() => {
    let total = 0;
    selectedServices.forEach(serviceData => {
      total += serviceData.price * serviceData.count;
    });
    return total;
  }, [selectedServices]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const servicesData = Array.from(selectedServices.entries()).map(([name, data]) => ({
        name,
        price: data.price,
        count: data.count,
        total: data.price * data.count
      }));

      const { data: userData } = await supabase.auth.getUser();
      
      const bookingData = {
        property_size: selectedSize,
        services: servicesData,
        total_amount: totalPrice,
        address: formData.address,
        notes: formData.propertyNotes || null,
        preferred_date: formData.preferredDate,
        property_status: formData.occupancyStatus,
        status: 'pending',
        user_id: userData?.user?.id || null,
        agent_name: formData.agent.name,
        agent_email: formData.agent.email,
        agent_phone: formData.agent.phone,
        agent_company: formData.agent.company || null
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) {
        throw error;
      }

      // Send email using Resend Edge Function with proper authorization
      const { data: { session } } = await supabase.auth.getSession();
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sendBookingEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ record: bookingData }),
      });

      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedSize, selectedServices, totalPrice, isSubmitting, validateForm]);

  const handleReset = useCallback(() => {
    setSelectedServices(new Map());
    setFormData(initialFormData);
    setSelectedSize(null);
    setShowSuccess(false);
    setValidationErrors([]);
  }, []);

  return {
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
  };
};