import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app = null;
let db = null;
let auth = null;
let googleProvider = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();

    // Enable offline persistence
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence notice: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence unsupported in browser');
      }
    });
  } else {
    console.warn('Firebase config missing or incomplete. Operating in local-only mode.');
  }
} catch (e) {
  console.warn('Firebase initialization error:', e);
}

// Google Sign-in helper
const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    alert('Firebase Authentication is not configured in environment settings.');
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.warn('Google Sign-in failed or cancelled:', error.message);
    throw error;
  }
};

// Sign-out helper
const signOutUser = async () => {
  if (!auth) return;
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.warn('Sign-out error:', error.message);
  }
};

export { app, db, auth, googleProvider, signInWithGoogle, signOutUser, onAuthStateChanged };
