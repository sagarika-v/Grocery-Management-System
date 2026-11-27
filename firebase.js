import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBt0-5iSGYmGYdjZcOAjAC-_tOP_ncnRL0",
  authDomain: "grocery-management-app-7c76c.firebaseapp.com",
  projectId: "grocery-management-app-7c76c",
  storageBucket: "grocery-management-app-7c76c.appspot.com",
  messagingSenderId: "272190881551",
  appId: "1:272190881551:web:0ce3759eb1d164875dc87a",
  measurementId: "G-Z2DN2M7X0X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
