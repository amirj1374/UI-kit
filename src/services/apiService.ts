/**
 * API Service for making CRUD operations
 * 
 * This service provides a simple interface for common API operations.
 * It works with any axios-compatible instance.
 */
import type { AxiosInstance } from 'axios';

export interface ApiService {
  fetch(params?: Record<string, any>): Promise<any>;
  create(data: any): Promise<any>;
  update(data: any): Promise<any>;
  delete(id: string | number): Promise<any>;
  get(id: string | number): Promise<any>;
}

/**
 * Creates an API service instance for a given resource
 * @param axiosInst - Axios instance to use (defaults to library's configured instance)
 * @param resource - API resource path (e.g., '/api/users')
 */
export default function apiService(
  axiosInst: AxiosInstance,
  resource: string
): ApiService {
  const baseUrl = resource.startsWith('/') ? resource : `/${resource}`;

  return {
    async fetch(params: Record<string, any> = {}) {
      const response = await axiosInst.get(baseUrl, { params });
      return response;
    },

    async create(data: any) {
      const response = await axiosInst.post(baseUrl, data);
      return response;
    },

    async update(data: any) {
      // Sends full payload (including id if needed by backend) in the body
      const response = await axiosInst.put(baseUrl, data);
      return response;
    },

    async delete(id: string | number) {
      const response = await axiosInst.delete(`${baseUrl}/${id}`);
      return response;
    },

    async get(id: string | number) {
      const response = await axiosInst.get(`${baseUrl}/${id}`);
      return response;
    }
  };
}

