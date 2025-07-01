// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBmY0L_rTp2VTNJayZTC5RJkNCQLvqoDAw",
  authDomain: "portfolio-f3b23.firebaseapp.com",
  databaseURL: "https://portfolio-f3b23-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portfolio-f3b23",
  storageBucket: "portfolio-f3b23.appspot.com",
  messagingSenderId: "810958536115",
  appId: "1:810958536115:web:d91124c091818566e49fc6",
  measurementId: "G-1340Q7ZHW3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
