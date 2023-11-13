// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDjuSsB7kuS-xMYbyzS0phWlFWFno_zpqU",
    authDomain: "chatwave-fcf57.firebaseapp.com",
    databaseURL: "https://chatwave-fcf57-default-rtdb.firebaseio.com",
    projectId: "chatwave-fcf57",
    storageBucket: "chatwave-fcf57.appspot.com",
    messagingSenderId: "619186659506",
    appId: "1:619186659506:web:bb5f0a3e404d9f614269ab"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);