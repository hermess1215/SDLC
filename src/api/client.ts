import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://222.110.147.56:8088/',
    headers: {
        'Content-Type': 'application/json',
    },
});