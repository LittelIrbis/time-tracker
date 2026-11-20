import { api } from './client';
import type { 
  Task, 
  CreateTaskPayload, 
  UpdateTaskResult 
} from '../../shared/types/api';

// Получить список задач
export async function getTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks/list');
  return data;
}

// Создать новую задачу (запустить таймер)
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<Task>('/tasks/create', payload);
  return data;
}

// Остановить таймер
export async function stopTask(id: number): Promise<UpdateTaskResult> {
  const { data } = await api.post<UpdateTaskResult>('/tasks/update', {
    id,
    new_end: new Date().toISOString(), // Текущее время в формате ISO (UTC)
  });
  return data;
}