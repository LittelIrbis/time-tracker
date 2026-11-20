// Task =========================================
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

export interface UpdateTaskResult {
  operation_result: {
    status: 'Ok' | 'Error' | 'NotFound';
  };
  task: Task | null;
}

// Project ======================================
export interface Project {
  id: number;
  name: string;
  color: string;
  created_at: string;
  default_deadline: string | null;
  description: string | null;
}
export interface CreateProjectPayload {
  name: string;
  description?: string | null;
  color?: string | null;
  default_deadline?: string | null;
}