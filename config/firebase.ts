import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';



const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "wardrobuddy.firebaseapp.com",
  projectId: "wardrobuddy",
  storageBucket: "wardrobuddy.firebasestorage.app",
  messagingSenderId: "697407030269",
  appId: "1:697407030269:web:117319ebc8a596a2c40f94",
  databaseURL: "https://wardrobuddy-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const rtdb = getDatabase(app);

export { app, auth, db, storage, rtdb };