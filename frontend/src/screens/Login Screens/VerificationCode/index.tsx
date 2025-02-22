import React from "react";
import { StyleSheet, View } from "react-native";
import { MyAppBar, MyButton, MyInput, MyText } from "../../../components";
import theme from "../../../../theme";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation";

type VerificationCodeNavigationProp = StackNavigationProp<
  RootStackParamList,
  "VerificationCode"
>;

export default function VerificationCode() {
  const navigation = useNavigation<VerificationCodeNavigationProp>();

  return (
    <View>
      <MyAppBar />
      <MyText style={styles.main}>Enter the verification code</MyText>
      <MyInput label="Enter Code" placeholder="Enter the verification code" />
      <View style={{ alignItems: "center" }}>
        <MyButton
          textColor={theme.colorWhite}
          style={styles.cta}
          onPress={() => navigation.replace("ResetPassword")}
        >
          Reset Password
        </MyButton>
      </View>
      <View style={styles.login}>
        <MyText style={{ color: theme.colorSmoke }}>
          Didn’t receive a code?{" "}
        </MyText>
        <MyButton size={15} textColor={theme.colorSummerSky}>
          Resend
        </MyButton>
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
  cta: {
    backgroundColor: theme.colorSummerSky,
    marginTop: 10,
    width: 200,
  },
  login: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
});
