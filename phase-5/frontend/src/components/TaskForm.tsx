import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { tasksAPI, aiAPI, workspacesAPI } from '../services/api';
import { TaskCreate } from '../types';

interface TaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  parentId?: number;
}

export default function TaskForm({ onSuccess, onCancel, parentId }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskCreate>({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    due_date: '',
    workspace_id: '',
    parent_id: parentId
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await workspacesAPI.list();
      setWorkspaces(response.data);
    } catch (err) {
      console.error('Failed to fetch workspaces', err);
    }
  };

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* AI Quick Add Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
        <label htmlFor="ai-quick-add" className="block text-sm font-medium text-purple-900 mb-2">
          ✨ Quick Add with AI
        </label>
        <div className="flex gap-2">
          <input
            id="ai-quick-add"
            type="text"
            className="flex-1 px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-purple-300 text-sm"
            placeholder="e.g., 'Meeting with Sarah tomorrow at 2pm about the new project'"
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.currentTarget;
                const text = input.value.trim();
                if (!text) return;

                try {
                  setAiLoading(true);
                  setError('');
                  const response = await aiAPI.parse(text);
                  const { title, description, priority, category, due_date } = response.data;

                  setFormData(prev => ({
                    ...prev,
                    title: title || text,
                    description: description || prev.description,
                    priority: (priority?.toLowerCase() as any) || prev.priority,
                    category: category || prev.category,
                    due_date: due_date || prev.due_date
                  }));

                  // Clear input after successful parse
                  input.value = '';
                } catch (err: any) {
                  setError(err.response?.data?.detail || 'AI parsing failed');
                } finally {
                  setAiLoading(false);
                }
              }
            }}
          />
          <button
            type="button"
            className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm font-medium transition-colors"
            disabled={aiLoading}
            onClick={async () => {
              const input = document.getElementById('ai-quick-add') as HTMLInputElement;
              if (input) {
                const event = new KeyboardEvent('keydown', { key: 'Enter' });
                input.dispatchEvent(event);
                // Trigger the onKeyDown handler manually since dispatchEvent won't trigger React's synthetic event handler directly in this way easily without more complex setup, 
                // so we'll just replicate the logic here for simplicity or extract it.
                // Actually, let's extract the logic to a function to handle both.
                const text = input.value.trim();
                if (!text) return;

                try {
                  setAiLoading(true);
                  setError('');
                  const response = await aiAPI.parse(text);
                  const { title, description, priority, category, due_date } = response.data;

                  setFormData(prev => ({
                    ...prev,
                    title: title || text,
                    description: description || prev.description,
                    priority: (priority?.toLowerCase() as any) || prev.priority,
                    category: category || prev.category,
                    due_date: due_date || prev.due_date
                  }));

                  input.value = '';
                } catch (err: any) {
                  setError(err.response?.data?.detail || 'AI parsing failed');
                } finally {
                  setAiLoading(false);
                }
              }
            }}
          >
            {aiLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-purple-600 mt-1">
          Try: "Buy groceries tomorrow at 5pm" or "Urgent meeting with team about Q4 goals"
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter task title"
                required
              />
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={aiLoading}
                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm font-medium flex items-center transition-colors"
                title="AI Suggest"
              >
                {aiLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700"></div>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Magic
                  </>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="workspace" className="block text-sm font-medium text-gray-700 mb-1">
              Workspace (Optional)
            </label>
            <select
              id="workspace"
              value={formData.workspace_id || ''}
              onChange={(e) => setFormData({ ...formData, workspace_id: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Personal Task (No Workspace)</option>
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange as any}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                id="due_date"
                name="due_date"
                type="datetime-local"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Work, Personal, Shopping"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onCancel}
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
