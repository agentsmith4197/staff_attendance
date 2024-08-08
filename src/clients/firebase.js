import { initializeApp } from "firebase/app";
import { getFirestore, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, increment, deleteDoc, collection, query, where } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';


// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

// disableNetwork(db).catch((error) => {
//   console.error("Error disabling network: ", error);
// });

export { auth, db, storage, firestore, addDoc, ref, uploadBytes, getDownloadURL, collection, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, getDoc, getDocs, updateDoc, increment, deleteDoc, query, where };
