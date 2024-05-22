import { useEffect } from 'react';
import { io } from 'socket.io-client';

const useSocket = (eventHandlers) => {
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket'],
    });

    console.log('Attempting to connect to WebSocket server at', socketUrl);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      socket.disconnect();
    };
  }, [eventHandlers]);
};

export default useSocket;