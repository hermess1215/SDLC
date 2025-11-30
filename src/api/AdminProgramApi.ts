import { api } from './client';

export interface ProgramData {
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

export interface StudentData {
    studentId: number;
    email: string;
    name: string;
    grade: number;
    classNo: number;
    classNumber: number;
    phoneNumber: string;
}

export const programApi = {
    getPrograms: async (): Promise<ProgramData[]> => {
        const res = await api.get('/api/classes'); // Swagger에서 제공하는 프로그램 조회 엔드포인트
        return res.data;
    },

    getProgramStudents: async (classId: number): Promise<StudentData[]> => {
        const res = await api.get(`/api/classes/${classId}/students`); // 프로그램별 수강생
        return res.data;
    },

    deleteProgram: async (classId: number): Promise<void> => {
        await api.delete(`/api/classes/${classId}`);
    },
};
