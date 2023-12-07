import { User } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
    message: string;
    secondUser: any;
    currentUser: any,
};

const initialState = {
    message: '',
    secondUser:null,
    currentUser: null,
} as UserState;

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setChatMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload
        },

        switchUser: (state, action: PayloadAction<any>) => {
            state.secondUser = action.payload
        },

        setCurrentUser: (state, action: PayloadAction<any>) => {
            state.currentUser = action.payload
        },
    },
});

export const {
    setChatMessage,
    switchUser,
    setCurrentUser
} = user.actions;
export default user.reducer;