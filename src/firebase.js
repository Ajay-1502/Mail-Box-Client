// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCjZyJhl_3dZo3dfdrcONzTCqseL1Ii6Xw',
  authDomain: 'mail-box-client-f22d7.firebaseapp.com',
  databaseURL: 'https://mail-box-client-f22d7-default-rtdb.firebaseio.com/',
  projectId: 'mail-box-client-f22d7',
  storageBucket: 'mail-box-client-f22d7.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef123456',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Realtime Database
export const db = getDatabase(app);
