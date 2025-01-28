import React from "react";
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { MyText } from "../../components";
import theme from "../../../theme";

const welcomeBg = require("../../assets/images/Welcome.png");

export default function Welcome() {
  return (
    <ImageBackground source={welcomeBg} style={styles.container}>
      <View style={styles.overlay}>
        <MyText style={styles.main}>Welcome to Auticare</MyText>
        <MyText style={styles.sub}>
          Sign up and provide your child with the best and up-to-date exercises
          and games.
        </MyText>
        <TouchableOpacity>
          <MyText style={styles.button}>Continue with Google</MyText>
        </TouchableOpacity>
        <TouchableOpacity>
          <MyText style={styles.button}>Register with Email</MyText>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    color: theme.colorWhite,
  },
  sub: {
    color: theme.colorWhite,
  },
  button: {
    color: theme.colorWhite,
  },
});
