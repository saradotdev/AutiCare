import React from "react";
import { IconButton, MyAppBar, MyInput, MyText } from "../../components";
import { StyleSheet, View } from "react-native";
import theme from "../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import { useNavigation } from "@react-navigation/native";

type SignInNavigationProp = StackNavigationProp<RootStackParamList, "SignIn">;

export default function SignIn() {
  const navigation = useNavigation<SignInNavigationProp>();

  return (
    <View>
      <MyAppBar
        rightAction="Forgot Password?"
        rightActionOnPress="ForgotPassword"
      />
      <MyText style={styles.main}>Your Details?</MyText>
      <MyInput label="E-mail" placeholder="abc@gmail.com" />
      <MyInput label="Password" placeholder="Enter your password" />
      <View style={styles.forwardButton}>
        <IconButton
          iconName="arrow-forward"
          iconSize={36}
          iconColor={theme.colorWhite}
          backgroundColor={theme.colorSummerSky}
          onPress={() => navigation.navigate("ChildTest")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    fontSize: 28,
    marginHorizontal: 16,
    marginVertical: 30,
  },
  forwardButton: {
    alignItems: "flex-end",
    marginHorizontal: 16,
  },
});
