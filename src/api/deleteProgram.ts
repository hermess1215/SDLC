import { api } from './client';

export const deleteProgram = async (classId: number) => {
  const res = await api.delete(`/api/classes/${classId}`);
  return res.data;
};
