import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let analytics: Analytics | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  const app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase services initialized successfully");
} catch (error) {
  console.warn("Firebase initialization failed:", error);
}

export { analytics, auth, db };

export const logEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    try {
      firebaseLogEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.error(`Failed to log event "${eventName}":`, error);
    }
  } else {
    console.warn(`Analytics not initialized. Event "${eventName}" not logged.`);
  }
};
