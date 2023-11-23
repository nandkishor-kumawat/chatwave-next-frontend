import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import 'firebase/auth';
import 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDjuSsB7kuS-xMYbyzS0phWlFWFno_zpqU",
    authDomain: "chatwave-fcf57.firebaseapp.com",
    projectId: "chatwave-fcf57",
    storageBucket: "chatwave-fcf57.appspot.com",
    messagingSenderId: "619186659506",
    appId: "1:619186659506:web:bb5f0a3e404d9f614269ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth()
const rdb = getDatabase();
const storage = getStorage(app);
// export { app, auth, db, resetpass, storage }
export { app, auth, db, rdb, storage }



