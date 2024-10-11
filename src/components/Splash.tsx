"use client"
import useChat from '@/hooks/useChat';
import { useSocket } from './providers';

const Splash = () => {
    useChat();
    const { socket, isConnected } = useSocket();
    return null
}

export default Splash