import React, { useState, useRef, useEffect } from "react";
// NATIVE IMPORTS
import {
  View,
  Text,
  Image,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
// CUSTOM HEADER COMPONENT
import Header from "../components/Header";
// ICON
import { Ionicons } from "@expo/vector-icons";
// ANIMATION
import * as Animatable from "react-native-animatable";
// REACT NATIVE PAPER
import { TextInput } from "react-native-paper";
//  IMAGE PICKER
import * as ImagePicker from "expo-image-picker";
// BOTTOM SHEET FOR SELECTING IF THE USER WANT TO SELECT IMAGE OR TAKE IMAGE
import RBSheet from "react-native-raw-bottom-sheet";
// SWIPER
import { SwiperFlatList } from "react-native-swiper-flatlist";
// LOADER => INSTALLED
import LottieView from "lottie-react-native";
// FIREBASE
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore/lite";
import firebaseConfig from "../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

export default function Post() {
  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);
  }, []);
  // FIREBASE
  const db = getFirestore();
  const storage = getStorage();
  const currentUser = getAuth();
  const user = currentUser?.currentUser;

  // INPUTS
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [time, setTime] = useState();

  // LOADING USES
  const [loadingModal, setLoadingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("LOADING..");

  // BOTTOM SHEET REFERENCE
  const selectRBSheet = useRef();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPostImage(result.uri);
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

    setPostImage(result.uri);

    // Explore the result

    if (!result.cancelled) {
      setPostImage(result.uri);
      selectRBSheet.current.close();
    }
  };
  const inputError = (body) => {
    Alert.alert("All Inputs Are Required", body);
  };
  const timerForLoader = () => {
    setTimeout(function () {
      setLoadingText(
        "THIS IS TAKING MUCH LONGER, CHECK YOUR INTERNET CONNECTION"
      );
    }, 5000);
  };
  const uploadHandler = () => {
    if (title.length < 2) {
      inputError("Title Should be More Than 2 Letters");
    } else if (desc.length < 2) {
      inputError("Description Should Be More Than 2 Letters");
    } else if (postImage == null) {
      inputError("Add Image");
    } else {
      uploadPost();
    }
  };

  const uploadPost = async () => {
    const img = await fetch(postImage);
    const bytes = await img.blob();

    // GENERATING RANDOM KEY
    const randomKey = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 7);

    const postImgPathReference = ref(storage, `posts/${randomKey}`);

    setLoadingModal(true);
    setIsLoading(true);

    await uploadBytes(postImgPathReference, bytes).then(() => {
      getDownloadURL(postImgPathReference).then((url) => {
        setDoc(doc(db, "posts", randomKey), {
          postTitle: title,
          postDesc: desc,
          postUrl: url,
          postLikes: "2",
          postDate: new Date(),
          authorName: user.displayName,
          authorProfileUrl: user.photoURL,
          authorEmail: user.email,
          key: randomKey,
        });
      });
    });
    setIsLoading(false);
    setLoadingModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setPostImage(null);
  };
  // LOADER
  const loading = () => {
    timerForLoader();
    return (
      <Modal visible={isLoading} animationType="slide">
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
            source={require("../assets/animated/loader.json")}
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {!isLoading ? (
        <>
          {/* HEADER */}
          <View>
            <Header
              titleText="Post"
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
                <Ionicons name="add-circle-outline" size={35} color="#0f1e37" />
              }
            />
          </View>
          {/* SLIDE IN CONTAINER */}
          <Animatable.View
            animation="slideInLeft"
            duration={500}
            direction="alternate"
          >
            <ScrollView>
              <View style={styles.container}>
                <View style={styles.inputSwiper}>
                  <Text
                    style={{
                      color: "#0f1e37",
                      fontWeight: "800",
                      marginLeft: "5%",
                      marginBottom: 20,
                    }}
                  >
                    Just 4 Steps To Post
                  </Text>

                  <View style={styles.swiperContainer}>
                    <SwiperFlatList showPagination>
                      <View style={[styles.child]}>
                        <TextInput
                          label="Title"
                          value={title}
                          mode="flat"
                          onChangeText={(title) => setTitle(title)}
                          style={styles.input}
                        />
                      </View>
                      <View style={[styles.child]}>
                        <TextInput
                          label="Description"
                          value={desc}
                          mode="flat"
                          onChangeText={(desc) => setDesc(desc)}
                          style={styles.input}
                        />
                      </View>
                      <View style={[styles.child]}>
                        <View style={styles.imageContainer}>
                          <TouchableOpacity
                            onPress={() => selectRBSheet.current.open()}
                          >
                            <Ionicons
                              name="camera-outline"
                              size={35}
                              color="#fff"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={[styles.child]}>
                        <TouchableOpacity
                          style={styles.btn}
                          onPress={uploadHandler}
                        >
                          <Text style={styles.btnText}>POST</Text>
                        </TouchableOpacity>
                      </View>
                    </SwiperFlatList>
                  </View>
                </View>

                {/* DISPLAYING SELECTED IMAGE */}
                <View style={{ width: "80%", alignSelf: "center" }}>
                  {postImage && (
                    <Image
                      source={{ uri: postImage }}
                      style={{
                        width: 500,
                        height: 200,
                        alignSelf: "center",
                        marginTop: 20,
                      }}
                      resizeMode="contain"
                    />
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.bottomSheet}>
              <RBSheet
                ref={selectRBSheet}
                closeOnDragDown={true}
                // closeOnPressMask={() => selectRBSheet.current.close()}
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
      ) : (
        loading()
      )}
    </TouchableWithoutFeedback>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    marginTop: "5%",
  },
  input: {
    width: "90%",
    marginTop: 20,
    marginLeft: "5%",
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: 20,
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
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: "70%",
    marginVertical: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
    alignSelf: "center",
  },
  btnText: {
    color: "#0f1e37",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 20,
  },
  swiperContainer: {
    backgroundColor: "#0f1e37",
    flex: 1,
  },
  child: {
    width,
    height: 200,
    justifyContent: "center",
    backgroundColor: "#0f1e37",
  },
});
