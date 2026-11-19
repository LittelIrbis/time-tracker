import { api } from './client';
import type { 
  Task, 
  CreateTaskPayload, 
  UpdateTaskResult 
} from '../../shared/types/api';

// 1. Получить список всех задач
export async function getTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks/list');
  return data;
}

// 2. Создать новую задачу (запустить таймер)
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<Task>('/tasks/create', payload);
  return data;
}

// 3. Остановить таймер (обновить поле end)
export async function stopTask(id: number): Promise<UpdateTaskResult> {
  const { data } = await api.post<UpdateTaskResult>('/tasks/update', {
    id,
    new_end: new Date().toISOString(), // Текущее время в формате ISO (UTC)
  });
  return data;
}