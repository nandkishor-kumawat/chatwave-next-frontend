"use client"
import { use, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { User, Message } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useSocket } from "@/lib/providers/socket-provider";
import { SOCKET_ACTIONS } from "@/constants/socket-actions";



export default function useChat() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<any[]>([]);
    const currentUser = useAppSelector(state => state.user.currentUser)

    const { socket, isConnected } = useSocket()
    const dispatch = useAppDispatch();

    useEffect(() => {

        const messagesCollection = collection(db, 'messages');
        const q = query(messagesCollection, orderBy("sentAt", "asc"),);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Message[];
            setMessages(messages);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!socket || !currentUser) return
        socket.emit(SOCKET_ACTIONS.NEW_USER, currentUser.email);
        return () => {
            socket.off(SOCKET_ACTIONS.NEW_USER);
        }
    }, [socket, currentUser]);

    useEffect(() => {
        if (!socket) return

        socket.on('message', (data: any) => {
            console.log(data)
            // setMessages((prev: any) => [...prev, data]);
        });

        socket.on(SOCKET_ACTIONS.NEW_USER_RESPONSE, (users: User[]) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off('message');
            socket.off(SOCKET_ACTIONS.NEW_USER_RESPONSE);
        }

    }, [socket]);


    const sendMessage = async (data: any) => {
        if (!socket) return;
        const docRef = doc(collection(db, "messages"));
        socket.emit("message", { ...data, id: docRef.id });
        setDoc(docRef, data)
    }


    return {
        messages,
        onlineUsers,
        typingUsers,
        sendMessage,
    };
}      