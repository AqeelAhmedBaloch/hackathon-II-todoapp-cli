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
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
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

  parse: (text: string): Promise<AxiosResponse<{ title: string, description?: string, priority?: string, category?: string, due_date?: string }>> =>
    api.post('/api/ai/parse', { text }),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (): Promise<AxiosResponse<{
    summary: { total: number, completed: number, pending: number, rate: number },
    by_priority: { name: string, value: number }[],
    by_category: { name: string, value: number }[]
  }>> =>
    api.get('/api/analytics/dashboard'),
};

// Workspaces API
export const workspacesAPI = {
  create: (data: { name: string, description?: string }) =>
    api.post('/api/workspaces/', data),

  list: () =>
    api.get('/api/workspaces/'),

  get: (id: number) =>
    api.get(`/api/workspaces/${id}`),
};

// Calendar API
export const calendarAPI = {
  connect: (): Promise<AxiosResponse<{ auth_url: string }>> =>
    api.get('/api/calendar/connect'),

  callback: (code: string): Promise<AxiosResponse<{ message: string }>> =>
    api.get(`/api/calendar/callback?code=${code}`),

  syncTask: (taskId: number): Promise<AxiosResponse<{ message: string }>> =>
    api.post(`/api/calendar/sync/${taskId}`),
};

export default api;
