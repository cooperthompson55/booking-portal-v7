export type PropertySize = '<1000' | '1000-2000' | '2000-3000' | '3000-4000' | '4000-5000';

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface PropertyAddress {
  street: string;
  street2: string;
  city: string;
  province: string;
  zipCode: string;
}

export interface AgentInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export interface OrderFormData {
  address: PropertyAddress;
  occupancyStatus: 'Vacant' | 'Occupied' | 'Tenanted' | 'Other';
  preferredDate: string;
  propertyNotes: string;
  agent: AgentInfo;
}