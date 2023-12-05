"use client"
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { User, Message } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "@/firebase";
import { getMessages } from "@/lib/messages";



export default function useChat() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<any[]>([]);

    const socket = useAppSelector((state) => state.socket.socket);
    const currentUser = useAppSelector((state) => state.user.currentUser);
    const secondUser = useAppSelector((state) => state.user.secondUser);

    const dispatch = useAppDispatch()

    useEffect(() => {

        const messagesCollection = collection(db, 'messages');
        const q = query(
            messagesCollection,
            orderBy("sentAt", "asc"),
            // limit(10),
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages: any[] = [];
            querySnapshot.forEach((doc) => {
                messages.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            setMessages(messages);
        });
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        if (!socket) return
  
        socket.on('message', (data: any) => {
            console.log({ data })
            // setMessages((prev: any) => [...prev, data]);
        });

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