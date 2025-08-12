import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

export const firebaseConfig = {
  // deine Werte aus der Firebase Console (Web-App)
};

export const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
