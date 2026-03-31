import axios from 'axios';

const api = axios.create({
   baseURL: 'http://127.0.0.1:8000/api', // حط الـ URL ديال Laravel هنا
});

// هاد الكود كيخلي أي طلب (Request) يهز معاه الـ Token يلا كان مخبي فـ Browser
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;