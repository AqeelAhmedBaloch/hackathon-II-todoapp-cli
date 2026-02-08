import { useState, useEffect } from 'react';

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
                className="relative p-2 text-gray-500 hover:text-indigo-600 focus:outline-none"
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
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Notifications</span>
                        <button onClick={onClear} className="text-xs text-indigo-600 hover:text-indigo-800">Clear all</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="px-4 py-6 text-center text-gray-500 italic">No notifications</div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-50 ${!msg.read ? 'bg-indigo-50/30' : ''}`}>
                                    <p className="text-sm text-gray-800">
                                        <span className="font-medium">{msg.type.replace('_', ' ')}</span>: {msg.task?.title || `Task ID ${msg.task_id}`}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleTimeString()}</p>
                                </div>
                            )).reverse()
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
