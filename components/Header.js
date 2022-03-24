import React from "react";
// NATIVE IMPORTS
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// ICONS
import Icon from "react-native-vector-icons/FontAwesome";
// HEADER => INSTALLED
import { FlatHeader } from "react-native-flat-header";
// SAFE AREA VIEW
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header({
  navigation,
  backgroundColor,
  titleText,
  leftIconOnPress,
  leftIcon,
  rightIcon,
  rightIconOnPress,
}) {
  return (
    <>
      <SafeAreaView>
        <FlatHeader
          leftText={titleText}
          leftTextStyle={{ color: "#0F1E37" }}
          leftIcon={
            <TouchableOpacity onPress={leftIconOnPress}>
              {leftIcon}
            </TouchableOpacity>
          }
          rightIcon={
            <TouchableOpacity onPress={rightIconOnPress}>
              {rightIcon}
            </TouchableOpacity>
          }
          large
          style={{ height: 70, backgroundColor: backgroundColor }}
        />
      </SafeAreaView>
    </>
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "black",
    height: "13%",
    width: "100%",
  },
  sameRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "12%",
  },
  headerTitle: {
    color: "white",
    fontSize: 40,
  },
});
