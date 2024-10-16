import firebase from 'firebase/compat/app';  // Import the Firebase compat layer
import 'firebase/compat/firestore';  // Import Firestore

// Firebase configuration object containing keys and identifiers
const firebaseConfig = {
  apiKey: "AIzaSyBaYlCJbhJ1KcpM8YZhBkUP7ssGdDE8jRQ",
  authDomain: "hafifa-6ee43.firebaseapp.com",
  databaseURL: "https://hafifa-6ee43-default-rtdb.firebaseio.com",
  projectId: "hafifa-6ee43",
  storageBucket: "hafifa-6ee43.appspot.com",
  messagingSenderId: "138962369235",
  appId: "1:138962369235:web:2f8088adebf972e9c2f226",
  measurementId: "G-B2QL984BDV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export the database for use in other parts of your application
export const db = firebase.firestore();

// Optionally, you could also export authentication or other Firebase services you plan to use
export const auth = firebase.auth();