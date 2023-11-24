"use client"
import { use, useEffect, useRef, useState } from "react";
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
// import socket from "@/socket";


export default function useChat() {
    // const [messages, setMessages] = useState<Message[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<any[]>([]);
    const socketRef = useRef<any>();
    const currentUser = useAppSelector((state) => state.user.currentUser);
    const dispatch = useAppDispatch()

    const params = useSearchParams()
    const name = params?.get('name')

    useEffect(() => {
        // if (!currentUser) return;
        // console.log(socket.connected)
        fetch('/api/socket').finally(() => {

            socketRef.current = io('/', {
                autoConnect: false
            });

            socketRef.current.connect()


            socketRef.current.on("connect", () => {
                console.log(socketRef.current.id, 'in client');
                socketRef.current.emit("newUser", currentUser.email);
            });

            socketRef.current.on('newUserResponse', (users: User[]) => {
                setOnlineUsers(users);
            });

            socketRef.current.on('message', (data: any) => {
                setMessages((prev: any) => [...prev, data]);
            });

            socketRef.current.on('disconnect', () => {
                console.log('disconnected--->', socketRef.current.id)
            });


            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }
            };
        })
    }, []);



    const userJoin = (name: any) => {
        if (!socketRef.current) return;
        console.log('sent')
        socketRef.current.emit("newUser", name);
    }

    const sendMessage = (data: any) => {
        console.log(socketRef.current)
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
        userJoin,
        sendMessage,
        changeRoom
    };
}      