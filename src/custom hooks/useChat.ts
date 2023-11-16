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
import socket from "@/socket";


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


    useEffect(() => {
        if (!name) return;
        console.log(socket.connected)
        socket.connect()

        socket.on("connect", () => {
            console.log(socket.id, 'in client');
            dispatch(setCurrentUser({ id: socket.id }))
            socket.emit("newUser", name);
        });

        socket.on('newUserResponse', (users: User[]) => {
            setOnlineUsers(users);
            console.log(users)
        });

        socket.on('message', (data: any) => {
            setMessages((prev: any) => [...prev, data]);
        });

        socket.on('disconnect', () => {
            console.log('disconnected--->', socket.id)
        });


        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);



    const userJoin = (name: any) => {
        if (!socket) return;
        console.log('sent')
        socket.emit("newUser", name);
    }

    const sendMessage = (data: any) => {
        if (!socket) return;
        socket.emit("message", data);
    }

    const changeRoom = (room: string) => {
        if (!socket) return;
        socket.emit("changeRoom", room);
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