import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'



const firebaseConfig = {
  apiKey: "AIzaSyBD39jIEUqm209lvDsN7hxaPk_3QRsWbh4",
  authDomain: "parent-teacher-meeting.firebaseapp.com",
  projectId: "parent-teacher-meeting",
  storageBucket: "parent-teacher-meeting.appspot.com",
  messagingSenderId: "768043697008",
  appId: "1:768043697008:web:9b1d19f40a2a4fed1e05b5"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);