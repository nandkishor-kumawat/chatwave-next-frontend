'use client';
import { useSession } from '@/hooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';
import Fsocket from '../../../firebase-socket';

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
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { session } = useSession();



  useEffect(() => {
    // const socketInstance = new (ClientIO as any)(
    //   '/',
    //   {
    //     path: '/api/socket/io',
    //     addTrailingSlash: false,
    //     reconnection: true,
    //     reconnectionAttempts: 5,
    //     reconnectionDelay: 1000,
    //     reconnectionDelayMax: 5000,
    //     timeout: 20000,
    //   }
    // );
    const socketInstance = new Fsocket();
    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason: string) => {
      setIsConnected(false);
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