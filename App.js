import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";

// NAVIGTION
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// SCREENS
import Tabs from "./navigation/tabs";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import Chat from "./screens/Chat/Chat";
import Profile from "./screens/Profile";
import ChatSetting from "./screens/Chat/ChatSetting";

import { getAuth } from "firebase/auth";

// STACKS
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="SignIn"
        defaultScreenOptions={{ headerShadowVisible: false }}
      >
        <Stack.Screen
          name="bottomTab"
          component={Tabs}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name={"ChatSetting"}
          component={ChatSetting}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name={"SignIn"}
          component={SignIn}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name={"SignUp"}
          component={SignUp}
          screenOptions={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
