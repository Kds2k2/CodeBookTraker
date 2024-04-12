import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAcRpOdq61fJqWJ0nXLwPbRDeAs319swAE",
  authDomain: "qrcodebooktraker.firebaseapp.com",
  projectId: "qrcodebooktraker",
  storageBucket: "qrcodebooktraker.appspot.com",
  messagingSenderId: "907741587405",
  appId: "1:907741587405:web:0aefc007fd4e8fcb200684"
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESOTRE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);