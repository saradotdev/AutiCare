import React from "react";
import { ImageBackground, View } from "react-native";
import { MyButton, MyText } from "../../components";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import theme from "../../../theme";
import styles from "./index.styles";

const welcomeBg = require("../../assets/images/Welcome.png");
type WelcomeNavigationProp = StackNavigationProp<RootStackParamList, "Welcome">;

export default function Welcome() {
  const navigation = useNavigation<WelcomeNavigationProp>();

  return (
    <ImageBackground source={welcomeBg} style={styles.container}>
      <View style={styles.overlay}></View>

      <View style={styles.content}>
        <MyText style={styles.main}>Welcome to AutiCare</MyText>
        <MyText style={styles.sub}>
          Sign up and provide your child with the best and up-to-date exercises
          and games.
        </MyText>

        <View style={{ marginTop: 20, width: "100%", alignItems: "center" }}>
          <MyButton
            onPress={() => navigation.navigate("InputEmail")}
            style={styles.googleButton}
          >
            <View style={{ flexDirection: "row" }}>
              <AntDesign
                name="google"
                style={styles.icon}
                size={36}
                color={theme.colorWhite}
              />
              <MyText style={styles.googleButtonText}>
                Continue with Google
              </MyText>
            </View>
          </MyButton>

          <MyButton
            onPress={() => navigation.navigate("InputEmail")}
            style={styles.emailButton}
          >
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="email"
                style={styles.icon}
                size={36}
                color={theme.colorSummerSky}
              />
              <MyText style={styles.emailButtonText}>
                Register with Email
              </MyText>
            </View>
          </MyButton>

          <MyButton
            onPress={() => navigation.navigate("SignIn")}
            style={{ height: 20 }}
          >
            <MyText style={styles.signInButton}>Sign In</MyText>
          </MyButton>
        </View>
      </View>
    </ImageBackground>
  );
}
