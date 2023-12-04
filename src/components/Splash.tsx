"use client"
import { auth } from '@/firebase';
import { setCurrentUser } from '@/redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { redirect, useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
import LinearProgressBar from './progress/LinearProgressBar';
import useSocket from '@/hooks/useSocket';

const Splash = ({
    children
}: { children: React.ReactNode }) => {

    const currentUser = useAppSelector((state) => state.user.currentUser);
    const dispatch = useAppDispatch();

    const [isUser, setIsUser] = useState(false);
    const router = useRouter();


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (!user) return router.push('/login')
            dispatch(setCurrentUser({
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoUrl: user.photoURL
            }))
        })
    }, [])

    useSocket('currentUser.email')

    if (!isUser) {
        return (
            <LinearProgressBar onEnd={() => setIsUser(true)} />
        )
    }

    return children
}

export default Splash