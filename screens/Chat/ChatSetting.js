import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Header from "../../components/Header";
// ICONS
import { Ionicons } from "@expo/vector-icons";
// IMAGE PICKER
import * as ImagePicker from "expo-image-picker";
// FIREBASE IMPORTS
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore/lite";
import firebaseConfig from "../../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
// LOADER => INSTALLED
import LottieView from "lottie-react-native";
// SAFE AREA VIEW THAT AVOIDES THE
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatSetting(props) {
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // FIREBASE
  const db = getFirestore();
  const storage = getStorage();
  const auth = getAuth();
  const user = auth.currentUser;

  // USER PICKING IMAGE FROM IMAGE LIBRARY
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // SUBMIT HANDLER - !important
  const submit = async () => {
    const img = await fetch(image);
    const bytes = await img.blob();
    const settingImgReference = ref(storage, `settings/${user?.uid}`);

    setLoader(true);
    await uploadBytes(settingImgReference, bytes).then(() => {
      getDownloadURL(settingImgReference).then((url) => {
        setDoc(doc(db, "settings", user?.uid), {
          chatBackgroundImage: url,
        });
      });
    });
    setLoader(false);
    alert("Updated Background Image");
  };

  // LOADING
  const loading = () => {
    return (
      <Modal visible={loader} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: "#242433",
          }}
        >
          <LottieView
            source={require("../../assets/animated/settingLoader.json")}
            autoPlay
            loop
          />

          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "bold",
              position: "absolute",
              bottom: 50,
            }}
          >
            Loading..
          </Text>
        </View>
      </Modal>
    );
  };
  return (
    <>
      {loader ? (
        loading()
      ) : (
        <>
          <View style={styles.container}>
            <Header
              leftIcon={
                <Ionicons
                  name="arrow-back-circle-outline"
                  size={35}
                  color="dodgerblue"
                />
              }
              titleText="Settings"
              leftIconOnPress={() => props.navigation.navigate("bottomTab")}
            />
            <Text style={styles.title}>Chat System Settings</Text>

            <Text style={styles.label}>Select Background</Text>
            <TouchableOpacity onPress={pickImage}>
              <View
                style={{
                  borderWidth: 1,
                  borderStyle: "dashed",
                  width: 90,
                  alignSelf: "center",
                  marginTop: 50,
                }}
              >
                <Ionicons
                  name="cloud-upload"
                  size={35}
                  color="dodgerblue"
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{
                    width: 200,
                    height: 200,
                    alignSelf: "center",
                    marginTop: 20,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                />
              )}
            </TouchableOpacity>
            {image ? (
              <TouchableOpacity style={styles.btn} onPress={submit}>
                <Text style={styles.btnText}>SUBMIT</Text>
              </TouchableOpacity>
            ) : (
              <Text />
            )}
          </View>
          <Modal visible={modalVisible} animationType="slide">
            <SafeAreaView>
              <View style={{ backgroundColor: "#000", height: "100%" }}>
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: "100%",
                      height: "85%",
                      alignSelf: "center",
                      marginTop: 20,
                    }}
                  />
                )}
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { backgroundColor: "#ff036c", width: "90%", height: 40 },
                  ]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.btnText, { fontSize: 25 }]}>CLOSE</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: "dodgerblue",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  label: {
    color: "dodgerblue",
    fontWeight: "600",
    marginLeft: "5%",
    marginTop: 10,
  },
  icon: {
    alignSelf: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "dodgerblue",
    width: "50%",
    paddingVertical: 5,
    alignSelf: "center",
    borderRadius: 3,
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
