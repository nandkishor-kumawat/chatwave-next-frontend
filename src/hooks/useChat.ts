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

    const currentUser = useAppSelector((state) => state.user.currentUser);
    const secondUser = useAppSelector((state) => state.user.secondUser);
    const socket = useAppSelector((state) => state.socket.socket);

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
        if(!socket) return
        // if (!currentUser) return;
        // console.log(socket.connected)
        // fetch('/api/socket').finally(() => {

            // socket = io('/', {
            //     autoConnect: false
            // });

            // socket.connect()


            // socket.on("connect", () => {
            //     console.log(socket.id, 'in client');
            //     socket.emit("newUser", currentUser.email);
            // });



            socket.on('message', (data: any) => {
                console.log({ data })
                setMessages((prev: any) => [...prev, data]);
            });

            // socket.on('disconnect', () => {
            //     console.log('disconnected--->', socket.id)
            // });
        // })

        // return () => socket.disconnect();

    }, [socket]);


    const sendMessage = async (data: any) => {
        // if (!socket) return;
        // socket.emit("message", data);
        const docRef = doc(collection(db, "messages"));
        socket.emit("message", { ...data, id: docRef.id });

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
        if (!socket) return;
        socket.emit("changeRoom", room);
    }

    return {
        messages,
        onlineUsers,
        typingUsers,
        sendMessage,
        changeRoom,
    };
}      