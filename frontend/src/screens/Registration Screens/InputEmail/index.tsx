import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../types/navigation";
import { IconButton, MyAppBar, MyInput, MyText } from "../../../components";
import theme from "../../../../theme";

export default function InputEmail() {
  const [email, setEmail] = useState<string>("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View>
      <MyAppBar title="Register with E-mail" />
      <MyText style={styles.main}>Your E-mail?</MyText>
      <MyInput
        label="E-mail"
        placeholder="abc@gmail.com"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.forwardButton}>
        <IconButton
          iconName="arrow-forward"
          iconSize={36}
          iconColor={theme.colorWhite}
          backgroundColor={theme.colorSummerSky}
          onPress={() => navigation.navigate("InputPassword", { email })}
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
