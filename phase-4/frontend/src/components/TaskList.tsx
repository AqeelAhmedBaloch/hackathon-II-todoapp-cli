import { Task } from '../types';
import GlassTaskCard from './GlassTaskCard';
import { tasksAPI } from '../services/api';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: TaskListProps) {

  const handleUpdate = async (updatedTask: Task) => {
    try {
      await tasksAPI.updateTask(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description || undefined,
        completed: updatedTask.completed, // Toggle completion
        priority: updatedTask.priority,
        category: updatedTask.category,
        due_date: updatedTask.due_date
      });
      onTaskUpdated();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await tasksAPI.deleteTask(id);
      onTaskDeleted();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
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
