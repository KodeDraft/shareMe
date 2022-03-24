import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
// REACT NATIVE PAPER
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
// ICONS
import { AntDesign } from "@expo/vector-icons";
// FIREBASE
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
// FIREBASE CONFIG
import firebaseConfig from "../config/firebaseConfig";
// ANIMATION
import * as Animatable from "react-native-animatable";

export default function ViewPost() {
  useLayoutEffect(() => {
    getPosts();
  }, []);

  const [posts, setPosts] = useState([]);

  // FIREBASE
  const db = getFirestore();

  const getPosts = () => {
    const colRef = collection(db, "posts");

    const q = query(colRef, orderBy("postDate", "desc"));

    onSnapshot(q, (snapshot) => {
      let resievedPost = [];
      snapshot.docs.forEach((doc) => {
        resievedPost.push({
          ...doc.data(),
        });
      });

      setPosts(resievedPost);
    });
  };

  const [postLiked, setPostLiked] = useState(false);
  const { height } = Dimensions.get("screen");

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <>
            <Animatable.View animation="bounceInUp" duration={3000}>
              <Card style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 10,
                    marginTop: 10,
                  }}
                >
                  <Avatar.Image
                    size={24}
                    source={{ uri: item.authorProfileUrl }}
                    size={50}
                  />

                  <Card.Title title={item.authorName} style={{ width: 200 }} />
                </View>
                <Card.Content>
                  <Title style={{ color: "#0F1E37" }}></Title>
                </Card.Content>

                <TouchableOpacity>
                  <Image
                    source={{ uri: item.postUrl }}
                    resizeMode="contain"
                    resizeMethod="resize"
                    style={{ height: 200 }}
                  />
                </TouchableOpacity>

                <Paragraph
                  style={{ padding: 10, fontSize: 15, fontWeight: "bold" }}
                >
                  {item.postTitle}
                </Paragraph>
                <Paragraph style={{ paddingLeft: 10, color: "grey" }}>
                  {item.postDesc}
                </Paragraph>

                <Card.Actions>
                  <Button
                    onPress={() => {
                      setPostLiked(!postLiked);
                    }}
                    style={{
                      elevation: 1,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      paddingHorizontal: 10,
                    }}
                  >
                    {postLiked ? (
                      <AntDesign name="like2" size={24} color="#fc036b" />
                    ) : (
                      <AntDesign name="like2" size={24} color="black" />
                    )}{" "}
                    <Text
                      style={{
                        fontSize: 16,
                        paddingVertical: 10,
                        color: postLiked ? "#fc036b" : "#000",
                      }}
                    >
                      {item.postLikes}
                    </Text>
                  </Button>
                </Card.Actions>
              </Card>
            </Animatable.View>
          </>
        )}
        keyExtractor={(item) => item.key}
        ListFooterComponent={<View style={{ height: height - 400 }} />}
      />
    </View>
  );
}
