export interface Task {
  id: number;
  name: string;
  start: string;
  end: string | null;
}

export interface CreateTaskPayload {
  name: string;
  start: string;
  end: string | null;
}