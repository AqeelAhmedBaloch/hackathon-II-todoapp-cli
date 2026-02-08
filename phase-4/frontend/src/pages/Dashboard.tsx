import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { getAuthData } from '../utils/auth';
import { Task, TaskFilter } from '../types';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { useWebSocket } from '../hooks/useWebSocket';
import NotificationBell from '../components/NotificationBell';
import GlassSidebar from '../components/GlassSidebar';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [notificationMessages, setNotificationMessages] = useState<any[]>([]);
  // const navigate = useNavigate(); // Unused
  const { user } = getAuthData();

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const { messages } = useWebSocket(user?.id || null);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      console.log('Real-time update received:', lastMessage);
      setNotificationMessages(prev => [...prev, { ...lastMessage, read: false }]);
      fetchTasks();
    }
  }, [messages]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const completedFilter = filter === 'all' ? undefined : filter === 'completed';
      const response = await tasksAPI.getTasks(completedFilter);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    setShowForm(false);
    fetchTasks();
  };

  const handleTaskUpdated = async (task: Task) => {
    try {
      await tasksAPI.toggleTask(task.id);
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleTaskDeleted = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
    tasksAPI.deleteTask(id).catch(fetchTasks);
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      <GlassSidebar />

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen transition-all duration-300">

        {/* Top Bar */}
        <header className="glass-panel sticky top-0 z-40 border-b border-white/5 px-8 py-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 font-sans">
                Phase 4 Dashboard
              </h1>
              <p className="text-sm text-slate-500">Welcome, {user?.full_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell
                messages={notificationMessages}
                onClear={() => setNotificationMessages(prev => prev.map(m => ({ ...m, read: true })))}
              />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-16 h-16 bg-indigo-500 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Tasks</h3>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-16 h-16 bg-emerald-500 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Completed</h3>
              <p className="text-3xl font-bold text-emerald-400 mt-2">{stats.completed}</p>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-16 h-16 bg-amber-500 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Pending</h3>
              <p className="text-3xl font-bold text-amber-400 mt-2">{stats.pending}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-900/50 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="flex space-x-1 mb-4 md:mb-0">
              {['all', 'pending', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as TaskFilter)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${filter === f
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-bold shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] transition-all"
            >
              {showForm ? 'Cancel' : '+ New Task'}
            </button>
          </div>

          {/* Task Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <TaskForm onSuccess={handleTaskCreated} onCancel={() => setShowForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Task List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20"></div>
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-spin"></div>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass-panel rounded-xl border border-white/10 p-16 text-center">
              <p className="text-slate-500 text-lg">No tasks found</p>
              <p className="text-slate-600 mt-2">Create your first task to get started!</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          )}
        </main>
      </div>
    </div>
  );
}
