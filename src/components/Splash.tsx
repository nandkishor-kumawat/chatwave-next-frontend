"use client"
import { auth } from '@/firebase';
import { setCurrentUser } from '@/redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { redirect, useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import LinearProgressBar from './progress/LinearProgressBar';
import useSocket from '@/hooks/useSocket';
import { useSession } from 'next-auth/react';

const Splash = ({
    children
}: { children: React.ReactNode }) => {

    const socket = useAppSelector((state) => state.socket.socket);
    const dispatch = useAppDispatch();

    const { connectSocket } = useSocket();


    const [isUser, setIsUser] = useState(false);

    const { data } = useSession();

    useEffect(() => {
        if (!socket) {
            connectSocket()
        }
    }, [socket, connectSocket])

    useEffect(() => {
        if (data?.user) {
            console.log(data.user)
            dispatch(setCurrentUser(data.user))
        }
    }, [data, dispatch])




    if (!isUser) {
        return (
            <LinearProgressBar onEnd={() => setIsUser(true)} />
        )
    }

    return children
}

export default Splash