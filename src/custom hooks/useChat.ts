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


export default function useChat() {
    // const [messages, setMessages] = useState<Message[]>([]);
    const [messages, setMessages] = useState<any>([]);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<any[]>([]);
    const [user, setUser] = useState<UserData>();
    const socketRef = useRef<any>();
    const currentUser = useAppSelector((state) => state.user.currentUser);

    useEffect(() => {
        console.log(JSON.stringify(messages, null, 2))
    }, [messages])

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!currentUser) return;
        // fetch('/api/socket').finally(() => {
        socketRef.current = io("http://localhost:4000");


        socketRef.current.on("connect", () => {
            console.log(socketRef.current.id, 'in client');
            dispatch(setCurrentUser({ id: socketRef.current.id }))
        });

        socketRef.current.on('newUserResponse', (users: User[]) => {
            setOnlineUsers(users);
            console.log(users)
        });

        socketRef.current.on('message', (data: any) => {
            setMessages((prev: any) => ([...prev, data]));
        });

        return () => {
            socketRef.current.disconnect();
        };
        // });
    }, []);


    const userJoin = (name: any) => {
        if (!socketRef.current) return;
        socketRef.current.emit("newUser", name);
    }

    const sendMessage = (data: any) => {
        if (!socketRef.current) return;
        socketRef.current.emit("message", data);
    }

    return {
        userJoin,
        onlineUsers,
        sendMessage,
        messages
    };
}      