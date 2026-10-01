import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXXoRFKMkQCDCIOjLMFnEhsqHZ_peH_Qs",
  authDomain: "ekai-11cf6.firebaseapp.com",
  projectId: "ekai-11cf6",
  storageBucket: "ekai-11cf6.firebasestorage.app",
  messagingSenderId: "700178032045",
  appId: "1:700178032045:web:1594f7e27570fffc6f6d24",
  measurementId: "G-HLK6CNY2JB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (safely in browser environment)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((yes) => {
      if (yes) analytics = getAnalytics(app);
    })
    .catch(() => {});
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(email, password, displayName = "") {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    try {
      await updateProfile(result.user, { displayName });
    } catch {
      // Non-blocking profile update
    }
  }
  return result.user;
}

export async function logoutFirebase() {
  await signOut(auth);
}

export { app, analytics };
export default app;
