// createProgram.ts
import { api } from './client';
import { CreateProgramRequest, CreateProgramResponse } from './types';

export const createProgram = async (
  data: CreateProgramRequest
): Promise<CreateProgramResponse> => {
  const res = await api.post('/api/classes', data);
  return res.data;
};
