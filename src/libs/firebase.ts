import { type FirebaseApp, getApp, initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBagjDQ1frkQH_t3OAM27vYuKk4qmjDUXw",
  authDomain: "learn-36505.firebaseapp.com",
  projectId: "learn-36505",
  storageBucket: "learn-36505.firebasestorage.app",
  messagingSenderId: "971930272636",
  appId: "1:971930272636:web:b6df722ceccf69a70e9af9",
  measurementId: "G-6ZTTPVH51T",
};

let app: FirebaseApp;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
export { auth };
