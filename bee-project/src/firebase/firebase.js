// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOMScDHH-wjwusT4DNW_3YS2bl1sA3kAo",
  authDomain: "bee-project-74cf9.firebaseapp.com",
  projectId: "bee-project-74cf9",
  storageBucket: "bee-project-74cf9.firebasestorage.app",
  messagingSenderId: "121350696624",
  appId: "1:121350696624:web:039ed03feb0536609a9575",
  measurementId: "G-ENLX1D4PEZ"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Authentication
export const auth = getAuth(app);

// Khởi tạo Firestore
export const db = getFirestore(app);