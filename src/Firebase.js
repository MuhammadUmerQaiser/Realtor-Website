// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXZNEHN7Ublol2jSeOLpwqj7CSxY3CHS8",
  authDomain: "realtor-website-8a159.firebaseapp.com",
  projectId: "realtor-website-8a159",
  storageBucket: "realtor-website-8a159.appspot.com",
  messagingSenderId: "16038501136",
  appId: "1:16038501136:web:fc22971391300b0ab5a395"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();