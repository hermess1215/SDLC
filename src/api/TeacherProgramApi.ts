// ProgramApi.ts
import { api } from './client';

// TeacherPrograms.tsx에서 사용하는 Program 타입
export interface Program {
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

// 새 프로그램 생성 요청 바디 타입
export interface CreateProgramRequest {
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

// 서버가 반환하는 응답 타입(필요하면 수정 가능)
export interface CreateProgramResponse extends Program {}

// 실제 Swagger API 연동
export const programApi = {
  // 프로그램 생성
  createProgram: async (data: CreateProgramRequest): Promise<CreateProgramResponse> => {
    const res = await api.post('/api/classes', data);
    return res.data;
  },

  // 프로그램 목록 조회(TeacherDashboard에서 필요할 가능성이 높음)
  getPrograms: async (): Promise<Program[]> => {
    const res = await api.get('/api/teachers/me/classes');
    return res.data;
  },
};
