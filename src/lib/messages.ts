
import { Message, MessageData } from "./types";

let messages: Message[] = [];

export const addMessage = (message: MessageData) => {
    console.log('calling...')
    const msg = { id: String(messages.length + 1), ...message, sentAt: Date.now() };
    messages.push(msg);
    console.log(JSON.stringify(messages, null, 2))
    return msg;
};

export const removeMessage = (id: string) => {
    const index = messages.findIndex((message) => message.id === id);

    if (index !== -1) return messages.splice(index, 1)[0];
};

export const getMessage = (id: string) => messages.find((message) => message.id === id);

export const getMessages = () => {
    console.log(messages)
    return messages;
};
    

