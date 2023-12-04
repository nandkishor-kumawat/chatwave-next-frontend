"use client"
import { User } from '@/lib/types';
import { resetSocket, setSocket } from '@/redux/features/socketSlice';
import { setOnlineUsers } from '@/redux/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import React, { useEffect, useRef } from 'react'
import { io } from 'socket.io-client';

const useSocket = (email: string) => {

    const socketRef = useRef<any>();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.user.currentUser);
    const socket = useAppSelector((state) => state.socket.socket);



    useEffect(() => {
        fetch('/api/socket').finally(() => {
            socketRef.current = io('/', {
                autoConnect: false
            });

            dispatch(setSocket(socketRef.current))
        })

    }, []);

    useEffect(() => {
        if (!currentUser || !socket) return;

        socket.connect()

        socket.on("connect", () => {
            console.log(socket.id, 'in client');
            socket.emit("newUser", currentUser.email);
        });

        socket.on('newUserResponse', (users: User[]) => {
            dispatch(setOnlineUsers(users));
        });

        socket.on('disconnect', () => {
            console.log('disconnected--->', socket.id);
            dispatch(resetSocket())
        });
        return () => socket.disconnect();

    }, [currentUser, socket]);
}

export default useSocket