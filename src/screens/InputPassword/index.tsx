import React from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MyAppBar, MyButton, MyInput, MyText } from "../../components";
import theme from "../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";

type InputPasswordNavigationProp = StackNavigationProp<
  RootStackParamList,
  "InputPassword"
>;

export default function InputPassword() {
  const navigation = useNavigation<InputPasswordNavigationProp>();

  return (
    <View>
      <MyAppBar title="Register with E-mail" />
      <MyText style={styles.main}>Create a password</MyText>
      <MyText style={styles.sub}>Enter 8 or more characters</MyText>
      <MyInput label="Password" placeholder="********" />
      <View style={{ alignItems: "center" }}>
        <MyButton
          textColor={theme.colorWhite}
          style={styles.cta}
          onPress={() => navigation.navigate("ChildTest")}
        >
          Done
        </MyButton>
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
  sub: {
    color: theme.colorGrey,
    marginTop: 5,
    marginBottom: 30,
    marginHorizontal: 16,
  },
  cta: {
    backgroundColor: theme.colorSummerSky,
    marginTop: 10,
    width: 100,
  },
});
