// src/api/ProgramApi.ts
import { api } from './client'; // JWT 토큰이 포함된 api 인스턴스 사용

// API 응답 데이터 구조 (image_dae683.png 기반)
export interface ProgramApiData {
  classId: number;
  title: string;
  description: string;
  teacherName: string;
  classLocation: string;
  capacity: number;
  currentCount: number;
  schedules: {
    dayOfWeek: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    startTime: string; // 예: "15:00"
    endTime: string; // 예: "16:30"
  }[];
}

export const programApi = {
  /**
   * 전체 프로그램 목록을 가져오는 API
   */
  getPrograms: async (): Promise<ProgramApiData[]> => {
    // GET /api/classes 엔드포인트 호출
    const response = await api.get('/api/classes');
    return response.data;
  },
  
  /**
   * 🔥 수강신청
   * POST /api/classes/{classId}/enroll
   * body 없음 (Swagger 기준)
   */
  enroll: async (classId: number): Promise<any> => {
    const response = await api.post(`/api/classes/${classId}/enroll`);
    return response.data; 
  },
};