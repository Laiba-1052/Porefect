import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
   apiKey: "AIzaSyAahP8SPJaOrAH_gAUekaTvNsU94D3RMdk",
  authDomain: "beauty-tracker-852f7.firebaseapp.com",
  projectId: "beauty-tracker-852f7",
  storageBucket: "beauty-tracker-852f7.firebasestorage.app.com",
  messagingSenderId: "328204523500",
  appId: "1:328204523500:web:863e98b868f00394ef52c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;