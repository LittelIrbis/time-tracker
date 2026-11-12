import { api } from './client';
import type { Task, CreateTaskPayload } from '../types/api';

export async function getTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks/list');
  return data;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<Task>('/tasks/create', payload);
  return data;
}
