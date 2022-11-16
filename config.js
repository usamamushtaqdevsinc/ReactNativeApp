import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCGUhGhAxNpYdSa6hmvMe6DFiy-bXfPauI",
  authDomain: "react-native-expense-tra-d2e5e.firebaseapp.com",
  databaseURL:
    "https://react-native-expense-tra-d2e5e-default-rtdb.firebaseio.com",
  projectId: "react-native-expense-tra-d2e5e",
  storageBucket: "react-native-expense-tra-d2e5e.appspot.com",
  messagingSenderId: "1019971622396",
  appId: "1:1019971622396:web:8524f412743845dd0a4e79",
};
if (!firebase.apps.legth) {
  firebase.initializeApp(firebaseConfig);
}
export { firebase };
