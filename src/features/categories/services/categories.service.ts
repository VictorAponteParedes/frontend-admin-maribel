import { httpClient } from '@/lib/httpClient';
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../types/category.types';

export const categoriesService = {
  fetchCategories: async (): Promise<Category[]> => {
    const response = await httpClient.get('/products/categories');
    return response.data.data || [];
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await httpClient.get(`/products/categories/${id}`);
    return response.data.data;
  },

  createCategory: async (input: CreateCategoryInput): Promise<Category> => {
    const response = await httpClient.post('/products/categories', input);
    return response.data.data;
  },

  updateCategory: async (
    id: string,
    input: UpdateCategoryInput
  ): Promise<Category> => {
    const response = await httpClient.patch(`/products/categories/${id}`, input);
    return response.data.data;
  },

  deleteCategory: async (id: string): Promise<{ id: string; deleted: boolean }> => {
    const response = await httpClient.delete(`/products/categories/${id}`);
    return response.data.data;
  },
};
