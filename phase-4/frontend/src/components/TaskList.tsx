import { Task } from '../types';
import GlassTaskCard from './GlassTaskCard';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: number) => void;
}

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {

  const handleUpdate = (updatedTask: Task) => {
    onTaskUpdated(updatedTask);
  };

  const handleDelete = (id: number) => {
    onTaskDeleted(id);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {tasks.map((task) => (
        <GlassTaskCard
          key={task.id}
          task={task}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
