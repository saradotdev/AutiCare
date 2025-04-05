import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MyAppBar, MyButton, MyInput, MyText } from "../../../components";
import theme from "../../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types";
import { registerUser } from "../../../api/authApi";

export default function InputPassword({ route }: any) {
  const { email } = route.params;
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await registerUser(email, password);
      console.log(response);
      setIsLoggedIn(true);
      navigation.reset({
        index: 0,
        routes: [{ name: "ChildTest" }],
      });
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colorSummerSky} />
      </View>
    );
  }

  if (isLoggedIn) return null; // avoid rendering the signup screen if user already logged in

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
          disabled={loading}
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
