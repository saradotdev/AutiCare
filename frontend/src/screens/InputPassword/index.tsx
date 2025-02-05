import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MyAppBar, MyButton, MyInput, MyText } from "../../components";
import theme from "../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import { registerUser } from "../../api/authApi";

type InputPasswordNavigationProp = StackNavigationProp<
  RootStackParamList,
  "InputPassword"
>;

export default function InputPassword({ route }: any) {
  const { email } = route.params;
  const [password, setPassword] = useState<string>("");
  const navigation = useNavigation<InputPasswordNavigationProp>();

  const handleSubmit = async () => {
    const response = await registerUser(email, password);
    console.log(response);
    navigation.navigate("ChildTest");
  };

  return (
    <View>
      <MyAppBar title="Register with E-mail" />
      <MyText style={styles.main}>Create a password</MyText>
      <MyText style={styles.sub}>Enter 8 or more characters</MyText>
      <MyInput
        label="Password"
        placeholder="********"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={{ alignItems: "center" }}>
        <MyButton
          textColor={theme.colorWhite}
          style={styles.cta}
          onPress={handleSubmit}
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
    color: theme.colorMediumGrey,
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
