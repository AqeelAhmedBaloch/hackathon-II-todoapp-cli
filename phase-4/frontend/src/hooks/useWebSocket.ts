import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketMessage {
    type: string;
    task?: any;
    task_id?: number;
}

export const useWebSocket = (userId: number | null) => {
    const [messages, setMessages] = useState<WebSocketMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
        if (!userId) return;

        const wsUrl = import.meta.env.VITE_WS_URL
            ? `${import.meta.env.VITE_WS_URL}/ws/${userId}`
            : (() => {
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const host = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
                return `${protocol}//${host}/ws/${userId}`;
            })();

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            const message: WebSocketMessage = JSON.parse(event.data);
            console.log('WebSocket Message Received:', message);
            setMessages((prev) => [...prev, message]);
        };

        ws.current.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
            // Attempt to reconnect after 3 seconds
            setTimeout(connect, 3000);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Error:', error);
            ws.current?.close();
        };
    }, [userId]);

    useEffect(() => {
        connect();
        return () => {
            ws.current?.close();
        };
    }, [connect]);

    return { messages, isConnected, setMessages };
};
