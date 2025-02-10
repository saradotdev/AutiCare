import React from "react";
import { StyleSheet, View } from "react-native";
import {
  MyAppBar,
  MyButton,
  ChildDetails,
  ScrollPicker,
} from "../../components";
import theme from "../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import { useNavigation } from "@react-navigation/native";

type AgePickerNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AgePicker"
>;

export default function AgePicker() {
  const main = "Pick the age of your child";
  const sub = "This will help us personalize your child’s app experience";
  const navigation = useNavigation<AgePickerNavigationProp>();

  return (
    <View style={{ alignItems: "center" }}>
      <MyAppBar />
      <ChildDetails main={main} sub={sub} />
      <ScrollPicker />
      <MyButton
        style={styles.cta}
        textColor={theme.colorWhite}
        onPress={() => navigation.navigate("GenderSelector")}
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
    bottom: -10,
  },
});
