import React from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import { IconButton, MyAppBar, MyInput, MyText } from "../../components";
import theme from "../../../theme";

type InputEmailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "InputEmail"
>;

export default function InputEmail() {
  const navigation = useNavigation<InputEmailNavigationProp>();

  return (
    <View>
      <MyAppBar title="Register with E-mail" />
      <MyText style={styles.main}>Your E-mail?</MyText>
      <MyInput label="E-mail" placeholder="abc@gmail.com" />
      <View style={styles.forwardButton}>
        <IconButton
          iconName="arrow-forward"
          iconSize={36}
          iconColor={theme.colorWhite}
          backgroundColor={theme.colorSummerSky}
          onPress={() => navigation.navigate("InputPassword")}
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
    margin: 16,
  },
});
