import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - your actual project config
const firebaseConfig = {
  apiKey: "AIzaSyCjPwemVjFA9WwMHwjj4h1irSBx1IFofFY",
  authDomain: "neurolaw-7bb86.firebaseapp.com",
  projectId: "neurolaw-7bb86",
  storageBucket: "neurolaw-7bb86.firebasestorage.app",
  messagingSenderId: "304435421802",
  appId: "1:304435421802:web:2af04e70f1ce5824976013",
  measurementId: "G-BDQN4V0Y84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
