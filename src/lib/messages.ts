
import { Message, MessageData } from "./types";

let messages: Message[] = [];

export const addMessage = (message: Message) => {
    messages.push(message);
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
    

