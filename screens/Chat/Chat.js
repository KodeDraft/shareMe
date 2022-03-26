import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
// NATIVE IMPORTS
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
// FIREBASE
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
// CONFIG
import firebaseConfig from "../../config/firebaseConfig";
// MOMENT => INSTALLED => USED FOR FORMATING DATE
import moment from "moment";
// GIFTED CHAT => INSTALLED => OPEN SRC => !important
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
// CUSTOM HEADER COMPONENT
import Header from "../../components/Header";
// ICONS
import { Ionicons } from "@expo/vector-icons";

export default function Chat(props) {
  useLayoutEffect(() => {
    getMessages();
    getbackgroundImage();
  }, []);

  // FIREBASE
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();
  const [messages, setMessages] = useState([]);

  const [chatBackgroundImage, setChatBackgroundImage] = useState(
    "https://w0.peakpx.com/wallpaper/1007/845/HD-wallpaper-abstract-3d-shadow-background-blue-cool-design-harmony-light-pastel-yellow.jpg"
  );

  const getMessages = () => {
    const colRef = collection(db, "chats");

    const q = query(colRef, orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
      let recievedMsg = [];
      snapshot.docs.forEach((doc) => {
        recievedMsg.push({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
        });
      });
      setMessages(recievedMsg);
    });
  };
  const getbackgroundImage = async () => {
    const colRef = collection(db, "settings");

    const q = query(colRef);

    onSnapshot(q, (snapshot) => {
      let bg = [];
      snapshot.docs.forEach((doc) => {
        bg.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      if (bg.length < 1) {
        setChatBackgroundImage(
          "https://w0.peakpx.com/wallpaper/1007/845/HD-wallpaper-abstract-3d-shadow-background-blue-cool-design-harmony-light-pastel-yellow.jpg"
        );
      } else {
        setChatBackgroundImage(bg[0].chatBackgroundImage);
      }
    });
  };
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, "chats"), {
      _id,
      createdAt,
      text,
      user,
      date: moment(new Date()).format("MMMM D, YYYY"),
    });
  }, []);

  return (
    <ImageBackground
      style={styles.container}
      source={{ uri: chatBackgroundImage }}
      imageStyle={styles.backgroundImg}
    >
      <View style={{ width, height: "100%" }}>
        {/* <View> */}
        <Header
          leftIcon={
            <Ionicons name="arrow-back-circle-outline" size={35} color="#fff" />
          }
          leftIconOnPress={() => props.navigation.goBack()}
          rightIcon={
            <Ionicons name="settings-outline" size={35} color="#fff" />
          }
          rightIconOnPress={() => props.navigation.navigate("ChatSetting")}
        />
        {/* </View> */}
        <GiftedChat
          messages={messages}
          showUserAvatar={true}
          isTyping
          onSend={(messages) => onSend(messages)}
          user={{
            _id: auth?.currentUser?.email,
            name: auth?.currentUser?.displayName,
            avatar: auth?.currentUser?.photoURL,
          }}
          optionTintColor={{ color: "red" }}
          placeholder="Type a Message"
        />
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {},
  backgroundImg: {
    width,
    height,
  },
});
