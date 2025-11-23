// src/api/signupApi.ts
import { api } from './client';

export const signupApi = {
  studentSignup: async (data: any) => {
    const response = await api.post('/students/register', data);
    return response.data;
  },

  teacherSignup: async (data: any) => {
    const response = await api.post('/teachers/register', data);
    return response.data;
  },
};
