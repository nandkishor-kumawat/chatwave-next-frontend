import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
    message: string;
};

const initialState = {
    message: '',
} as UserState;

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setChatMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload
        }
    },
});

export const {
    setChatMessage
} = user.actions;
export default user.reducer;