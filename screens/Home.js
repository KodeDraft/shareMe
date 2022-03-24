import React from "react";
// NATIVE IMPORTS
import { View, Text, Image } from "react-native";
// CUSTOM HEADER COMPONENT
import Header from "../components/Header";
// ICON
import { Ionicons } from "@expo/vector-icons";
// ANIMATION
import * as Animatable from "react-native-animatable";
// SCREEN
import ViewPost from "./ViewPost";
// FIREBASE IMPORTS
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

export default function Home({ navigation }) {
  const auth = getAuth();
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("bottomTab");
      } else {
        navigation.navigate("SignIn");
      }
    });
  }, []);
  return (
    <View>
      <Header
        titleText="Home"
        rightIcon={
          <Image
            source={require("../assets/app-logo.png")}
            style={{
              width: 50,
              height: 50,
              marginRight: 20,
              borderRadius: 5,
            }}
          />
        }
        leftIcon={<Ionicons name="home-outline" size={35} color="#0F1E37" />}
      />
      <Animatable.View
        animation="slideInLeft"
        duration={500}
        direction="alternate"
      >
        <View style={{ marginTop: 0 }}>
          <ViewPost />
        </View>
      </Animatable.View>
    </View>
  );
}
