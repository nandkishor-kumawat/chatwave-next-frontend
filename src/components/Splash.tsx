"use client"
import { setCurrentUser } from '@/redux/features/userSlice';
import { useAppDispatch } from '@/redux/store';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import LinearProgressBar from './progress/LinearProgressBar';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/lib/providers/socket-provider';
import useChat from '@/hooks/useChat';

const Splash = () => {

    const dispatch = useAppDispatch();

    useChat();



    const [isUser, setIsUser] = useState(false);
    const pathname = usePathname();

    const { data } = useSession();

    const { socket, isConnected } = useSocket();

    // console.log(socket?.id, isConnected)


    useEffect(() => {
        if (data?.user) {
            dispatch(setCurrentUser(data.user));
        }
    }, [data, dispatch])

    const isUser2 = React.useMemo(() => !!data?.user, [data?.user])

    const handleClose = () => setIsUser(true)

    if (pathname === '/login' || pathname === '/signup') return null

    if (!isUser) return <LinearProgressBar onEnd={handleClose} />

    return null
}

export default Splash