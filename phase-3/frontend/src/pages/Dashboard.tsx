import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { getAuthData } from '../utils/auth';
import { Task, TaskFilter } from '../types';
import TaskForm from '../components/TaskForm';
import { useWebSocket } from '../hooks/useWebSocket';
import NotificationBell from '../components/NotificationBell';
import GlassTaskCard from '../components/GlassTaskCard';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [notificationMessages, setNotificationMessages] = useState<any[]>([]);
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
    <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden">
      {/* Background Aura Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Area */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 font-sans">
              Phase 3 Sync
            </h2>
            <p className="text-sm text-slate-500">Real-time updates active for {user?.full_name}</p>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell
              messages={notificationMessages}
              onClear={() => setNotificationMessages(prev => prev.map(m => ({ ...m, read: true })))}
            />
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Tasks</h3>
            <p className="text-4xl font-bold text-white mt-2 group-hover:scale-105 transition-transform">{stats.total}</p>
            <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-cyan-500 w-2/3 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed</h3>
            <p className="text-4xl font-bold text-emerald-400 mt-2 group-hover:scale-105 transition-transform">{stats.completed}</p>
            <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/10 relative overflow-hidden group">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending</h3>
            <p className="text-4xl font-bold text-amber-400 mt-2 group-hover:scale-105 transition-transform">{stats.pending}</p>
            <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-amber-500 w-1/2 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-8 bg-slate-900/50 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
          <div className="flex space-x-1">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as TaskFilter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/40 text-slate-400 hover:text-slate-200'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-1 transition-all"
          >
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {/* Forms Area */}
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

        {/* Tasks Grid with Empty State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
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
              Your real-time sync list is empty. Add a task to see it reflect across your instances!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-8 px-6 py-2 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors"
            >
              Start Syncing
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
