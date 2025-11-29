// AdminUsersApi.ts
import { api } from './client';

export interface StudentData {
  studentId: number;
  email: string;
  name: string;
  grade: number;
  classNo: number;
  classNumber: number;
  phoneNumber: string;
}

export interface TeacherData {
  teacherId: number;
  email: string;
  name: string;
  phoneNumber: string;
}

export const usersApi = {
  getStudents: async (): Promise<StudentData[]> => {
    const res = await api.get('/api/users/students');
    return res.data;
  },

  getTeachers: async (): Promise<TeacherData[]> => {
    const res = await api.get('/api/users/teachers');
    return res.data;
  },
};
