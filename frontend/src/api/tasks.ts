import { apiClient } from './client';

export const tasksApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  }
};
