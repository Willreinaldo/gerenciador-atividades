import {initializeApp} from 'firebase/app';
import { getAuth } from "firebase/auth"
import { getFirestore, collection, orderBy, query } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const {
  REACT_APP_FIREBASE_APP_KEY,
  REACT_APP_FIREBASE_APP_AUTH_DOMAIN,
  REACT_APP_FIREBASE_APP_PROJECT_ID,
  REACT_APP_FIREBASE_APP_STORAGE_BUCKET,
  REACT_APP_FIREBASE_APP_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_APP_MEASUREMENT_ID,
} = process.env;

const firebaseConfig = {
  apiKey:`${REACT_APP_FIREBASE_APP_KEY}`,
  authDomain:`${REACT_APP_FIREBASE_APP_AUTH_DOMAIN}`,
  projectId:`${REACT_APP_FIREBASE_APP_PROJECT_ID}`,
  storageBucket:`${REACT_APP_FIREBASE_APP_STORAGE_BUCKET}`,
  messagingSenderId:`${REACT_APP_FIREBASE_APP_MESSAGING_SENDER_ID}`,
  appId:`${REACT_APP_FIREBASE_APP_ID}`,
  measurementId:`${REACT_APP_FIREBASE_APP_MEASUREMENT_ID}`,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth();
export const db = getFirestore(app);
export const colRef = collection(db, 'tasks_db');
export const q = query(colRef, orderBy("title"));

