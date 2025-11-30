// getPrograms.ts
import { api } from './client';
import { Program, Student } from './types';

// 프로그램 목록 조회
export const getPrograms = async (): Promise<Program[]> => {
  const res = await api.get('/api/teachers/me/classes');
  return res.data;
};

// 특정 프로그램(classId)의 학생 목록 조회
export const getStudentsByProgram = async (classId: number): Promise<Student[]> => {
  const res = await api.get(`/api/classes/${classId}/students`);
  return res.data;
};
