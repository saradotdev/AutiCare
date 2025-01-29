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
type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

export default function Welcome() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <ImageBackground source={welcomeBg} style={styles.container}>
      <View style={styles.overlay}></View>

      <View style={styles.content}>
        <MyText style={styles.main}>Welcome to AutiCare</MyText>
        <MyText style={styles.sub}>
          Sign up and provide your child with the best and up-to-date exercises
          and games.
        </MyText>

        <View
          style={{ marginVertical: 30, width: "100%", alignItems: "center" }}
        >
          <MyButton
            onPress={() => navigation.navigate("InputEmail")}
            hitSlop={20}
            style={styles.googleButton}
            activeOpacity={0.8}
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
            hitSlop={20}
            style={styles.emailButton}
            activeOpacity={0.9}
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

          <MyButton style={{ marginTop: 10 }}>
            <MyText style={styles.signInButton}>Sign In</MyText>
          </MyButton>
        </View>
      </View>
    </ImageBackground>
  );
}
