// src/api/updateProgram.ts
import { api } from './client'; // JWT 포함 axios 인스턴스

export interface UpdateProgramPayload {
  title: string;
  description: string;
  capacity: number;
  classLocation: string;
  schedules: {
    dayOfWeek: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
    startTime: string;
    endTime: string;
  }[];
}

/**
 * 프로그램 수정 API
 * @param classId 수정할 프로그램 ID
 * @param payload 수정할 데이터
 */
export const updateProgram = async (classId: string | number, payload: UpdateProgramPayload) => {
  try {
    const response = await api.put(`/api/classes/${classId}`, payload);
    return response.data;
  } catch (err) {
    console.error('프로그램 수정 실패:', err);
    throw err;
  }
};
