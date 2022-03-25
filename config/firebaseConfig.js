import { initializeApp } from "firebase/app";

const config = {
  apiKey: "AIzaSyBIcfNd6NmWVqik9BA_esfQvxtJg_lkiQE",
  authDomain: "share-me-dbb49.firebaseapp.com",
  projectId: "share-me-dbb49",
  storageBucket: "share-me-dbb49.appspot.com",
  messagingSenderId: "588028483363",
  appId: "1:588028483363:web:43aa67c8338953cdfd1e96",
};

export const firebaseConfig = initializeApp(config);
