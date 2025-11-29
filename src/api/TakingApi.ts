// src/api/TakingApi.ts
import { api } from './client';

export interface TakingClassData {
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

export const takingApi = {
  /**
   * 내가 수강 중인 클래스 조회
   * GET /api/classes/taking (예시)
   */
  getMyClasses: async (): Promise<TakingClassData[]> => {
    const response = await api.get('/api/students/me/classes'); 
    return response.data;
  },
};
