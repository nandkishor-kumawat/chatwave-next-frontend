import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CounterState = {
  socket: any;
};

const initialState = {
  socket: null,
} as CounterState;

export const socket = createSlice({
  name: "socket",
  initialState,
  reducers: {

    resetSocket: () => initialState,
    setSocket: (state, action: PayloadAction<any>) => {
      state.socket = action.payload;
    },

  },
});

export const {
  setSocket,
  resetSocket,
} = socket.actions;
export default socket.reducer;