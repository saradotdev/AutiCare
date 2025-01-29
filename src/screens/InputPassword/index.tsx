import React from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconButton, MyInput, MyText } from "../../components";
import theme from "../../../theme";

export default function InputEmail() {
  const navigation = useNavigation();

  return (
    <View>
      <MyText style={styles.main}>Create a password</MyText>
      <MyInput label="Password" placeholder="********" />
      <View style={styles.forwardButton}>
        <IconButton
          iconName="arrow-forward"
          iconSize={36}
          iconColor={theme.colorWhite}
          backgroundColor={theme.colorSummerSky}
          onPress={() => navigation.goBack()}
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
