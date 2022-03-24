import React, { useState, useRef, useEffect } from "react";
// NATIVE IMPORTS
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
// ANIMATION
import * as Animatable from "react-native-animatable";
// LINEAR GRADIENT
import { LinearGradient } from "expo-linear-gradient";
// ICONS
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
// FIREBASE IMPORTS
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
// CONFIG
import firebaseConfig from "../config/firebaseConfig";

const SignUp = ({ navigation }) => {
  // VARIABLES

  // ERROR MESSAGE
  const [errorMessage, setErrorMessage] = useState(null);
  // SCROLL VIEW REF TO MAKE SCROLLER GO TOP IF THER EIS AN ERROR MESSAGE
  const scrollRef = useRef();
  // FIREBASE
  const auth = getAuth();

  // FUNCTIONS
  // IF ERROR THE SCROLL VIEW GOES TO THE TOP
  const scrollTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  // USER DATA => USER NAME AND STUFF
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });
  // HANDLE CHANGES OF INPUTS
  const textInputChange = (val) => {
    if (val.length !== 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };
  const handleNameChange = (val) => {
    setData({
      ...data,
      name: val,
    });
  };
  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };
  const handleConfirmPasswordChange = (val) => {
    setData({
      ...data,
      confirm_password: val,
    });
  };
  // MAKING THE PASSWORD INPUT TEXT SHOW WHEN THE IYE BUTTON IS CLICKED AND VICE VERSA
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry,
    });
  };

  // VALIDATION.. IF ALL ARE DONE IT WILLL SIGN UP
  const signUpHandler = () => {
    if (data.name.length < 1) {
      setErrorMessage("Enter Your Name");
      scrollTop();
    } else if (data.email.length < 1) {
      setErrorMessage("Enter Your Email");
      scrollTop();
    } else if (data.password.length < 8) {
      setErrorMessage("Password Should Be Greater Than 8 Charecters");
      scrollTop();
    } else if (data.confirm_password !== data.password) {
      setErrorMessage("Password Not Matching");
      scrollTop();
    } else {
      signUp();
    }
  };
  // !important => SIGN UP
  const signUp = async () => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        alert("Signed Up");
        // ...
      })
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: data.name,
          photoURL:
            "https://apsec.iafor.org/wp-content/uploads/sites/37/2017/02/IAFOR-Blank-Avatar-Image.jpg",
        });
        navigation.navigate("bottomTab");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setErrorMessage(errorCode ? errorCode : errorMessage);
        scrollTop();
        // ..
      });
  };

  // JSK
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ff8205" barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={require("../assets/app-logo.png")}
          style={styles.image_header}
          // resizeMethod="contain"
        />
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      {/* SLIDE IN CONTAINER */}
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView ref={scrollRef}>
          {/* CHECKING IF ERROR MESSAGE IS THERE */}
          <>
            {errorMessage ? (
              <View style={styles.errorArea}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </View>
            ) : (
              <Text /> // SIMPLY NOTHING
            )}
          </>
          <Text style={styles.text_footer}>Name</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Name"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => handleNameChange(val)}
            />
          </View>
          <Text style={[styles.text_footer, { marginTop: 35 }]}>Email</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => textInputChange(val)}
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Password
          </Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Password"
              secureTextEntry={data.secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => handlePasswordChange(val)}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Confirm Password
          </Text>

          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Confirm Your Password"
              secureTextEntry={data.confirm_secureTextEntry ? true : false}
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={(val) => handleConfirmPasswordChange(val)}
            />
            <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={{ ...styles.signIn, backgroundColor: "#ff8205" }}
              onPress={signUpHandler}
            >
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#fff",
                  },
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("SignIn")}
              style={[
                styles.signIn,
                {
                  borderColor: "#ff8205",
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}
            >
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#ff8205",
                  },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>
              By signing up you agree to our
            </Text>
            <Text style={[styles.color_textPrivate, { fontWeight: "bold" }]}>
              {" "}
              Terms of service
            </Text>
            <Text style={styles.color_textPrivate}> and</Text>
            <Text style={[styles.color_textPrivate, { fontWeight: "bold" }]}>
              {" "}
              Privacy policy
            </Text>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

// STYLES FOR THIS SCREEN
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff8205",
  },
  header: {
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  footer: {
    flex: Platform.OS === "ios" ? 3 : 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    paddingTop: 10,
  },
  image_header: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 55,
    borderRadius: 10,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#0f1e37",
    fontWeight: "600",
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textPrivate: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  color_textPrivate: {
    color: "grey",
  },
  errorArea: {
    backgroundColor: "#FA2A55",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
  },
  errorMessage: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: 2,
  },
});

// EXPORTING
export default SignUp;
