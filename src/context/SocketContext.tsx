import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  onlineCount: number;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(142); // live active players baseline
  const { user } = useAuth();

  useEffect(() => {
    // Connect to server (environment variable, localhost:3001, or window origin)
    const socketUrl = ((import.meta as any).env?.VITE_SERVER_URL as string) || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      auth: {
        userId: user?.id,
        username: user?.username,
      },
    });

    newSocket.on('connect', () => {
      setConnected(true);
      if (user) {
        newSocket.emit('USER_ONLINE', {
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
        });
      }
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('ONLINE_COUNT_UPDATE', (count: number) => {
      setOnlineCount(count);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id, user?.username, user?.avatar]);

  return (
    <SocketContext.Provider value={{ socket, connected, onlineCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

