import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export { collection, doc, getDoc, getDocs, setDoc, query, updateDoc, deleteDoc, addDoc, where, onSnapshot } from 'firebase/firestore';
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, fetchSignInMethodsForEmail, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_PROYECT_ID + ".firebaseapp.com",
    projectId: import.meta.env.VITE_PROYECT_ID,
    storageBucket: import.meta.env.VITE_PROYECT_ID + ".appspot.com",
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

setPersistence(auth, browserLocalPersistence);