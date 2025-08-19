import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyDlyEHLQfujUbIs05PKlvaJBQAgzJBmHMs",
  authDomain: "wrappednow-a9b74.firebaseapp.com",
  projectId: "wrappednow-a9b74",
  storageBucket: "wrappednow-a9b74.firebasestorage.app",
  messagingSenderId: "116674584907",
  appId: "1:116674584907:web:4d5f3876dd9824adef08ce",
  measurementId: "G-53Q5JP2XPJ"
};

export const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
