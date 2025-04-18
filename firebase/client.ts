
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCRFlpYsjfD6bdzcjIK4kSt-I1J9c6WOJw",
    authDomain: "prepwise-849cd.firebaseapp.com",
    projectId: "prepwise-849cd",
    storageBucket: "prepwise-849cd.firebasestorage.app",
    messagingSenderId: "115766003575",
    appId: "1:115766003575:web:ff8849e23a02a4a571c372",
    measurementId: "G-771MR7RTQM"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);