import { Conversation, User } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
    secondUser: any;
    currentUser: any;
    conversations: Record<string, Conversation[]>;
    onlineUsers: User[];
};

const initialState = {
    secondUser: null,
    currentUser: null,
    conversations: {},
    onlineUsers: [],
} as UserState;

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        switchUser: (state, action: PayloadAction<any>) => {
            state.secondUser = action.payload
        },

        setCurrentUser: (state, action: PayloadAction<any>) => {
            state.currentUser = action.payload
        },

        setConversations: (state, action: PayloadAction<{ userId: string, conversations: Conversation[] }>) => {
            state.conversations[action.payload.userId] = action.payload.conversations
        },

        addConversation: (state, action: PayloadAction<{ userId: string, conversation: Conversation, replace?: boolean }>) => {
            if (!state.conversations[action.payload.userId]) state.conversations[action.payload.userId] = [];
            if (action.payload.replace) {
                state.conversations[action.payload.userId].pop();
                state.conversations[action.payload.userId].push(action.payload.conversation)
            } else {
                state.conversations[action.payload.userId].push(action.payload.conversation)
            }
        },

        setOnlineUsers: (state, action: PayloadAction<User[]>) => {
            state.onlineUsers = action.payload
        }
    },
});

export const userActions = user.actions;
export const userReducer = user.reducer;