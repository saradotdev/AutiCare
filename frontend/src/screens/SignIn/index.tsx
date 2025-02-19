import React, { useState } from "react";
import { IconButton, MyAppBar, MyInput, MyText } from "../../components";
import { StyleSheet, View } from "react-native";
import theme from "../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../api/authApi";

type SignInNavigationProp = StackNavigationProp<RootStackParamList, "SignIn">;

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigation = useNavigation<SignInNavigationProp>();

  const handleSubmit = async () => {
    const response = await loginUser(email, password);
    console.log(response);
    navigation.navigate("Home");
  };

  return (
    <View>
      <MyAppBar
        rightAction="Forgot Password?"
        rightActionOnPress="ForgotPassword"
      />
      <MyText style={styles.main}>Your Details?</MyText>
      <MyInput
        label="E-mail"
        placeholder="abc@gmail.com"
        value={email}
        onChangeText={setEmail}
      />
      <MyInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.forwardButton}>
        <IconButton
          iconName="arrow-forward"
          iconSize={36}
          iconColor={theme.colorWhite}
          backgroundColor={theme.colorSummerSky}
          onPress={handleSubmit}
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
