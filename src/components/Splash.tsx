"use client"
import { auth } from '@/firebase';
import { setCurrentUser } from '@/redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { redirect, usePathname, useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import LinearProgressBar from './progress/LinearProgressBar';
// import useSocket from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/lib/providers/socket-provider';

const Splash = ({
    children
}: { children: React.ReactNode }) => {

    // const socket = useAppSelector((state) => state.socket.socket);
    const dispatch = useAppDispatch();

    // const { connectSocket } = useSocket();


    const [isUser, setIsUser] = useState(false);
    const pathname = usePathname();

    const { data } = useSession();

    const { socket, isConnected } = useSocket();

    console.log(socket?.id)


    useEffect(() => {
        if (data?.user) {
            console.log(data.user)
            dispatch(setCurrentUser(data.user));
        }
    }, [data, dispatch])

    const isUser2 = React.useMemo(() => !!data?.user, [data?.user])

    const handleClose = () => setIsUser(true)

    if (pathname === '/login' || pathname === '/signup') {
        return children
    }

    if (!isUser) {
        return (
            <LinearProgressBar onEnd={handleClose} />
        )
    }

    return  children
}

export default Splash