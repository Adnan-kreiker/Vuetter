import { boot } from "quasar/wrappers";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// Add the Firebase products that you want to use
// import "firebase/auth";
import "firebase/firestore";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
  apiKey: "AIzaSyAGWp-cbPOUpo07HdLQkKhJ-btFX1xrPko",
  authDomain: "vuetter-a401f.firebaseapp.com",
  projectId: "vuetter-a401f",
  storageBucket: "vuetter-a401f.appspot.com",
  messagingSenderId: "758741484761",
  appId: "1:758741484761:web:b465480ac193a26efc2ac8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
export default db;
