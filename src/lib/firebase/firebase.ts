// src/firebase/firebase.ts
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC4c53R5qCDYZ2Jj7A1Ps7pRJcqKIoEZ-M",
  authDomain: "better-off-market-project.firebaseapp.com",
  projectId: "better-off-market-project",
  storageBucket: "better-off-market-project.firebasestorage.app",
  messagingSenderId: "541953855584",
  appId: "1:541953855584:web:b370a0b21448c554ee3305",
  measurementId: "G-7JTZGTCY17"
};


export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);