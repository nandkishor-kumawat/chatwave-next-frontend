import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export interface UserData {
    name: string;
    picture: string;
}

export interface User {
    email: string;
    name: string;
    id: string;
    typing: {
        status: boolean;
        to: string | null;
    }
}

export interface TypingInfo {
    senderId: string;
    user: User;
}

export interface MessageData {
    body?: {
        type: string;
        content: string;
    };
    message: string;
    sender_id: string;
    receiver_id: string;
}


export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    body?: {
        type: string;
        content: string;
    };
    message: string;
    sentAt: number;
    deliveredAt?: number;
    readAt?: number;
    room?: string;
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
  };