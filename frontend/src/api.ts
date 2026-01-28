import axios from 'axios';
import { CalculationInput, CalculationResponse } from './types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calculateBlackScholes = async (
  input: CalculationInput
): Promise<CalculationResponse> => {
  const response = await api.post<CalculationResponse>('/calculate', input);
  return response.data;
};

export const getCalculationHistory = async (): Promise<CalculationResponse[]> => {
  const response = await api.get<CalculationResponse[]>('/history');
  return response.data;
};

export const deleteCalculation = async (id: number): Promise<void> => {
  await api.delete(`/history/${id}`);
};
