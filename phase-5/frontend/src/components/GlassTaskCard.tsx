import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Tag, Trash2 } from 'lucide-react';
import { Task } from '../types';
import clsx from 'clsx';

interface TaskCardProps {
    task: Task;
    onUpdate: (task: Task) => void;
    onDelete: (id: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
    const priorityColors = {
        low: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
        medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/20',
        high: 'text-red-400 border-red-500/30 bg-red-950/20',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)' }}
            className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 rounded-xl p-5 transition-all duration-300"
        >
            {/* Selection Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative flex items-start gap-4">
                <button
                    onClick={() => onUpdate({ ...task, completed: !task.completed })}
                    className={clsx(
                        "mt-1 rounded-full transition-all duration-300 hover:scale-110",
                        task.completed ? "text-cyan-400" : "text-slate-600 hover:text-cyan-400"
                    )}
                >
                    {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    ) : (
                        <Circle className="w-6 h-6" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <h3 className={clsx(
                        "text-lg font-medium transition-all",
                        task.completed ? "text-slate-500 line-through" : "text-slate-200"
                    )}>
                        {task.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 mb-3 line-clamp-2">
                        {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                        <span className={clsx(
                            "px-2 py-1 rounded border capitalize",
                            priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium
                        )}>
                            {task.priority}
                        </span>

                        {task.due_date && (
                            <span className="flex items-center text-slate-400 bg-slate-800/50 px-2 py-1 rounded border border-white/5">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(task.due_date).toLocaleDateString()}
                            </span>
                        )}

                        {task.category && (
                            <span className="flex items-center text-violet-300 bg-violet-950/20 px-2 py-1 rounded border border-violet-500/20">
                                <Tag className="w-3 h-3 mr-1" />
                                {task.category}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => onDelete(task.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors p-2 hover:bg-red-950/30 rounded-lg opacity-0 group-hover:opacity-100"
                    title="Delete Task"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

export default TaskCard;
