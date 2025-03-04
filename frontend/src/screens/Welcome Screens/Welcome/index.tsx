import React from "react";
import { ImageBackground, View } from "react-native";
import { MyButton, MyText } from "../../../components";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/navigation";
import theme from "../../../../theme";
import styles from "./index.styles";

const welcomeBg = require("../../../assets/images/Welcome.png");

export default function Welcome() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground source={welcomeBg} style={styles.container}>
      <View style={styles.overlay}></View>

      <View style={styles.content}>
        <MyText style={styles.main}>Welcome to AutiCare</MyText>
        <MyText style={styles.sub}>
          Sign up and provide your child with the best and up-to-date exercises
          and games.
        </MyText>

        <View style={styles.buttonsContainer}>
          <MyButton
            onPress={() => navigation.navigate("InputEmail")}
            style={styles.googleButton}
            textColor={theme.colorWhite}
            size={18}
            icon={
              <AntDesign name="google" size={36} color={theme.colorWhite} />
            }
          >
            Continue with Google
          </MyButton>

          <MyButton
            onPress={() => navigation.navigate("InputEmail")}
            style={styles.emailButton}
            size={18}
            textColor={theme.colorSummerSky}
            icon={
              <MaterialCommunityIcons
                name="email"
                size={36}
                color={theme.colorSummerSky}
              />
            }
          >
            Register with Email
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
