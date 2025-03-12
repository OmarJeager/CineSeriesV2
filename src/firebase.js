// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'; // Import Firestore function
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVhy2TSEJq8eYTouNwDeOI8oW33xkUrcI",
  authDomain: "series-api-c0930.firebaseapp.com",
  projectId: "series-api-c0930",
  storageBucket: "series-api-c0930.firebasestorage.app",
  messagingSenderId: "465828987055",
  appId: "1:465828987055:web:4d5778b74350d142a6545a",
  measurementId: "G-019MTZFLPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Authentication service
const analytics = getAnalytics(app); // Analytics (optional)
const firestore = getFirestore(app); // Correct way to initialize Firestore
const storage = getStorage(app); // Storage service

// Export services to be used in other parts of the app
export { auth, firestore, storage };
