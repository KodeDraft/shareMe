import { initializeApp } from "firebase/app";
// export default {
//   apiKey: "AIzaSyCG0bzfU8snUVH4dBUFq76i2fNh53nLO58",
//   authDomain: "social-app-f7061.firebaseapp.com",
//   projectId: "social-app-f7061",
//   storageBucket: "social-app-f7061.appspot.com",
//   messagingSenderId: "730070548982",
//   appId: "1:730070548982:web:05f6a55e79985afb6887d7",
//   measurementId: "G-0Y9W8PHHBF",
// };

const config = {
  apiKey: "AIzaSyCG0bzfU8snUVH4dBUFq76i2fNh53nLO58",
  authDomain: "social-app-f7061.firebaseapp.com",
  projectId: "social-app-f7061",
  storageBucket: "social-app-f7061.appspot.com",
  messagingSenderId: "730070548982",
  appId: "1:730070548982:web:05f6a55e79985afb6887d7",
  measurementId: "G-0Y9W8PHHBF",
};

export const firebaseConfig = initializeApp(config);
