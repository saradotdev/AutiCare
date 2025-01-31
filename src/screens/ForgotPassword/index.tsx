import React from "react";
import { StyleSheet, View } from "react-native";
import { MyAppBar, MyButton, MyInput, MyText } from "../../components";
import theme from "../../../theme";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";

type ForgotPasswordNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

export default function ForgotPassword() {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

  return (
    <View>
      <MyAppBar />
      <MyText style={styles.main}>Forgot password?</MyText>
      <MyInput label="E-mail" placeholder="Type your email address" />
      <View style={{ alignItems: "center" }}>
        <MyButton
          textColor={theme.colorWhite}
          style={styles.cta}
          onPress={() => navigation.navigate("ChildTest")}
        >
          Send Code
        </MyButton>
      </View>
      <View style={styles.login}>
        <MyText style={{ color: theme.colorSmokeGrey }}>
          Remember password?{" "}
          <MyText
            style={{ color: theme.colorSummerSky }}
            onPress={() => navigation.navigate("SignIn")}
          >
            Login
          </MyText>
        </MyText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    fontSize: 28,
    marginHorizontal: 16,
    marginTop: 30,
  },
  cta: {
    backgroundColor: theme.colorSummerSky,
    marginTop: 10,
    width: 150,
  },
  login: {
    alignItems: "center",
    marginTop: 150,
  },
});
