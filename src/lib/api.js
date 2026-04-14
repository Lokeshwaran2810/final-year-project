import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
};

export const fetchPatients = async () => {
    const response = await api.get('/patients');
    return response.data;
};

export const createPatient = async (data) => {
    const response = await api.post('/patients', data);
    return response.data;
};

export const updatePatient = async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
};

export const deletePatient = async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
};

export default api;
