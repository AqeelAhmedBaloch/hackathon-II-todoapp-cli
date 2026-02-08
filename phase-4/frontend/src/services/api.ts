/**
 * API service for backend communication with TypeScript types
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, UserCreate, UserLogin, Task, TaskCreate, TaskUpdate, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: UserCreate): Promise<AxiosResponse<AuthResponse>> =>
    api.post<AuthResponse>('/api/auth/register', data),

  login: (data: UserLogin): Promise<AxiosResponse<AuthResponse>> =>
    api.post<AuthResponse>('/api/auth/login', data),

  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get<User>('/api/auth/me'),
};

// Tasks API
export const tasksAPI = {
  getTasks: (completed?: boolean): Promise<AxiosResponse<Task[]>> => {
    const params = completed !== undefined ? { completed } : {};
    return api.get<Task[]>('/api/tasks', { params });
  },

  getTask: (id: number): Promise<AxiosResponse<Task>> =>
    api.get<Task>(`/api/tasks/${id}`),

  createTask: (data: TaskCreate): Promise<AxiosResponse<Task>> =>
    api.post<Task>('/api/tasks', data),

  updateTask: (id: number, data: TaskUpdate): Promise<AxiosResponse<Task>> =>
    api.put<Task>(`/api/tasks/${id}`, data),

  deleteTask: (id: number): Promise<AxiosResponse<void>> =>
    api.delete<void>(`/api/tasks/${id}`),

  toggleTask: (id: number): Promise<AxiosResponse<Task>> =>
    api.patch<Task>(`/api/tasks/${id}/toggle`),
};

// AI API
export const aiAPI = {
  suggest: (title: string): Promise<AxiosResponse<{ category: string, priority: string }>> =>
    api.post('/api/ai/suggest', { title }),
};

export default api;
