/**
 * TypeScript type definitions for the application
 */

// User types
export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Task types
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  due_date?: string;
  owner_id: number;
  workspace_id?: number | null;
  parent_id?: number | null;
  created_at: string;
  updated_at: string | null;
  subtasks: Task[];
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  due_date?: string;
  workspace_id?: number | null;
  parent_id?: number | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  due_date?: string;
}

// API Response types
export interface ApiError {
  detail: string;
}

// Filter types
export type TaskFilter = 'all' | 'pending' | 'completed';
