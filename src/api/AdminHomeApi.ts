import { api } from './client';

export interface StudentsStats {
    studentId: number;
    email: string;
    name: string;
    grade: number;
    classNo: number;
    classNumber: number;
    phoneNumber: string;
}

export interface TeachersStats {
    teacherId: number;
    email: string;
    name: string;
    phoneNumber: string;
}

export interface ProgramsStats {
  classId: number;
  title: string;
  description: string;
  teacherName: string;
  classLocation: string;
  capacity: number;
  currentCount: number;
  schedules: {
    dayOfWeek: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    startTime: string;
    endTime: string;
  }[];
}

export const adminApi = {
  getStudentsStats: async (): Promise<StudentsStats[]> => {
    const response = await api.get('/api/users/students');
    return response.data;
  },
  getTeachersStats: async (): Promise<TeachersStats[]> => {
    const response = await api.get('/api/users/teachers');
    return response.data;
  },
  getProgramsStats: async (): Promise<ProgramsStats[]> => {
    const response = await api.get('/api/classes');
    return response.data;
  },
};
