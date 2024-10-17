import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6HWYS1hbYXR7xvKgq7hQW-T4wSECWnss",
  authDomain: "blabhere-29279.firebaseapp.com",
  projectId: "blabhere-29279",
  storageBucket: "blabhere-29279.appspot.com",
  messagingSenderId: "304567083706",
  appId: "1:304567083706:web:25db98d0c4edb2326e9883",
  measurementId: "G-V5JWXF119M",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
