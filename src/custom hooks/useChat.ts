"use client"
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { User, Message } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { db } from "@/firebase";



export default function useChat() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [typingUsers, setTypingUsers] = useState<any[]>([]);
    const socketRef = useRef<any>();

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
        // return
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
                console.log({ data })
                setMessages((prev: any) => [...prev, data]);
            });

            socketRef.current.on('disconnect', () => {
                console.log('disconnected--->', socketRef.current.id)
            });
        })

        return () => socketRef.current.disconnect();

    }, []);


    const sendMessage = async (data: any) => {
        // if (!socketRef.current) return;
        // socketRef.current.emit("message", data);
        const docRef = doc(collection(db, "messages"));
        // socketRef.current.emit("message", { ...data, id: docRef.id });

        messages.push({ ...data, id: docRef.id })
        setMessages(messages);
        setDoc(docRef, {
            ...data,
            deliveredAt: Date.now()
        }).then(async () => {
            const d = await getDoc(docRef);
            let m = messages.find((m) => m.id === docRef.id) as Message
            m.deliveredAt = d.data()?.deliveredAt
        }).catch((e) => {
            console.log(e)
        })

    }

    const changeRoom = (room: string) => {
        if (!socketRef.current) return;
        socketRef.current.emit("changeRoom", room);
    }

    return {
        messages,
        onlineUsers,
        typingUsers,
        sendMessage,
        changeRoom,
        getSocket: () => socketRef.current
    };
}      