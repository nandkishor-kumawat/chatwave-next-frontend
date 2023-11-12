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
import { useAppDispatch } from "@/redux/store";
import { setCurrentUser } from "@/redux/features/userSlice";


export default function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<any[]>([]);
    const [user, setUser] = useState<UserData>();
    const socketRef = useRef<any>();

    useEffect(() => {
        console.log(JSON.stringify(onlineUsers, null, 2))
    }, [onlineUsers])

    const dispatch = useAppDispatch()

    useEffect(() => {
        // if (!user) {
        //   return;
        // }
        // fetch('/api/socket').finally(() => {
        socketRef.current = io("http://localhost:4000");
        // socketRef.current = io({
        //     query: { roomId, name: user.name, picture: user.picture }
        // });

        socketRef.current.on("connect", () => {
            console.log(socketRef.current.id, 'in client');
            dispatch(setCurrentUser({ id: socketRef.current.id }))
        });

        socketRef.current.on('newUserResponse', (users: User[]) => {
            setOnlineUsers(users);
        });


        return () => {
            socketRef.current.disconnect();
        };
        // });
    }, []);


    const userJoin = (room: string | null | undefined) => {
        if (!socketRef.current) return;
        console.log(room, 1)
        socketRef.current.emit("newUser", room);
    }

    return {
        userJoin,
        onlineUsers
    };
}      