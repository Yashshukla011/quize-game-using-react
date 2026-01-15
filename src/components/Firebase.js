import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1Ry2KzqPfN4M80Gu_iatdCiklRCJI3LQ",
  authDomain: "quize-ee617.firebaseapp.com",
  projectId: "quize-ee617",
  storageBucket: "quize-ee617.appspot.com",
  messagingSenderId: "448358194670",
  appId: "1:448358194670:web:a89c3a3c85a2faeaedc2ff",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
