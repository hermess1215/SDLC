// client.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://222.110.147.56:8088/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: JWT 자동 포함
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // 또는 sessionStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
