import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-trip-planner-a9b43.firebaseapp.com",
  projectId: "ai-trip-planner-a9b43",
  storageBucket: "ai-trip-planner-a9b43.firebasestorage.app",
  messagingSenderId: "208314389878",
  appId: "1:208314389878:web:023c09f0798b6ba8ef5657",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;