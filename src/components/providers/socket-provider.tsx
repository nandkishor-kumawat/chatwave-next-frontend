'use client';
import { useSession } from '@/hooks';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FireSocket from 'firebase.io';

type SocketContextType = {
  socket: FireSocket;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null as any,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<FireSocket>(null as any);
  const [isConnected, setIsConnected] = useState(false);
  const { session } = useSession();
  const searchParams = new URLSearchParams(useSearchParams() as any);
  const room = searchParams.get('room') || 'default';


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
    const socketInstance = new FireSocket(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!);
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

  useEffect(() => {
    if (session && socket) {
      socket.mapId(session.userId);
    }
  }, [room, socket, session]);


  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};