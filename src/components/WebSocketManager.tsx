import { useEffect } from 'react';
import { useWebSocket } from '@/sockets/socket';
import { useAuth } from '@/store/authContext';

export default function WebSocketManager() {
    const { token, isAuthenticated } = useAuth();
    const { connect, disconnect, connectionState } = useWebSocket();

    useEffect(() => {
        if (isAuthenticated && token) {
            // Connect to WebSocket when user is authenticated
            connect().catch(error => {
                console.error('Failed to connect to WebSocket:', error);
            });
        } else {
            // Disconnect when user is not authenticated
            disconnect();
        }

        // Cleanup on unmount
        return () => {
            disconnect();
        };
    }, [isAuthenticated, token, connect, disconnect]);

    // This component doesn't render anything, it just manages the WebSocket connection
    return null;
} 