"use client";

import counterReducer from "./features/counterSlice";
import userReducer from "./features/userSlice";
import logger from 'redux-logger'

 import { combineReducers, configureStore } from "@reduxjs/toolkit";
 import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
 import { persistReducer } from "redux-persist";
import storage from "./storage";
//  import storage from "redux-persist/lib/storage";

 
 const authPersistConfig = {
   key: "root",
   storage: storage,
   whitelist: ["secondUser",'currentUser'],
 };
 
 const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
},);


//  const rootReducer = combineReducers({
//    auth: persistReducer(authPersistConfig, authReducer),
//  });
 
 export const store = configureStore({
   reducer: persistReducer(authPersistConfig, rootReducer),
   middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware({ serializableCheck: false }),
    //  getDefaultMiddleware({ serializableCheck: false }).concat(logger),
 });
 
 export type RootState = ReturnType<typeof store.getState>;
 export type AppDispatch = typeof store.dispatch;
 
 export const useAppDispatch = () => useDispatch<AppDispatch>();
 export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
 