export type Role = 'SALES' | 'OPERATIONS' | 'MANAGER' | 'DRIVER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  currentDriver?: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface Delivery {
  id: string;
  customerId: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  driverId?: string;
  vehicleId?: string;
  scheduledDate: string;
  completedDate?: string;
  podImage?: string;
  signature?: string;
  notes?: string;
}

export interface Route {
  id: string;
  driverId: string;
  vehicleId: string;
  date: string;
  stops: Array<{
    deliveryId: string;
    order: number;
    estimatedTime: string;
  }>;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
}