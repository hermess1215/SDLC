// src/api/signupApi.ts
import { publicApi } from './client';

export const signupApi = {
  studentSignup: async (data: any) => {
    const response = await publicApi.post('/api/auth/signup/student', {
      email: data.email,
      password: data.password,
      name: data.name,
      phoneNumber: data.phoneNumber,
      grade: Number(data.grade),
      classNo: Number(data.classNo),
      classNumber: Number(data.classNumber),
    });
    return response.data;
  },

  teacherSignup: async (data: any) => {
    const response = await publicApi.post('/api/auth/signup/teacher', {
      email: data.email,
      password: data.password,
      name: data.name,
      phoneNumber: data.phoneNumber,
      authCode: data.authCode,  // inviteCode → authCode
    });
    return response.data;
  },

  adminSignup: async (data: any) => {
    const response = await publicApi.post('/api/auth/signup/admin', {
      email: data.email,
      password: data.password,
      name: data.name,
      authCode: data.authCode,  // inviteCode → authCode
    });
    return response.data;
  }
};
