export interface UserData {
    name: string;
    picture: string;
}

export interface User {
    email: string;
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
    body: string;
    senderId: string;
    user: UserData;
}

export interface Message {
    id: string;
    room: string;
    body: string;
    senderId: string;
    user: UserData;
    sentAt: number;
    ownedByCurrentUser?: boolean;
}

