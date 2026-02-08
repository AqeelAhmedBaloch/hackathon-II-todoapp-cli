import { useState, FormEvent, ChangeEvent } from 'react';
import { tasksAPI, aiAPI } from '../services/api';
import { TaskCreate } from '../types';

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
    due_date: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
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
      await tasksAPI.createTask(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        due_date: ''
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggest = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a title for AI to suggest details');
      return;
    }

    try {
      setAiLoading(true);
      setError('');
      const response = await aiAPI.suggest(formData.title);
      const { category, priority } = response.data;
      setFormData((prev: TaskCreate) => ({
        ...prev,
        category: category || prev.category,
        priority: (priority?.toLowerCase() as any) || prev.priority
      }));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'AI suggestion failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-slate-900/60 p-6 rounded-lg border border-white/10 shadow-xl backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 font-tech">Create New Task</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-950/30 border border-red-500/30 rounded-md">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* AI Quick Add Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-violet-950/30 to-fuchsia-950/30 rounded-lg border border-violet-500/20">
        <label htmlFor="ai-quick-add" className="block text-sm font-medium text-violet-300 mb-2 font-tech">
          ✨ Quick Add with AI
        </label>
        <div className="flex gap-2">
          {/* Note: Simplified AI implementation for Phase 4 to match Phase 5 styling but keep logic simple */}
          <div className="text-xs text-slate-400 italic">
            (Use the Magic button below to enhance your task details)
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="flex-1 px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200 placeholder-slate-600"
                placeholder="Enter task title"
                required
              />
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={aiLoading}
                className="px-3 py-2 bg-violet-900/50 text-violet-300 border border-violet-500/30 rounded-md hover:bg-violet-800/50 text-sm font-medium flex items-center transition-colors shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                title="AI Suggest"
              >
                {aiLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-violet-300"></div>
                ) : (
                  <>
                    <span className="mr-1">✨</span>
                    Magic
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200 placeholder-slate-600"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-400 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-slate-400 mb-1">
                Due Date
              </label>
              <input
                id="due_date"
                name="due_date"
                type="datetime-local"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200 color-scheme-dark"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-400 mb-1">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-200 placeholder-slate-600"
              placeholder="e.g. Work, Personal, Shopping"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-md hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all shadow-lg"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700 border border-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
