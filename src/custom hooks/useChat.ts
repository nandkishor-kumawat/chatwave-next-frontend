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

export default function useChat(roomId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<any[]>([]);
    const [user, setUser] = useState<UserData>();
    const socketRef = useRef<any>();

    // useEffect(() => {
    //     const fetchUser = async () => {
    //       const response = await fetch("https://api.randomuser.me/").then(res=>res.json());
    //       const result = response.results[0];
    //       setUser({
    //         name: result.name.first,
    //         picture: result.picture.thumbnail,
    //       });
    //     };

    //     fetchUser();
    // }, []);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //       const response = await fetch(
    //         `/api/rooms/${roomId}/users`
    //       ).then(res=>res.json());
    //       const result = response.users;
    //       setUsers(result);
    //     };

    //     fetchUsers();
    // }, [roomId]);

    // useEffect(() => {
    //     const fetchMessages = async () => {
    //       const response = await fetch(
    //         `/api/rooms/${roomId}/messages`
    //       ).then(res=>res.json());
    //       const result = response.messages;
    //       setMessages(result);
    //     };

    //     fetchMessages();
    // }, [roomId]);

    useEffect(() => {
        // if (!user) {
        //   return;
        // }
        fetch('/api/socket').finally(() => {
            socketRef.current = io();
            // socketRef.current = io({
            //     query: { roomId, name: user.name, picture: user.picture }
            // });

            socketRef.current.on("connect", () => {
                console.log(socketRef.current.id);
            });

            socketRef.current.on(USER_JOIN_CHAT_EVENT, (user: User) => {
                // if (user.id === socketRef.current.id) return;
                setUsers((users) => [...users, user]);
            });

            socketRef.current.on(USER_LEAVE_CHAT_EVENT, (user: User) => {
                setUsers((users) => users.filter((u) => u.id !== user.id));
            });

            // socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message: Message) => {
            //     const incomingMessage = {
            //       ...message,
            //       ownedByCurrentUser: message.senderId === socketRef.current.id,
            //     };
            //     setMessages((messages) => [...messages, incomingMessage]);
            // });

            // socketRef.current.on(START_TYPING_MESSAGE_EVENT, (typingInfo: TypingInfo) => {
            //     if (typingInfo.senderId !== socketRef.current.id) {
            //       const user = typingInfo.user;
            //       setTypingUsers((users) => [...users, user]);
            //     }
            // });

            // socketRef.current.on(STOP_TYPING_MESSAGE_EVENT, (typingInfo: TypingInfo) => {
            //     if (typingInfo.senderId !== socketRef.current.id) {
            //       const user = typingInfo.user;
            //       setTypingUsers((users) => users.filter((u) => u.name !== user.name));
            //     }
            // });

            return () => {
                socketRef.current.disconnect();
            };
        });
    }, []);

    const sendMessage = (messageBody: string) => {
        if (!socketRef.current) return;
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
            body: messageBody,
            senderId: socketRef.current.id,
            user: user,
        });
    };

    const startTypingMessage = () => {
        if (!socketRef.current) return;
        socketRef.current.emit(START_TYPING_MESSAGE_EVENT, {
            senderId: socketRef.current.id,
            user,
        });
    };

    const stopTypingMessage = () => {
        if (!socketRef.current) return;
        socketRef.current.emit(STOP_TYPING_MESSAGE_EVENT, {
            senderId: socketRef.current.id,
            user,
        });
    };

    return {
        messages,
        user,
        users,
        typingUsers,
        sendMessage,
        startTypingMessage,
        stopTypingMessage,
    };
}      