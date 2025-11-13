import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyADhQn9EHEt3N5OmMMpm0N3ccjr-HyfjOA",
  authDomain: "hunterconnect-80634.firebaseapp.com",
  projectId: "hunterconnect-80634",
  storageBucket: "hunterconnect-80634.firebasestorage.app",
  messagingSenderId: "555459134033",
  appId: "1:555459134033:web:24a45068ba72aa0081ae70",
  measurementId: "G-8N2YR7GFQ3",
};

// ✅ Initialize Firebase first
const app = initializeApp(firebaseConfig);

// ✅ Initialize services after app
const auth = getAuth(app);
const db = getFirestore(app);

// export app in case we need it elsewhere
export { app, auth, db };
