import api from './client';
import type { ApiResponse, Customer } from './types';

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export const getCustomers = async (): Promise<ApiResponse<Customer[]>> => {
  const response = await api.get<ApiResponse<Customer[]>>('/customers');
  return response.data;
};

export const getCustomerById = async (
  id: number,
): Promise<ApiResponse<Customer>> => {
  const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (
  payload: CreateCustomerDto,
): Promise<ApiResponse<Customer>> => {
  const response = await api.post<ApiResponse<Customer>>('/customers', payload);
  return response.data;
};
