import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Connect to Socket.io with JWT token
    socketRef.current = io('http://localhost:5000', {
      query: { token }
    });

    // Handle connection events
    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    // Handle disconnect
    socketRef.current.on('disconnect', (reason) => {
      console.log('Disconnected from server. Reason:', reason);
    });

    // Handle connection errors
    socketRef.current.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
}; 