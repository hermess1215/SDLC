// client.ts
import axios from 'axios';

// 1. 일반 API (토큰 인터셉터 있음)
export const api = axios.create({
    baseURL: 'http://222.110.147.56:8088',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: JWT 자동 포함
// client.ts (수정 제안)

// 요청 인터셉터: JWT 자동 포함
api.interceptors.request.use(
  (config) => {
    // 1. localStorage에서 토큰 가져오기
    const token = localStorage.getItem('accessToken'); 
    
    // 2. 토큰이 존재하면 Authorization 헤더에 Bearer 토큰 형식으로 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. 수정된 config 반환
    return config;
  },
  (error) => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);


// 2. 공개용 API (토큰 인터셉터 없음)
export const publicApi = axios.create({
    baseURL: 'http://222.110.147.56:8088',
    headers: {
        'Content-Type': 'application/json',
    },
});