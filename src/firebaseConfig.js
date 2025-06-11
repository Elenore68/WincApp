import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAnetBTnhJtso6GbtzTW-4km5fMN_OHWqo",
  authDomain: "winc-cards-c.firebaseapp.com",
  projectId: "winc-cards-c",
  storageBucket: "winc-cards-c.firebasestorage.app",
  messagingSenderId: "509191559623",
  appId: "1:509191559623:web:aeb5d8c3c1a749866261e2",
  measurementId: "G-B57HB96GNW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
