// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAwQzo5NJsB0TI-bnNC2slTw2Ht96BXGI",
    authDomain: "social-media-django-8acf6.firebaseapp.com",
    projectId: "social-media-django-8acf6",
    storageBucket: "social-media-django-8acf6.appspot.com",
    messagingSenderId: "301115567361",
    appId: "1:301115567361:web:6a2f7a25c8604adb09ff00",
    measurementId: "G-XVGD9GB29C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const database = getFirestore();