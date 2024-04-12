import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAcRpOdq61fJqWJ0nXLwPbRDeAs319swAE",
  authDomain: "qrcodebooktraker.firebaseapp.com",
  databaseURL: "https://qrcodebooktraker-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "qrcodebooktraker",
  storageBucket: "qrcodebooktraker.appspot.com",
  messagingSenderId: "907741587405",
  appId: "1:907741587405:web:0aefc007fd4e8fcb200684"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESOTRE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const REALTIME_DB = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);