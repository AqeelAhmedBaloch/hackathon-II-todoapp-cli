import { useState } from 'react';
import { calendarAPI } from '../services/api';

export default function CalendarSync() {
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        try {
            setLoading(true);
            const response = await calendarAPI.connect();
            // Redirect to Google OAuth URL
            window.location.href = response.data.auth_url;
        } catch (error: any) {
            console.error("Failed to get auth URL:", error);
            const message = error.response?.data?.detail || "Failed to connect to Google Calendar. Please check server configuration.";
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleConnect}
            disabled={loading}
            className={`group relative px-6 py-2.5 rounded-lg font-bold text-white transition-all transform hover:-translate-y-0.5 overflow-hidden shadow-lg ${loading
                    ? 'bg-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/30 hover:shadow-blue-500/50'
                } flex items-center space-x-3 border border-white/10`}
        >
            <div className={`absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${loading ? 'hidden' : ''}`}></div>

            <div className="relative flex items-center space-x-2">
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <svg className="w-5 h-5 filter drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 4h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
                    </svg>
                )}
                <span>{loading ? 'Connecting...' : 'Connect Google Calendar'}</span>
            </div>
        </button>
    );
}
