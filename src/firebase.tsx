// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBanb-RpzdBmT1K0ldfTbberdxFzbUj824",
  authDomain: "drc-project-99da9.firebaseapp.com",
  projectId: "drc-project-99da9",
  storageBucket: "drc-project-99da9.appspot.com",
  messagingSenderId: "860551647147",
  appId: "1:860551647147:web:8d8683f8a4d543e5718cee",
  measurementId: "G-D8WZX9D7H2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);