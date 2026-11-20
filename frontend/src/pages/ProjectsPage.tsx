import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getProjects, createProject } from '../shared/api/projects';

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setName('');
    },
  });

  if (isLoading) return <p>Загрузка...</p>;

  return (
    <div style={{ color: 'var(--color-text-main)' }}>
      <h1>Проекты</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createMutation.mutate({ name: name.trim() });
        }}
        style={{ marginBottom: '1rem' }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название проекта"
        />
        <button type="submit" disabled={createMutation.isPending}>
          Создать
        </button>
      </form>

      <ul>
        {projects.map((project) => (
          <li key={project.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: project.color }} />
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}