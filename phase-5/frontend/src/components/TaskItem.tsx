import { useState, FormEvent, ChangeEvent } from 'react';
import { tasksAPI } from '../services/api';
import { Task, TaskUpdate } from '../types';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState<boolean>(false);
  const [editData, setEditData] = useState<TaskUpdate>({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    category: task.category || '',
    due_date: task.due_date || '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggle = async () => {
    try {
      setLoading(true);
      await tasksAPI.toggleTask(task.id);
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to toggle task:', error);
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await tasksAPI.updateTask(task.id, editData);
      setIsEditing(false);
      onTaskUpdated();
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      setLoading(true);
      await tasksAPI.deleteTask(task.id);
      onTaskDeleted();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleUpdate}>
          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Task title"
              required
            />
            <textarea
              name="description"
              value={editData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Task description"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                name="priority"
                value={editData.priority}
                onChange={handleInputChange as any}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="datetime-local"
                name="due_date"
                value={editData.due_date}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <input
              type="text"
              name="category"
              value={editData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Category"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={loading}
          className="mt-1 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3
              className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}
            >
              {task.title}
            </h3>
            {task.priority && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                {task.priority}
              </span>
            )}
            {task.category && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                {task.category}
              </span>
            )}
            {task.workspace && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 border border-purple-200">
                {task.workspace.name}
              </span>
            )}
          </div>
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          {task.due_date && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              Due: {new Date(task.due_date).toLocaleString()}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Created: {new Date(task.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
          <button
            onClick={() => setShowSubtaskForm(!showSubtaskForm)}
            className="px-3 py-1 text-sm text-green-600 hover:text-green-800"
          >
            {showSubtaskForm ? 'Cancel' : '+ Subtask'}
          </button>
        </div>
      </div>

      {showSubtaskForm && (
        <div className="mt-4 ml-8">
          <TaskForm
            parentId={task.id}
            onSuccess={() => {
              setShowSubtaskForm(false);
              onTaskUpdated();
            }}
            onCancel={() => setShowSubtaskForm(false)}
          />
        </div>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-4 ml-8 space-y-4 border-l-2 border-gray-100 pl-4">
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
