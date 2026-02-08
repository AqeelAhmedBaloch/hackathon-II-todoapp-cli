import { useState } from 'react';

interface NotificationBellProps {
    messages: any[];
    onClear: () => void;
}

export default function NotificationBell({ messages, onClear }: NotificationBellProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setShowDropdown(!showDropdown);
                    if (showDropdown) onClear();
                }}
                className="relative p-2 text-slate-400 hover:text-cyan-400 focus:outline-none transition-colors"
                title="Notifications"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-2xl py-2 z-50 border border-white/10">
                    <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                        <span className="font-semibold text-slate-200">Notifications</span>
                        <button onClick={onClear} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="px-4 py-8 text-center text-slate-500 italic">No notifications</div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} className={`px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors ${!msg.read ? 'bg-cyan-950/20' : ''}`}>
                                    <p className="text-sm text-slate-300">
                                        <span className="font-medium text-cyan-400">{msg.type?.replace('_', ' ') || 'Notification'}</span>: {msg.task?.title || `Task ID ${msg.task_id}`}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">{new Date().toLocaleTimeString()}</p>
                                </div>
                            )).reverse()
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
