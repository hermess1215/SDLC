// src/api/LoginApi.ts
import { publicApi } from './client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export const loginApi = {
  /**
   * 학생 로그인 API 호출
   * @param data 이메일과 비밀번호
   * @returns JWT 액세스 토큰
   */
  studentLogin: async (data: LoginCredentials): Promise<LoginResponse> => {
    const response = await publicApi.post('/api/auth/login/student', {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  /**
   * 선생님 로그인 API 호출
   */
  teacherLogin: async (data: LoginCredentials): Promise<LoginResponse> => {
    const response = await publicApi.post('/api/auth/login/teacher', {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  /**
   * 관리자 로그인 API 호출
   */
  adminLogin: async (data: LoginCredentials): Promise<LoginResponse> => {
    const response = await publicApi.post('/api/auth/login/admin', {
      email: data.email,
      password: data.password,
    });
    return response.data;
  },
};