"use client"
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import { UserData, User, TypingInfo, Message } from "@/lib/types";



export default function useSocket() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const [user, setUser] = useState<UserData>();
  const socketRef = useRef<any>();


  useEffect(() => {

    fetch('/api/socket').finally(() => {
      socketRef.current = io();

      socketRef.current.on("connect", () => {
        console.log(socketRef.current.id);
      });

      return () => {
        socketRef.current.disconnect();
      };
    });
  }, []);

  const useJoin = (room:String) => {
    if(!socketRef.current) return;
    socketRef.current.emit("join", room);
  }

  return {
    useJoin
  };
}      