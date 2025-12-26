// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

// This is the firebase configuration for the front end. 
// This is it 
const firebaseConfig = {
  apiKey: "AIzaSyCv25bd2eQ445WbFsZ-LKKBhljzLTuCqqM",
  authDomain: "finifications.firebaseapp.com",
  projectId: "finifications",
  storageBucket: "finifications.firebasestorage.app",
  messagingSenderId: "723057671814",
  appId: "1:723057671814:web:bbb48e6767d80bb7ea1b07",
  measurementId: "G-YQL344PDT3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { messaging };
