import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAVMVNi3NFS-YzeRVNtOFTTfJE2XT82VSY",
  authDomain: "porefect.firebaseapp.com",
  projectId: "porefect",
  storageBucket: "porefect.firebasestorage.app",
  messagingSenderId: "135956411167",
  appId: "1:135956411167:web:287fe0f49b8eb038bbf62a",
  measurementId: "G-SD4X5FELBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;