import { useState, FormEvent, ChangeEvent } from 'react';
import { tasksAPI } from '../services/api';
import { TaskCreate } from '../types';
import { Layout, Calendar, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskCreate>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    due_date: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      // Clean data: convert empty strings to null for optional fields
      const dataToSend = {
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority || 'medium',
        category: formData.category || undefined,
        due_date: formData.due_date || undefined,
        workspace_id: formData.workspace_id || undefined,
        parent_id: formData.parent_id || undefined,
      };
      await tasksAPI.createTask(dataToSend);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Problem creating task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cyan-500/80 mb-1 uppercase tracking-wider">Task Title</label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600"
              placeholder="What needs to be done?"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cyan-500/80 mb-1 uppercase tracking-wider">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600 h-32"
              placeholder="Add some details..."
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-cyan-500/80 mb-1 uppercase tracking-wider">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 text-slate-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-cyan-500/80 mb-1 uppercase tracking-wider">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  name="due_date"
                  type="date"
                  value={formData.due_date || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 text-slate-200"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-cyan-500/80 mb-1 uppercase tracking-wider">Category</label>
            <div className="relative">
              <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-lg focus:ring-1 focus:ring-cyan-500 text-slate-200 placeholder-slate-600"
                placeholder="Work, Personal, etc."
              />
            </div>
          </div>

          <div className="pt-4 flex items-end justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-950/20 p-3 rounded-lg border border-red-500/20">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
