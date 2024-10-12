'use client';
import { useSession } from '@/hooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { session } = useSession();
  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      '/',
      {
        path: '/api/socket/io',
        addTrailingSlash: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      }
    );
    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', (reason: string) => {
      setIsConnected(false);
      console.log('Socket disconnected:', reason);
    });

    socketInstance.on('reconnect_attempt', (attempt: number) => {
      console.log(`Reconnect attempt #${attempt}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);


  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};