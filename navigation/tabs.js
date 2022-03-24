import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
// ICONS
import { Ionicons } from "@expo/vector-icons";
import plus from "../assets/icons/plus.png";

// SCREENS
import Home from "../screens/Home";
import Post from "../screens/Post";
import Profile from "../screens/Profile";
import Chat from "../screens/Chat/Chat";

// NAVIGTION
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// STACKS
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabButton = ({ children, onPress, focused }) => {
  return (
    <TouchableOpacity
      style={{
        // top: -30,
        justifyContent: "center",
        alignItems: "center",
        ...styles.shadow,
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 35,
          backgroundColor: "#0F1E37",
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          position: "absolute",
          elevation: 0,
          backgroundColor: "#fff",
          borderRadius: 15,
          height: 90,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <Ionicons
                name="home-outline"
                size={25}
                color={focused ? "#0F1E37" : "#748c94"}
              />
              <Text
                style={{
                  color: focused ? "#0F1E37" : "#748c94",
                  fontSize: 12,
                  paddingTop: 10,
                }}
              >
                HOME
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add" color="#fff" size={33} />
          ),
          tabBarButton: (props) => <CustomTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <Ionicons
                name="chatbox-outline"
                size={25}
                color={focused ? "#0F1E37" : "#748c94"}
              />
              <Text
                style={{
                  color: focused ? "#0F1E37" : "#748c94",
                  fontSize: 12,
                  paddingTop: 10,
                }}
              >
                CHAT
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        size={30}
        color="#e32f45"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <Ionicons
                name="person-outline"
                size={25}
                color={focused ? "dodgerblue" : "#748c94"}
              />
              <Text
                style={{
                  color: focused ? "dodgerblue" : "#748c94",
                  fontSize: 12,
                  paddingTop: 10,
                }}
              >
                PROFILE
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
export default Tabs;
