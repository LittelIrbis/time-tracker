import { api } from './client';
import type {
    Project,
    CreateProjectPayload
} from '../../shared/types/api';

// Получить список проектов
export async function getProjects(): Promise<Project[]> {
  const { data } = await api.get<Project[]>('/projects/list');
  return data;
}

// Создать проект
export async function createProject(payload: CreateProjectPayload): Promise<Project> {
  const { data } = await api.post<Project>('/projects/create', payload);
  return data;
}
