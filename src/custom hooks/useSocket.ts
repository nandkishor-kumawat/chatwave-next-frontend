"use client"
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { UserData, User, TypingInfo, Message } from "@/lib/types";

import {
    USER_JOIN_CHAT_EVENT,
    USER_LEAVE_CHAT_EVENT,
    NEW_CHAT_MESSAGE_EVENT,
    START_TYPING_MESSAGE_EVENT,
    STOP_TYPING_MESSAGE_EVENT
} from '@/constants/eventconst';
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCurrentUser } from "@/redux/features/userSlice";
import { useSearchParams } from "next/navigation";


export default function useChat() {
    // const [messages, setMessages] = useState<Message[]>([]);
    const [messages, setMessages] = useState<any>([]);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<any[]>([]);
    const [user, setUser] = useState<UserData>();
    const socketRef = useRef<any>();
    const currentUser = useAppSelector((state) => state.user.currentUser);
    const dispatch = useAppDispatch()

    const params = useSearchParams()
    const name = params?.get('name')


    // useEffect(() => {
    //     const socketInitializer = async () => {
    //         await fetch('/api/socket')
    //         socketRef.current = io();

    //         socketRef.current.on('connect', () => {
    //             console.log('connected to socket', socketRef.current.id)
    //             dispatch(setCurrentUser({ id: socketRef.current.id }))
    //             socketRef.current.emit("newUser", name);
    //         });

    //         socketRef.current.on('newUserResponse', (users: User[]) => {
    //             setOnlineUsers(users);
    //             console.log(users)
    //         });

    //     }
    //     socketInitializer()

    //     if (socketRef.current) return socketRef.current.disconnect()
    // }, [])



    useEffect(() => {
        if (!name) return;

        // Disconnect the previous socket connection if it exists
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        fetch('/api/socket').finally(() => {
            socketRef.current = io();

            socketRef.current.on("connect", () => {
                console.log(socketRef.current.id, 'in client');
                dispatch(setCurrentUser({  id: socketRef.current.id }))
                socketRef.current.emit("newUser", name);
            });

            socketRef.current.on('newUserResponse', (users: User[]) => {
                setOnlineUsers(users);
                console.log(users)
            });

            socketRef.current.on('message', (data: any) => {
                setMessages((prev: any) => [...prev, data]);
            });

            socketRef.current.on('disconnect', () => {
                console.log('disconnected--->', socketRef.current.id)
            });
        });

        // Cleanup: Disconnect the socket when the component unmounts or when name changes
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [name]);



    const userJoin = (name: any) => {
        if (!socketRef.current) return;
        console.log('sent')
        socketRef.current.emit("newUser", name);
    }

    const sendMessage = (data: any) => {
        if (!socketRef.current) return;
        socketRef.current.emit("message", data);
    }

    const changeRoom = (room: string) => {
        if (!socketRef.current) return;
        socketRef.current.emit("changeRoom", room);
    }

    return {
        messages,
        onlineUsers,
        typingUsers,
        user,

        userJoin,
        sendMessage,
        changeRoom
    };
}      