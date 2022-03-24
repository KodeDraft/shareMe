import React, { useEffect, useState, useRef } from "react";
// NATIVE IMPORTS
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacityBase,
} from "react-native";
// CUSTOM HEADER COMPONENT
import Header from "../components/Header";
// ICON
import { Ionicons } from "@expo/vector-icons";
// ANIMATION
import * as Animatable from "react-native-animatable";
// FIREBASE
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateCurrentUser, updateProfile } from "firebase/auth";
// FIREBASE CONFIG
import { firebaseConfig } from "../config/firebaseConfig";
//  IMAGE PICKER
import * as ImagePicker from "expo-image-picker";
// BOTTOM SHEET FOR SELECTING IF THE USER WANT TO SELECT IMAGE OR TAKE IMAGE
import RBSheet from "react-native-raw-bottom-sheet";
// LOADER => INSTALLED
import LottieView from "lottie-react-native";

export default function Profile() {
  // GETTING DATA FROM FIREBASE AUTH
  useEffect(() => {
    console.log(currentUser);
    setName(user.displayName);
    setAvatar(user.photoURL);
    setEmail(user.email);
  }, []);

  // FIREBASE
  // GETTING THE CURRENT USER
  const currentUser = getAuth();
  const user = currentUser?.currentUser;
  const storage = getStorage();

  const [avatar, setAvatar] = useState(
    "https://apsec.iafor.org/wp-content/uploads/sites/37/2017/02/IAFOR-Blank-Avatar-Image.jpg"
  );

  // USER DATA
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  // BUTTON VISIBLITY
  const [editBtnVisible, setEditBtnVisible] = useState("flex");
  const [saveBtnVisible, setSaveBtnVisible] = useState("none");

  const [loader, setLoader] = useState(false);
  const [loaderModal, setLoaderModal] = useState(false);
  const [loadingText, setLoadingText] = useState("Updating Profile");

  // BOTTOM SHEET REFERENCE
  const selectRBSheet = useRef();

  // FUNCTIONS
  const timerForLoader = () => {
    setTimeout(function () {
      setLoadingText(
        "THIS IS TAKING MUCH LONGER, CHECK YOUR INTERNET CONNECTION"
      );
    }, 5000);
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatar(result.uri);
      setSaveBtnVisible("flex");
      setEditBtnVisible("none");
      selectRBSheet.current.close();
    }
  };
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    setAvatar(result.uri);

    // Explore the result

    if (!result.cancelled) {
      setAvatar(result.uri);
      setSaveBtnVisible("flex");
      setEditBtnVisible("none");

      selectRBSheet.current.close();
    }
  };
  const loading = () => {
    timerForLoader();
    return (
      <Modal visible={loaderModal} animationType="slide">
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
            source={require("../assets/animated/updating-loader.json")}
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
            {loadingText}
          </Text>
        </View>
      </Modal>
    );
  };
  // JSK FUNCTIONS
  const SelectSheetInner = () => {
    return (
      <>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.sheetTitle}>Upload Photo</Text>
        </View>
        <TouchableOpacity style={styles.sheetButton} onPress={openCamera}>
          <Text style={styles.sheetButtonTitle}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sheetButton} onPress={pickImage}>
          <Text style={styles.sheetButtonTitle}>Choose From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sheetButton}
          onPress={() => selectRBSheet.current.open()}
        >
          <Text style={styles.sheetButtonTitle}>Cancel</Text>
        </TouchableOpacity>
      </>
    );
  };
  // !important => UPDATING USER AVATAR
  const updateAvatar = async () => {
    const img = await fetch(avatar);
    const bytes = await img.blob();
    // GENERATING RANDOM KEY
    const userId = user.uid;
    const profilePathRef = ref(storage, `userProfiles/${userId}`);

    setLoaderModal(true);
    setLoader(true);
    await uploadBytes(profilePathRef, bytes).then(() => {
      getDownloadURL(profilePathRef).then((url) => {
        updateProfile(user, {
          photoURL: url,
        })
          .then(() => {
            alert("Updated Your Profile");
            setSaveBtnVisible("none");
            setEditBtnVisible("flex");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
    setLoaderModal(false);
    setLoader(false);
  };
  // JSK
  return (
    <View>
      {loader ? (
        loading()
      ) : (
        <>
          <Header
            // backgroundColor="#0f1e37"
            titleText="Profile"
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
            leftIcon={
              <Ionicons name="person-outline" size={35} color="#0f1e37" />
            }
          />
          <Animatable.View
            animation="slideInLeft"
            duration={500}
            direction="alternate"
          >
            <View style={styles.container}>
              <TouchableOpacity onPress={() => selectRBSheet.current.open()}>
                <View
                  style={styles.avatarHolder}
                  style={{ alignSelf: "center", marginTop: "5%" }}
                >
                  <Image
                    source={{ uri: avatar }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => selectRBSheet.current.open()}>
                {/* EDIT BTN */}
                <View
                  style={[
                    styles.btn,
                    { backgroundColor: "#0f1e37", display: editBtnVisible },
                  ]}
                >
                  <Text style={styles.btnText}>EDIT</Text>
                </View>
              </TouchableOpacity>

              {/* SAVE BTN */}
              <TouchableOpacity onPress={updateAvatar}>
                <View
                  style={[
                    styles.btn,
                    { backgroundColor: "#ff0095", display: saveBtnVisible },
                  ]}
                >
                  <Text style={styles.btnText}>SAVE</Text>
                </View>
              </TouchableOpacity>

              <Text style={[styles.label, { marginTop: 10 }]}>{name}</Text>
              <Text style={styles.label}>{email}</Text>
            </View>
            <View style={styles.bottomSheet}>
              <RBSheet
                ref={selectRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={() => selectRBSheet.current.close()}
                height={320}
                customStyles={{
                  draggableIcon: {
                    opacity: 0.5,
                    backgroundColor: "#000",
                  },
                }}
              >
                <SelectSheetInner />
              </RBSheet>
            </View>
          </Animatable.View>
        </>
      )}
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  label: {
    color: "#0f1e37",
    textAlign: "center",
    fontWeight: "800",
  },
  sheetHandle: {
    width: 40,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 5,
  },
  sheetTitle: {
    fontSize: 27,
    height: 35,
    color: "#0f1e37",
  },
  sheetButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#0f1e37",
    alignItems: "center",
    marginVertical: 7,
    alignSelf: "center",
    width: "90%",
  },
  sheetButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  btn: {
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignSelf: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
  },
});
