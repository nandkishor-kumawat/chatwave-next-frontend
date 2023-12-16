"use client"
import { setCurrentUser } from '@/redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { redirect, usePathname, useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import LinearProgressBar from './progress/LinearProgressBar';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/lib/providers/socket-provider';

const Splash = () => {

    const dispatch = useAppDispatch();



    const [isUser, setIsUser] = useState(false);
    const pathname = usePathname();

    const { data } = useSession();

    const { socket, isConnected } = useSocket();

    console.log(socket?.id, isConnected)


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