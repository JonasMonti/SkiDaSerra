import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD5pP_qzk9z5RT__tGvmrVgWZuVKPDGBfA",
  authDomain: "ski-da-serra.firebaseapp.com",
  projectId: "ski-da-serra",
  storageBucket: "ski-da-serra.appspot.com",
  messagingSenderId: "882758758252",
  appId: "1:882758758252:web:3460e8b234a4d0cb7c4d49",
  measurementId: "G-BPNN0JNE0H",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
