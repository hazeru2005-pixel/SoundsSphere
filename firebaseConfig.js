
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDLfaIVLvFi6tjAFpHOSUy4jWEEvmDeVe4",
  authDomain: "soundsphere-11427.firebaseapp.com",
  projectId: "soundsphere-11427",
  storageBucket: "soundsphere-11427.firebasestorage.app",
  messagingSenderId: "407839229933",
  appId: "1:407839229933:web:8117c9846f5490d44409e4"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
