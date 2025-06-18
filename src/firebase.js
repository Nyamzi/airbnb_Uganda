import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMaJ6zDwXTNYF1tlaJrDvfvUFRwFkyGIk",
  authDomain: "airbnb-b9679.firebaseapp.com",
  projectId: "airbnb-b9679",
  storageBucket: "airbnb-b9679.firebasestorage.app",
  messagingSenderId: "509928925337",
  appId: "1:509928925337:web:44460449252a941aeeb008",
  measurementId: "G-LT5S91EN5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Log initialization status
console.log('Firebase initialized successfully');

export { db, auth, analytics }; 