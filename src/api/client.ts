// client.ts
import axios, { AxiosRequestHeaders } from 'axios';

// 1. 일반 API (토큰 인터셉터 있음)
export const api = axios.create({
    baseURL: 'http://222.110.147.56:8088',
});

// 요청 인터셉터: JWT 자동 포함
// client.ts (수정 제안)

// 요청 인터셉터: JWT 자동 포함
// client.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('JWT 헤더 포함 확인 (client.ts):', config.headers.Authorization);
  return config;
});



// 2. 공개용 API (토큰 인터셉터 없음)
export const publicApi = axios.create({
    baseURL: 'http://222.110.147.56:8088',
    headers: {
        'Content-Type': 'application/json',
    },
});