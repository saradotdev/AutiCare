import React from "react";
import { StyleSheet, View } from "react-native";
import { MyAppBar, MyButton } from "../../components";
import { ChildDetails } from "../../components";
import theme from "../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import { useNavigation } from "@react-navigation/native";

type GenderSelectorNavigationProp = StackNavigationProp<
  RootStackParamList,
  "GenderSelector"
>;

export default function GenderSelector() {
  const main = "Select Gender";
  const sub = "Please select your child’s gender";
  const navigation = useNavigation<GenderSelectorNavigationProp>();

  return (
    <View style={{ alignItems: "center" }}>
      <MyAppBar />
      <ChildDetails main={main} sub={sub} />
      <MyButton
        style={styles.cta}
        textColor={theme.colorWhite}
        onPress={() => navigation.navigate("SpeechLevel")}
      >
        Continue
      </MyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  cta: {
    backgroundColor: theme.colorSummerSky,
    width: 218,
    top: 240,
  },
});
