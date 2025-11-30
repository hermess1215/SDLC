// TeacherApi.ts
import { api } from './client';

export interface Classes {
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

export const teacherApi = {
  // 2️⃣ 모든 수업 가져오기
  getAllClasses: async (): Promise<Classes[]> => {
    const response = await api.get('/api/teachers/me/classes');
    return response.data;
  },
};
