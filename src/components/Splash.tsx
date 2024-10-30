"use client"
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useSocket } from "@/components/providers";
import { SOCKET_ACTIONS } from "@/constants";
import { userActions } from '@/redux/features'
import { Conversation, User } from "@prisma/client";
import { useSession } from "@/hooks";


export default function Splash() {
    const { session } = useSession();
    const currentUser = session?.user;

    const { socket, isConnected } = useSocket()
    const dispatch = useAppDispatch();

    const { onlineUsers } = useAppSelector((state) => state.user);


    useEffect(() => {
        if (!socket || !currentUser) return
        socket.emit(SOCKET_ACTIONS.NEW_USER, currentUser);
    }, [socket, currentUser]);

    const handleMessage = useCallback((data: Conversation) => {
        console.log(data)
        dispatch(userActions.addConversation({ userId: data.senderId, conversation: data }))
    }, [dispatch]);

    const handleNewUser = useCallback((users: User[]) => {
        // console.log(JSON.stringify(users, null, 2));
        dispatch(userActions.setOnlineUsers(users));
    }, [dispatch]);

    useEffect(() => {
        if (!socket) return

        socket.on(SOCKET_ACTIONS.MESSAGE, handleMessage);
        socket.on(SOCKET_ACTIONS.NEW_USER_RESPONSE, handleNewUser);

        return () => {
            socket.off(SOCKET_ACTIONS.MESSAGE, handleMessage);
            socket.off(SOCKET_ACTIONS.NEW_USER_RESPONSE, handleNewUser);
        }

    }, [socket, handleMessage, handleNewUser]);


    useEffect(() => {
        if (!socket || !currentUser) return
        const isMe = onlineUsers.find((user) => user.id === currentUser.id);
        // if (!isMe) {
        //     socket.emit(SOCKET_ACTIONS.NEW_USER, currentUser);
        // }
    }, [onlineUsers, socket, currentUser]);

    useEffect(() => {
        socket?.getSockets((sockets) => {
            dispatch(userActions.setOnlineUsers(sockets));
        })

    }, [socket, dispatch]);

    return null;
}      