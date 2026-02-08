import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import { clearAuthData, getAuthData } from '../utils/auth';
import { Task, TaskFilter } from '../types';
// import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import CalendarSync from '../components/CalendarSync';
import { useWebSocket } from '../hooks/useWebSocket';
import NotificationBell from '../components/NotificationBell';
import GlassSidebar from '../components/GlassSidebar';
import GlassTaskCard from '../components/GlassTaskCard';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [notificationMessages, setNotificationMessages] = useState<any[]>([]);
  const navigate = useNavigate();
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

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleTaskCreated = () => {
    setShowForm(false);
    fetchTasks();
  };

  const handleTaskUpdated = () => {
    fetchTasks();
  };

  const handleTaskDeleted = () => {
    fetchTasks();
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <GlassSidebar />

      {/* Main Content Area - Shifted for Sidebar */}
      <div className="md:ml-64 min-h-screen transition-all duration-300">

        {/* Top Bar */}
        <header className="glass-panel sticky top-0 z-40 border-b border-white/5 px-8 py-4 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 font-sans">
                Dashboard
              </h2>
              <p className="text-sm text-slate-500">Welcome back, {user?.full_name}</p>
            </div>

            <div className="flex items-center space-x-6">
              <NotificationBell
                messages={notificationMessages}
                onClear={() => setNotificationMessages(prev => prev.map(m => ({ ...m, read: true })))}
              />
              <CalendarSync />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-16 h-16 bg-indigo-500 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Tasks</h3>
              <p className="text-4xl font-bold text-white mt-2 group-hover:scale-105 transition-transform">{stats.total}</p>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-indigo-500 w-2/3 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-16 h-16 bg-emerald-500 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Completed</h3>
              <p className="text-4xl font-bold text-emerald-400 mt-2 group-hover:scale-105 transition-transform">{stats.completed}</p>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-16 h-16 bg-amber-500 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Pending</h3>
              <p className="text-4xl font-bold text-amber-400 mt-2 group-hover:scale-105 transition-transform">{stats.pending}</p>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-amber-500 w-1/2 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-900/50 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="flex space-x-1 mb-4 md:mb-0 w-full md:w-auto overflow-x-auto">
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
              className="group relative w-full md:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-bold shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] transition-all transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></div>
              <span className="relative flex items-center justify-center space-x-2">
                {showForm ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    <span>New Task</span>
                  </>
                )}
              </span>
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
                <div className="glass-panel p-6 rounded-xl border border-white/10">
                  <TaskForm onSuccess={handleTaskCreated} onCancel={() => setShowForm(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Task List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20"></div>
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-cyan-500 animate-pulse">
                  LOADING
                </div>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass-panel rounded-xl border border-white/10 p-16 text-center">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <p className="text-xl font-medium text-slate-300">No tasks found</p>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                Your workspace is currently empty. Initialize a new task to begin tracking your progress.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-8 px-6 py-2 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors"
              >
                Create First Task
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {tasks.map((task) => (
                  <GlassTaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleTaskUpdated}
                    onDelete={handleTaskDeleted}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
