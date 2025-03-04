import React from "react";
import { StyleSheet, View } from "react-native";
import { MyAppBar, MyButton, MyInput, MyText } from "../../../components";
import theme from "../../../../theme";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/navigation";

export default function ResetPassword() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View>
      <MyAppBar />
      <MyText style={styles.main}>Reset password</MyText>
      <MyInput
        label="Enter your new password"
        placeholder="Enter your new password"
      />
      <MyInput label="Confirm password" placeholder="Enter your new password" />
      <View style={{ alignItems: "center" }}>
        <MyButton
          textColor={theme.colorWhite}
          style={styles.cta}
          onPress={() => navigation.replace("SignIn")}
        >
          Login
        </MyButton>
      </View>
      <View style={styles.login}>
        <MyText style={{ color: theme.colorSmoke }}>Remember password? </MyText>
        <MyButton
          size={15}
          textColor={theme.colorSummerSky}
          onPress={() => navigation.navigate("SignIn")}
        >
          Login
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
    width: 158,
  },
  login: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});
