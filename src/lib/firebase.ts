import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDWkLUMhL36rVwEPcjNu8uO_AU6JP3W2jo",
  authDomain: "medtrack-care.firebaseapp.com",
  databaseURL: "https://medtrack-care-default-rtdb.firebaseio.com",
  projectId: "medtrack-care",
  storageBucket: "medtrack-care.firebasestorage.app",
  messagingSenderId: "472039854066",
  appId: "1:472039854066:web:472953657b7696acbd656b",
  measurementId: "G-7JKPR14JQ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;